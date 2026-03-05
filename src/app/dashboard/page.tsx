import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserJobs } from '@/lib/jobs';
import { getUserUsage } from '@/lib/usage';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

const MONTHLY_LIMIT = 1000;

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const [jobs, imagesUsed] = await Promise.all([
    getUserJobs(userId),
    getUserUsage(userId),
  ]);

  const usagePct = Math.min(100, Math.round((imagesUsed / MONTHLY_LIMIT) * 100));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          BatchBG
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/upload"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + New Batch
          </Link>
          <UserButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Usage Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Usage This Month</h2>
          <p className="text-sm text-gray-500 mb-4">
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
          <div className="flex items-end justify-between mb-2">
            <span className="text-3xl font-bold text-gray-900">{imagesUsed.toLocaleString()}</span>
            <span className="text-sm text-gray-500">{MONTHLY_LIMIT.toLocaleString()} included</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${usagePct >= 90 ? 'bg-red-500' : usagePct >= 70 ? 'bg-yellow-500' : 'bg-blue-500'}`}
              style={{ width: `${usagePct}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">{imagesUsed} of {MONTHLY_LIMIT} images processed</p>
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
