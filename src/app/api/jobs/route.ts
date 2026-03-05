import { NextRequest, NextResponse } from 'next/server';
import { createJob, addImageToJob, finalizeJobUpload } from '@/lib/jobs';
import { processJob } from '@/lib/processor';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const outputType = (formData.get('outputType') as string) || 'white';
    const outputColor = formData.get('outputColor') as string | null;
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        return NextResponse.json({ error: `Invalid file type: ${file.type}` }, { status: 400 });
      }
    }

    const jobId = await createJob(outputType as 'white' | 'transparent' | 'custom', outputColor);

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      await addImageToJob(jobId, file.name, buffer);
    }

    await finalizeJobUpload(jobId, files.length);

    // Fire-and-forget processing
    processJob(jobId).catch((err) => console.error('Job processing error:', err));

    return NextResponse.json({ jobId });
  } catch (err) {
    console.error('POST /api/jobs error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
