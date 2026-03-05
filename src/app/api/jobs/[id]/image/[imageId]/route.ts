import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const JOBS_DIR = process.env.JOBS_DIR || '/home/brian/batchbg-jobs';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  const { id, imageId } = await params;
  const filePath = path.join(JOBS_DIR, id, 'processed', imageId + '.png');
  try {
    const buf = await fs.readFile(filePath);
    return new NextResponse(buf, {
      headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
