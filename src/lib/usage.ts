import pool from './db';
import { PlanId, PLANS } from './plans';

export async function getUserUsage(clerkUserId: string): Promise<number> {
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM
  const res = await pool.query(
    'SELECT images_used FROM user_usage WHERE clerk_user_id = $1 AND month = $2',
    [clerkUserId, month]
  );
  return res.rows[0]?.images_used ?? 0;
}

export async function incrementUserUsage(clerkUserId: string, count: number): Promise<void> {
  const month = new Date().toISOString().slice(0, 7);
  await pool.query(
    `INSERT INTO user_usage (clerk_user_id, month, images_used, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (clerk_user_id, month) DO UPDATE
     SET images_used = user_usage.images_used + $3,
         updated_at = NOW()`,
    [clerkUserId, month, count]
  );
}

export interface UserPlan {
  planId: PlanId;
  name: string;
  imageLimit: number;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  status: string;
}

export async function getUserPlan(clerkUserId: string): Promise<UserPlan> {
  const res = await pool.query(
    'SELECT * FROM subscriptions WHERE clerk_user_id = $1',
    [clerkUserId]
  );

  if (!res.rows[0]) {
    return {
      planId: 'free_trial',
      name: PLANS.free_trial.name,
      imageLimit: PLANS.free_trial.images,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      status: 'active',
    };
  }

  const sub = res.rows[0];
  const planId = (sub.plan as PlanId) in PLANS ? (sub.plan as PlanId) : 'free_trial';
  return {
    planId,
    name: PLANS[planId].name,
    imageLimit: PLANS[planId].images,
    stripeCustomerId: sub.stripe_customer_id,
    stripeSubscriptionId: sub.stripe_subscription_id,
    status: sub.status,
  };
}
