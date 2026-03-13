import { NextRequest, NextResponse } from 'next/server';
import { getJob } from '@/lib/jobs';
import pool from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  const { id, imageId } = await params;

  const job = await getJob(id);
  if (!job) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const res = await pool.query(
    `SELECT processed_url FROM job_images WHERE id = $1 AND job_id = $2 AND status = 'completed'`,
    [imageId, id]
  );
  const row = res.rows[0];
  if (!row?.processed_url) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN!;
  const blobResp = await fetch(row.processed_url, {
    headers: { authorization: `Bearer ${token}` },
  });

  if (!blobResp.ok) {
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 502 });
  }

  const buffer = Buffer.from(await blobResp.arrayBuffer());
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
