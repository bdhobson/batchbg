import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import stripe from '@/lib/stripe';
import { getUserPlan } from '@/lib/usage';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({})) as { immediate?: boolean };
  const immediate = body.immediate === true;

  const userPlan = await getUserPlan(userId);
  const subId = userPlan.stripeSubscriptionId;
  if (!subId) {
    return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
  }

  let cancelAt: string | null = null;

  if (immediate) {
    await stripe.subscriptions.cancel(subId);
    await pool.query(
      "UPDATE subscriptions SET status = 'canceled' WHERE clerk_user_id = $1",
      [userId]
    );
    cancelAt = new Date().toISOString();
  } else {
    const updated = await stripe.subscriptions.update(subId, {
      cancel_at_period_end: true,
    });
    const periodEnd = (updated as unknown as { current_period_end: number }).current_period_end;
    cancelAt = new Date(periodEnd * 1000).toISOString();
    await pool.query(
      "UPDATE subscriptions SET status = 'canceling' WHERE clerk_user_id = $1",
      [userId]
    );
  }

  return NextResponse.json({ success: true, cancelAt });
}
