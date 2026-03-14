import { NextRequest, NextResponse } from 'next/server';
import { createJob, addImageToJob, finalizeJobUpload } from '@/lib/jobs';
import { submitImageToReplicate } from '@/lib/processor';
import { auth } from '@clerk/nextjs/server';
import { incrementUserUsage, getUserUsage, getUserPlan } from '@/lib/usage';
import pool from '@/lib/db';
import { after } from 'next/server';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
    }

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

    const userPlan = await getUserPlan(userId);
    const imagesUsed = await getUserUsage(userId);
    const remaining = userPlan.imageLimit - imagesUsed;

    if (imagesUsed >= userPlan.imageLimit) {
      return NextResponse.json(
        {
          error: 'plan_limit_reached',
          used: imagesUsed,
          limit: userPlan.imageLimit,
          plan: userPlan.planId,
          message: `You've used all ${userPlan.imageLimit.toLocaleString()} images on your ${userPlan.name} plan this month. Upgrade to process more.`,
        },
        { status: 403 }
      );
    }

    if (files.length > remaining) {
      return NextResponse.json(
        {
          error: 'plan_limit_would_exceed',
          used: imagesUsed,
          limit: userPlan.imageLimit,
          remaining,
          message: `You only have ${remaining} image${remaining === 1 ? '' : 's'} remaining on your ${userPlan.name} plan this month.`,
        },
        { status: 403 }
      );
    }

    const jobId = await createJob(outputType as 'white' | 'transparent' | 'custom', outputColor);
    await pool.query('UPDATE jobs SET clerk_user_id = $1 WHERE id = $2', [userId, jobId]);

    // Read all buffers and create DB records synchronously before returning
    const submissions: { imageId: string; filename: string; buffer: Buffer }[] = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const imageId = await addImageToJob(jobId, file.name);
      submissions.push({ imageId, filename: file.name, buffer });
    }

    await finalizeJobUpload(jobId, files.length);
    await incrementUserUsage(userId, files.length);

    // Submit to Replicate after response is sent (after() keeps function alive post-response)
    after(async () => {
      for (let i = 0; i < submissions.length; i++) {

        const { imageId, filename, buffer } = submissions[i];
        await submitImageToReplicate(imageId, filename, buffer).catch(err =>
          console.error(`Failed to submit image ${imageId} to Replicate:`, err)
        );
      }
    });

    return NextResponse.json({ jobId });
  } catch (err) {
    console.error('POST /api/jobs error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
