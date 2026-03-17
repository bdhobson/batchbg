'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2, Download, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        if (!res.ok) { setError('Job not found'); return; }
        const data = await res.json();
        setJob(data);
      } catch {
        setError('Failed to fetch job status');
      }
    };

    poll();
    const interval = setInterval(() => {
      setJob((prev) => {
        if (prev?.status === 'completed') clearInterval(interval);
        return prev;
      });
      poll();
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
          <p className="text-foreground font-medium">{error}</p>
          <Link href="/new" className="text-sm text-muted-foreground hover:text-foreground mt-2 inline-block">Start a new batch</Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Loading job...</p>
        </div>
      </div>
    );
  }

  const progress = job.totalImages > 0
    ? Math.round(((job.completedImages + job.failedImages) / job.totalImages) * 100)
    : 0;

  const isDone = job.status === 'completed';
  const allFailed = isDone && job.completedImages === 0 && job.failedImages > 0;
  const partialFail = isDone && job.completedImages > 0 && job.failedImages > 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">B</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">Backdrop</span>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pt-24 pb-12">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {allFailed ? 'Batch Failed' : isDone ? 'Batch Complete' : 'Processing Batch'}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Job {job.id.slice(0, 8)}...</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">
              {job.completedImages + job.failedImages}<span className="text-muted-foreground font-normal text-lg"> / {job.totalImages}</span>
            </p>
            <p className="text-sm text-muted-foreground">images done</p>
          </div>
        </div>

        <div className="w-full bg-secondary rounded-full h-1.5 mb-6">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${allFailed ? 'bg-destructive' : 'bg-primary'}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* All images failed — prominent error state */}
        {allFailed && (
          <div className="rounded-xl border border-destructive/60 bg-destructive/10 p-5 mb-6 flex items-start gap-4">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-foreground">All {job.failedImages} image{job.failedImages !== 1 ? 's' : ''} failed to process</p>
              <p className="text-sm text-muted-foreground mt-1">
                This is usually caused by a temporary issue with our AI provider. Your image quota has not been charged for failed images. Please try again.
              </p>
            </div>
            <Link href="/new">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Try again
              </Button>
            </Link>
          </div>
        )}

        {/* Partial failure warning */}
        {partialFail && (
          <div className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{job.failedImages} image{job.failedImages !== 1 ? 's' : ''} failed</span> — failed images are marked with a red icon. The rest downloaded successfully.
            </p>
          </div>
        )}

        {/* Success + download */}
        {isDone && !allFailed && (
          <div className="rounded-xl border border-border bg-card p-5 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-foreground" />
              <div>
                <p className="font-semibold text-card-foreground">All done</p>
                <p className="text-sm text-muted-foreground">
                  {job.completedImages} processed{job.failedImages > 0 ? ` · ${job.failedImages} failed` : ''}
                </p>
              </div>
            </div>
            <a href={`/api/jobs/${job.id}/download`}>
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Download className="h-4 w-4" />
                Download ZIP
              </Button>
            </a>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {job.images.map((img) => (
            <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden bg-secondary border border-border group">
              {(img.status === 'completed' || img.status === 'failed') && (
                <img
                  src={img.status === 'completed' && img.processedUrl ? img.processedUrl : img.originalUrl}
                  alt={img.filename}
                  className="w-full h-full object-cover"
                />
              )}
              {img.status === 'pending' && (
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              )}
              {img.status === 'processing' && (
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-foreground" />
                </div>
              )}
              {img.status === 'completed' && (
                <div className="absolute top-1.5 right-1.5 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
              )}
              {img.status === 'failed' && (
                <div className="absolute inset-0 bg-background/70 flex flex-col items-center justify-center gap-1">
                  <XCircle className="h-6 w-6 text-destructive" />
                  <span className="text-xs text-muted-foreground font-medium">Failed</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-foreground/80 text-background text-xs px-2 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                {img.filename}
              </div>
              {img.status === 'completed' && img.processedUrl && (
                <a
                  href={img.processedUrl}
                  download={img.filename.replace(/\.[^.]+$/, '') + '_no_bg.png'}
                  className="absolute inset-0 flex items-center justify-center bg-foreground/0 hover:bg-foreground/20 transition-colors opacity-0 group-hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-foreground text-xs font-medium bg-background/80 px-2 py-1 rounded-lg">Download</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
