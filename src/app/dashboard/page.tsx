import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserJobs } from '@/lib/jobs';
import { getUserUsage, getUserPlan } from '@/lib/usage';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
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
  const usagePct = Math.min(100, Math.round((imagesUsed / monthlyLimit) * 100));
  const isFreeTrial = userPlan.planId === 'free_trial';
  const showUpgradeBanner = isFreeTrial && imagesUsed >= 3;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Backdrop
        </Link>
        <div className="flex items-center gap-4">
          {!isFreeTrial && (
            <ManageSubscriptionButton />
          )}
          <Link
            href="/upload"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + New Batch
          </Link>
          <UserButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Upgrade success message */}
        {upgraded && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-semibold text-green-900">
                You&apos;re now on the {userPlan.name} plan!
              </p>
              <p className="text-sm text-green-700">
                You can now process up to {monthlyLimit.toLocaleString()} images per month.
              </p>
            </div>
          </div>
        )}

        {/* Upgrade banner for free trial users */}
        {showUpgradeBanner && !upgraded && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-blue-900">You&apos;re almost out of free images</p>
              <p className="text-sm text-blue-700">
                You&apos;ve used {imagesUsed} of {monthlyLimit} free images. Upgrade to keep processing.
              </p>
            </div>
            <Link
              href="/pricing"
              className="shrink-0 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Upgrade →
            </Link>
          </div>
        )}

        {/* Usage Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-1">
            <h2 className="text-lg font-semibold text-gray-900">Usage This Month</h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {userPlan.name} plan
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
          <div className="flex items-end justify-between mb-2">
            <span className="text-3xl font-bold text-gray-900">{imagesUsed.toLocaleString()}</span>
            <span className="text-sm text-gray-500">{monthlyLimit.toLocaleString()} included</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${usagePct >= 90 ? 'bg-red-500' : usagePct >= 70 ? 'bg-yellow-500' : 'bg-blue-500'}`}
              style={{ width: `${usagePct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-400">{imagesUsed} of {monthlyLimit.toLocaleString()} images processed</p>
            {isFreeTrial && (
              <Link href="/pricing" className="text-xs text-blue-600 hover:underline">
                Upgrade plan →
              </Link>
            )}
          </div>
        </div>

        {/* Job History */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Job History</h2>
            <Link
              href="/upload"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Start new batch →
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 mb-4">No jobs yet.</p>
              <Link
                href="/upload"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Process your first batch
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Date</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Images</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Output</th>
                    <th className="text-right px-6 py-3 text-gray-500 font-medium">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(job.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {job.total_images}
                        {job.failed_images > 0 && (
                          <span className="text-red-500 text-xs ml-1">
                            ({job.failed_images} failed)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="px-6 py-4 text-gray-500 capitalize">{job.output_type}</td>
                      <td className="px-6 py-4 text-right">
                        {job.status === 'completed' ? (
                          <a
                            href={`/api/jobs/${job.id}/download`}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Download ZIP
                          </a>
                        ) : (
                          job.status === 'processing' ? (
                            <Link
                              href={`/processing/${job.id}`}
                              className="text-yellow-600 hover:text-yellow-700 font-medium"
                            >
                              View progress
                            </Link>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <DashboardClient />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: 'bg-green-100 text-green-700',
    processing: 'bg-yellow-100 text-yellow-700',
    queued: 'bg-gray-100 text-gray-600',
    failed: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

function ManageSubscriptionButton() {
  return <ManageSubscriptionClientButton />;
}

function ManageSubscriptionClientButton() {
  // This is rendered server-side — the actual interaction is in DashboardClient
  return (
    <button
      id="manage-subscription-btn"
      className="text-sm text-gray-600 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-300 transition-colors"
    >
      Manage subscription
    </button>
  );
}
