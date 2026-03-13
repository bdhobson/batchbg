import { NextRequest, NextResponse } from 'next/server';
import { getJob, getJobImages } from '@/lib/jobs';
import { checkAndFinalizeImage } from '@/lib/processor';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  // Check and finalize any in-progress images
  const images = await getJobImages(id);
  const processingImages = images.filter(
    (img) => img.status === 'processing' && img.replicate_id
  );

  await Promise.all(
    processingImages.map((img) =>
      checkAndFinalizeImage(
        img.id,
        img.replicate_id!,
        job.output_type,
        job.output_color
      ).catch((err) => console.error(`Error finalizing image ${img.id}:`, err))
    )
  );

  // Re-fetch after checks
  const updatedImages = await getJobImages(id);
  const updatedJob = await getJob(id);

  const imageData = updatedImages.map((img) => ({
    id: img.id,
    filename: img.original_filename,
    status: img.status,
    // Proxy URL — image route fetches from blob storage server-side
    processedUrl: img.status === 'completed' && img.processed_url
      ? `/api/jobs/${id}/image/${img.id}`
      : null,
  }));

  return NextResponse.json({
    id: updatedJob!.id,
    status: updatedJob!.status,
    outputType: updatedJob!.output_type,
    totalImages: updatedJob!.total_images,
    completedImages: updatedJob!.completed_images,
    failedImages: updatedJob!.failed_images,
    createdAt: updatedJob!.created_at,
    images: imageData,
  });
}
