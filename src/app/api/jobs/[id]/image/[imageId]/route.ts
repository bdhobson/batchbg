import { NextRequest, NextResponse } from 'next/server';
import { getJob } from '@/lib/jobs';
import { auth } from '@/lib/auth';
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

  // Ownership check: verify the requesting user owns this job.
  // Supports both authenticated (Clerk) users and anonymous session-token users.
  const { userId } = await auth();
  const sessionToken = req.cookies.get('batchbg_session')?.value;

  const isOwner =
    (userId && job.clerk_user_id === userId) ||
    (sessionToken && job.session_token === sessionToken) ||
    (!job.clerk_user_id && !job.session_token);

  if (!isOwner) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
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
