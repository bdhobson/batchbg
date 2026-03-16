import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import stripe from '@/lib/stripe';
import { getUserPlan } from '@/lib/usage';
import { getStripePriceId, PlanId, PLANS } from '@/lib/plans';
import pool from '@/lib/db';

const PLAN_ORDER: PlanId[] = ['free_trial', 'starter', 'pro', 'max'];

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { planId } = await req.json() as { planId: PlanId };
  if (!planId || !(planId in PLANS) || planId === 'free_trial') {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const userPlan = await getUserPlan(userId);
  const currentIdx = PLAN_ORDER.indexOf(userPlan.planId);
  const targetIdx = PLAN_ORDER.indexOf(planId);

  const isUpgrade = targetIdx > currentIdx;

  if (isUpgrade) {
    // Create checkout session
    const priceId = getStripePriceId(planId);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/billing?upgraded=true`,
      cancel_url: `${baseUrl}/billing`,
      metadata: { clerk_user_id: userId, plan: planId },
      subscription_data: {
        metadata: { clerk_user_id: userId, plan: planId },
      },
      ...(userPlan.stripeCustomerId ? { customer: userPlan.stripeCustomerId } : {}),
    });

    return NextResponse.json({ url: session.url });
  } else {
    // Downgrade: update subscription directly
    const subId = userPlan.stripeSubscriptionId;
    if (!subId) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
    }

    const priceId = getStripePriceId(planId);

    // Get current subscription to find the item id
    const sub = await stripe.subscriptions.retrieve(subId);
    const itemId = sub.items.data[0]?.id;
    if (!itemId) {
      return NextResponse.json({ error: 'Subscription item not found' }, { status: 400 });
    }

    await stripe.subscriptions.update(subId, {
      proration_behavior: 'none',
      billing_cycle_anchor: 'unchanged',
      items: [{ id: itemId, price: priceId }],
    });

    // Update DB
    await pool.query(
      'UPDATE subscriptions SET plan = $1 WHERE clerk_user_id = $2',
      [planId, userId]
    );

    return NextResponse.json({ success: true });
  }
}
