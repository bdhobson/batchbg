import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import stripe from '@/lib/stripe';
import { getUserPlan } from '@/lib/usage';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userPlan = await getUserPlan(userId);
  if (!userPlan.stripeCustomerId) {
    return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003';
  const session = await stripe.billingPortal.sessions.create({
    customer: userPlan.stripeCustomerId,
    return_url: `${baseUrl}/dashboard`,
  });

  return NextResponse.json({ url: session.url });
}
