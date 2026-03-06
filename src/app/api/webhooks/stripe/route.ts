import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import stripe from '@/lib/stripe';
import pool from '@/lib/db';

function getPeriodEnd(sub: Stripe.Subscription): Date | null {
  // In newer Stripe API versions, period end is on the subscription items
  const item = sub.items?.data?.[0];
  if (item && 'current_period_end' in item) {
    return new Date((item as { current_period_end: number }).current_period_end * 1000);
  }
  // Fallback: check subscription-level (older API versions)
  if ('current_period_end' in sub) {
    return new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000);
  }
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  if (webhookSecret && sig) {
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  } else {
    // Dev mode: skip verification
    console.warn('⚠️  STRIPE_WEBHOOK_SECRET not set — skipping signature verification (dev mode)');
    try {
      event = JSON.parse(body) as Stripe.Event;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const clerkUserId = session.metadata?.clerk_user_id;
        const plan = session.metadata?.plan;
        if (!clerkUserId || !plan) break;

        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        // Fetch subscription to get period end
        const sub = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ['items'],
        });
        const periodEnd = getPeriodEnd(sub);

        await pool.query(
          `INSERT INTO subscriptions (clerk_user_id, stripe_customer_id, stripe_subscription_id, plan, status, current_period_end, updated_at)
           VALUES ($1, $2, $3, $4, 'active', $5, NOW())
           ON CONFLICT (clerk_user_id) DO UPDATE SET
             stripe_customer_id = EXCLUDED.stripe_customer_id,
             stripe_subscription_id = EXCLUDED.stripe_subscription_id,
             plan = EXCLUDED.plan,
             status = 'active',
             current_period_end = EXCLUDED.current_period_end,
             updated_at = NOW()`,
          [clerkUserId, customerId, subscriptionId, plan, periodEnd]
        );
        console.log(`✅ Subscription activated: ${clerkUserId} → ${plan}`);
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const clerkUserId = sub.metadata?.clerk_user_id;
        if (!clerkUserId) break;

        const plan = sub.metadata?.plan || 'starter';
        const status = sub.status === 'active' ? 'active' : sub.status === 'past_due' ? 'past_due' : 'canceled';
        const periodEnd = getPeriodEnd(sub);

        await pool.query(
          `UPDATE subscriptions SET plan = $1, status = $2, current_period_end = $3, updated_at = NOW()
           WHERE clerk_user_id = $4`,
          [plan, status, periodEnd, clerkUserId]
        );
        console.log(`✅ Subscription updated: ${clerkUserId} → ${plan} (${status})`);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const clerkUserId = sub.metadata?.clerk_user_id;
        if (!clerkUserId) break;

        await pool.query(
          `UPDATE subscriptions SET status = 'canceled', updated_at = NOW() WHERE clerk_user_id = $1`,
          [clerkUserId]
        );
        console.log(`✅ Subscription canceled: ${clerkUserId}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
