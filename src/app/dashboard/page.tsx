import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserJobs } from '@/lib/jobs';
import { getUserUsage, getUserPlan } from '@/lib/usage';
import { Header } from '@/components/header';
import { UsageCard } from '@/components/usage-card';
import { JobHistory } from '@/components/job-history';
import { NewBatchSection } from './NewBatchSection';

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

  const isFreeTrial = userPlan.planId === 'free_trial';
  const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  type JobStatus = 'completed' | 'processing' | 'pending';
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
      <Header showNewBatch={false} />

      <main className="mx-auto max-w-3xl px-6 pt-24 pb-16 space-y-6">

        {/* Upgrade success */}
        {upgraded && (
          <div className="rounded-xl border border-border bg-card px-5 py-4 flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-semibold text-card-foreground">You&apos;re now on the {userPlan.name} plan!</p>
              <p className="text-sm text-muted-foreground">
                You can now process up to {userPlan.imageLimit.toLocaleString()} images per month.
              </p>
            </div>
          </div>
        )}

        {/* Compact usage bar */}
        <UsageCard
          used={imagesUsed}
          total={userPlan.imageLimit}
          month={month}
          plan={userPlan.name}
          isFreeTrial={isFreeTrial}
        />

        {/* Upload + background options */}
        <NewBatchSection planLimitReached={imagesUsed >= userPlan.imageLimit} />

        {/* Job history */}
        {mappedJobs.length > 0 && <JobHistory jobs={mappedJobs} />}

      </main>
    </div>
  );
}
