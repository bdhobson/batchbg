import { NextRequest, NextResponse } from 'next/server';
import { getJob } from '@/lib/jobs';
import { auth } from '@clerk/nextjs/server';
import archiver from 'archiver';
import path from 'path';
import fs from 'fs';

const JOBS_DIR = process.env.JOBS_DIR || '/home/brian/batchbg-jobs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const job = await getJob(id);
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  // Allow download if authenticated OR if session matches
  const { userId } = await auth();
  const sessionToken = req.cookies.get('batchbg_session')?.value;

  const isOwner =
    (userId && job.clerk_user_id === userId) ||
    (sessionToken && job.session_token === sessionToken) ||
    (!job.clerk_user_id && !job.session_token); // legacy jobs

  if (!isOwner) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const processedDir = path.join(JOBS_DIR, id, 'processed');

  if (!fs.existsSync(processedDir)) {
    return NextResponse.json({ error: 'No processed images found' }, { status: 404 });
  }

  const files = fs.readdirSync(processedDir);
  if (files.length === 0) {
    return NextResponse.json({ error: 'No processed images found' }, { status: 404 });
  }

  const shortId = id.replace(/-/g, '').slice(0, 8);
  const filename = `batchbg-${shortId}.zip`;

  const archive = archiver('zip', { zlib: { level: 6 } });
  archive.directory(processedDir, false);
  archive.finalize();

  // Use a TransformStream to pipe Node stream to Web ReadableStream
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  archive.on('data', (chunk: Buffer) => {
    writer.write(chunk);
  });
  archive.on('end', () => {
    writer.close();
  });
  archive.on('error', (err: Error) => {
    writer.abort(err);
  });

  return new NextResponse(readable, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
