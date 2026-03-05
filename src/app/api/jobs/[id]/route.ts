import { NextRequest, NextResponse } from 'next/server';
import { getJob, getJobImages } from '@/lib/jobs';
import path from 'path';
import fs from 'fs/promises';

const JOBS_DIR = process.env.JOBS_DIR || '/home/brian/batchbg-jobs';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  const images = await getJobImages(id);

  // Build image status with thumbnail URLs
  const imageData = images.map((img) => ({
    id: img.id,
    filename: img.original_filename,
    status: img.status,
    // Thumbnail URL for processed images
    processedUrl: img.status === 'completed' ? `/api/jobs/${id}/image/${img.id}` : null,
    originalUrl: `/api/jobs/${id}/original/${img.id}`,
  }));

  return NextResponse.json({
    id: job.id,
    status: job.status,
    outputType: job.output_type,
    totalImages: job.total_images,
    completedImages: job.completed_images,
    failedImages: job.failed_images,
    createdAt: job.created_at,
    images: imageData,
  });
}
