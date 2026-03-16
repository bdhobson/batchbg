import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserPlan, getUserUsage } from '@/lib/usage';
import pool from '@/lib/db';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [userPlan, imagesUsed] = await Promise.all([
    getUserPlan(userId),
    getUserUsage(userId),
  ]);

  let currentPeriodEnd: string | null = null;
  if (userPlan.stripeSubscriptionId) {
    const res = await pool.query(
      'SELECT current_period_end FROM subscriptions WHERE clerk_user_id = $1',
      [userId]
    );
    currentPeriodEnd = res.rows[0]?.current_period_end?.toISOString() ?? null;
  }

  return NextResponse.json({
    planId: userPlan.planId,
    name: userPlan.name,
    imageLimit: userPlan.imageLimit,
    imagesUsed,
    status: userPlan.status,
    currentPeriodEnd,
    stripeCustomerId: userPlan.stripeCustomerId,
    stripeSubscriptionId: userPlan.stripeSubscriptionId,
  });
}
