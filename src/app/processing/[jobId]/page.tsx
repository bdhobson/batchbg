'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';

interface ImageData {
  id: string;
  filename: string;
  status: string;
  processedUrl: string | null;
  originalUrl: string;
}

interface JobData {
  id: string;
  status: string;
  totalImages: number;
  completedImages: number;
  failedImages: number;
  images: ImageData[];
}

export default function ProcessingPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = use(params);
  const [job, setJob] = useState<JobData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const poll = async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) {
          setError('Job not found');
          return;
        }
        const data = await res.json();
        setJob(data);
      } catch {
        setError('Failed to fetch job status');
      }
    };

    poll();
    const interval = setInterval(() => {
      setJob((prev) => {
        if (prev?.status === 'completed') {
          clearInterval(interval);
        }
        return prev;
      });
      poll();
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  if (error) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl">{error}</p>
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-gray-400">Loading job…</p>
        </div>
      </main>
    );
  }

  const progress = job.totalImages > 0
    ? Math.round(((job.completedImages + job.failedImages) / job.totalImages) * 100)
    : 0;

  const isDone = job.status === 'completed';

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Processing Batch</h1>
            <p className="text-gray-400 text-sm mt-1">Job {job.id.slice(0, 8)}…</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold">
              {job.completedImages + job.failedImages} / {job.totalImages}
            </p>
            <p className="text-gray-400 text-sm">images done</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-800 rounded-full h-3 mb-6">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {isDone && (
          <div className="bg-green-900/40 border border-green-700 rounded-xl p-4 mb-6 text-center">
            <p className="text-green-400 font-semibold text-lg">✅ All done!</p>
            <p className="text-gray-400 text-sm mt-1">
              {job.completedImages} processed · {job.failedImages} failed
            </p>
          </div>
        )}

        {/* Thumbnail grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {job.images.map((img) => (
            <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-900 border border-gray-800 group">
              {/* Show processed if done, else original */}
              <img
                src={img.status === 'completed' && img.processedUrl ? img.processedUrl : img.originalUrl}
                alt={img.filename}
                className="w-full h-full object-cover"
              />

              {/* Status overlay */}
              {img.status === 'pending' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {img.status === 'processing' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {img.status === 'completed' && (
                <div className="absolute top-1 right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
              )}
              {img.status === 'failed' && (
                <div className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs">
                  ✕
                </div>
              )}

              {/* Filename tooltip */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                {img.filename}
              </div>

              {/* Download on hover for completed */}
              {img.status === 'completed' && img.processedUrl && (
                <a
                  href={img.processedUrl}
                  download={img.filename.replace(/\.[^.]+$/, '') + '_no_bg.png'}
                  className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-white text-xs font-medium bg-black/60 px-2 py-1 rounded">Download</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
