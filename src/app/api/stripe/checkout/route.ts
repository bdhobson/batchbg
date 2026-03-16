import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import stripe from '@/lib/stripe';
import { getStripePriceId, PlanId, PLANS } from '@/lib/plans';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { planId } = await req.json() as { planId: PlanId };
  if (!planId || !(planId in PLANS) || planId === 'free_trial') {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const priceId = getStripePriceId(planId);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?upgraded=true`,
    cancel_url: `${baseUrl}/pricing`,
    metadata: { clerk_user_id: userId, plan: planId },
    subscription_data: {
      metadata: { clerk_user_id: userId, plan: planId },
    },
  });

  return NextResponse.json({ url: session.url });
}
