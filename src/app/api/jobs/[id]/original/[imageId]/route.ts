import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { getJobImages } from '@/lib/jobs';

const JOBS_DIR = process.env.JOBS_DIR || '/home/brian/batchbg-jobs';

function isSafePath(base: string, target: string): boolean {
  const resolved = path.resolve(target);
  return resolved.startsWith(path.resolve(base) + path.sep) || resolved === path.resolve(base);
}

function isSafeSegment(segment: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(segment);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  const { id, imageId } = await params;

  if (!isSafeSegment(id) || !isSafeSegment(imageId)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const images = await getJobImages(id);
  const img = images.find((i) => i.id === imageId);
  if (!img) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const ext = path.extname(img.original_filename);
  const filePath = path.join(JOBS_DIR, id, 'originals', imageId + ext);

  if (!isSafePath(JOBS_DIR, filePath)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    const buf = await fs.readFile(filePath);
    const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
    return new NextResponse(buf, {
      headers: { 'Content-Type': mimeType, 'Cache-Control': 'public, max-age=3600' },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
