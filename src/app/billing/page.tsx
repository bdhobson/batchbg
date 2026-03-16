import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserPlan, getUserUsage } from '@/lib/usage';
import { Header } from '@/components/header';
import BillingClient from './BillingClient';
import pool from '@/lib/db';

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const params = await searchParams;
  const upgraded = params.upgraded === 'true';

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

  return (
    <div className="min-h-screen bg-background">
      <Header showNewBatch />
      <main className="mx-auto max-w-4xl px-6 pt-24 pb-12">
        <BillingClient
          planId={userPlan.planId}
          planName={userPlan.name}
          imageLimit={userPlan.imageLimit}
          imagesUsed={imagesUsed}
          status={userPlan.status}
          currentPeriodEnd={currentPeriodEnd}
          upgraded={upgraded}
        />
      </main>
    </div>
  );
}
