import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserJobs } from '@/lib/jobs';
import { getUserUsage, getUserPlan } from '@/lib/usage';
import { Header } from '@/components/header';
import { UsageCard } from '@/components/usage-card';
import { JobHistory } from '@/components/job-history';
import Link from 'next/link';
import DashboardClient from './DashboardClient';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const params = await searchParams;
  const upgraded = params.upgraded === 'true';

  const [jobs, imagesUsed, userPlan] = await Promise.all([
    getUserJobs(userId),
    getUserUsage(userId),
    getUserPlan(userId),
  ]);

  const monthlyLimit = userPlan.imageLimit;
  const isFreeTrial = userPlan.planId === 'free_trial';
  const showUpgradeBanner = isFreeTrial && imagesUsed >= 3;

  const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  // Map DB jobs to JobHistory format
  type JobStatus = "completed" | "processing" | "pending";
  const mappedJobs = jobs.map((job: {
    id: string;
    created_at: string;
    total_images: number;
    status: string;
    output_type: string;
    failed_images: number;
  }) => ({
    id: job.id,
    name: new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' batch',
    imageCount: job.total_images,
    status: (job.status === 'queued' ? 'pending' : job.status === 'failed' ? 'completed' : job.status) as JobStatus,
    createdAt: new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header showNewBatch />

      <main className="mx-auto max-w-4xl px-6 pt-24 pb-12 space-y-6">
        {/* Upgrade success */}
        {upgraded && (
          <div className="rounded-xl border border-border bg-card px-5 py-4 flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-semibold text-card-foreground">
                You&apos;re now on the {userPlan.name} plan!
              </p>
              <p className="text-sm text-muted-foreground">
                You can now process up to {monthlyLimit.toLocaleString()} images per month.
              </p>
            </div>
          </div>
        )}

        {/* Upgrade banner */}
        {showUpgradeBanner && !upgraded && (
          <div className="rounded-xl border border-border bg-card px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-card-foreground">You&apos;re almost out of free images</p>
              <p className="text-sm text-muted-foreground">
                You&apos;ve used {imagesUsed} of {monthlyLimit} free images. Upgrade to keep processing.
              </p>
            </div>
            <Link
              href="/pricing"
              className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Upgrade
            </Link>
          </div>
        )}

        <UsageCard
          used={imagesUsed}
          total={monthlyLimit}
          month={month}
          plan={userPlan.name}
        />

        <JobHistory jobs={mappedJobs} />
      </main>

      <DashboardClient />
    </div>
  );
}
