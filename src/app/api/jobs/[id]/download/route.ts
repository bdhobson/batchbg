import { NextRequest, NextResponse } from 'next/server';
import { getJob } from '@/lib/jobs';
import { auth } from '@clerk/nextjs/server';
import archiver from 'archiver';
import path from 'path';
import fs from 'fs';

const JOBS_DIR = process.env.JOBS_DIR || '/home/brian/batchbg-jobs';

function isSafePath(base: string, target: string): boolean {
  const resolved = path.resolve(target);
  return resolved.startsWith(path.resolve(base) + path.sep) || resolved === path.resolve(base);
}

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

  const processedDir = path.join(JOBS_DIR, id, 'processed');

  if (!isSafePath(JOBS_DIR, processedDir)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (!fs.existsSync(processedDir)) {
    return NextResponse.json({ error: 'No processed images found' }, { status: 404 });
  }

  const files = fs.readdirSync(processedDir);
  if (files.length === 0) {
    return NextResponse.json({ error: 'No processed images found' }, { status: 404 });
  }

  const shortId = id.replace(/-/g, '').slice(0, 8);
  const filename = `backdrop-${shortId}.zip`;

  const archive = archiver('zip', { zlib: { level: 6 } });
  archive.directory(processedDir, false);
  archive.finalize();

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  archive.on('data', (chunk: Buffer) => { writer.write(chunk); });
  archive.on('end', () => { writer.close(); });
  archive.on('error', (err: Error) => { writer.abort(err); });

  return new NextResponse(readable, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
