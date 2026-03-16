import { NextRequest, NextResponse } from 'next/server';
import { getJob, getJobImages } from '@/lib/jobs';
import { auth } from '@/lib/auth';
import archiver from 'archiver';

function isSafeSegment(segment: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(segment);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isSafeSegment(id)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const job = await getJob(id);
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  const { userId } = await auth();
  const sessionToken = req.cookies.get('batchbg_session')?.value;

  const isOwner =
    (userId && job.clerk_user_id === userId) ||
    (sessionToken && job.session_token === sessionToken) ||
    (!job.clerk_user_id && !job.session_token);

  if (!isOwner) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const images = await getJobImages(id);
  const completedImages = images.filter((img) => img.status === 'completed' && img.processed_url);

  if (completedImages.length === 0) {
    return NextResponse.json({ error: 'No processed images found' }, { status: 404 });
  }

  const shortId = id.replace(/-/g, '').slice(0, 8);
  const filename = `backdrop-${shortId}.zip`;
  const token = process.env.BLOB_READ_WRITE_TOKEN!;

  const archive = archiver('zip', { zlib: { level: 6 } });
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  archive.on('data', (chunk: Buffer) => { writer.write(chunk); });
  archive.on('end', () => { writer.close(); });
  archive.on('error', (err: Error) => { writer.abort(err); });

  (async () => {
    for (const img of completedImages) {
      try {
        const resp = await fetch(img.processed_url!, {
          headers: { authorization: `Bearer ${token}` },
        });
        if (resp.ok) {
          const buf = Buffer.from(await resp.arrayBuffer());
          const outName = img.original_filename.replace(/\.[^.]+$/, '') + '.png';
          archive.append(buf, { name: outName });
        }
      } catch (e) {
        console.error(`Error fetching image ${img.id} for zip:`, e);
      }
    }
    archive.finalize();
  })();

  return new NextResponse(readable, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
