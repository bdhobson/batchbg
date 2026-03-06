import { NextRequest, NextResponse } from 'next/server';
import { createJob, addImageToJob, finalizeJobUpload } from '@/lib/jobs';
import { processJob } from '@/lib/processor';
import { auth } from '@clerk/nextjs/server';
import {
  generateSessionToken,
  getSessionUsage,
  FREE_TRIAL_LIMIT,
} from '@/lib/sessions';
import { incrementUserUsage, getUserUsage, getUserPlan } from '@/lib/usage';
import pool from '@/lib/db';

const SESSION_COOKIE = 'batchbg_session';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

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

    // Determine session token for anonymous users
    let sessionToken = req.cookies.get(SESSION_COOKIE)?.value ?? null;
    if (!sessionToken && !userId) {
      sessionToken = generateSessionToken();
    }

    // Gate anonymous users at processing step
    if (!userId && sessionToken) {
      const used = await getSessionUsage(sessionToken);
      if (used >= FREE_TRIAL_LIMIT) {
        return NextResponse.json(
          { error: 'free_trial_exhausted', used, limit: FREE_TRIAL_LIMIT },
          { status: 402 }
        );
      }
      const remaining = FREE_TRIAL_LIMIT - used;
      if (files.length > remaining) {
        return NextResponse.json(
          {
            error: 'free_trial_would_exceed',
            used,
            limit: FREE_TRIAL_LIMIT,
            remaining,
            message: `You have ${remaining} free image${remaining === 1 ? '' : 's'} remaining. Sign up to process more.`,
          },
          { status: 402 }
        );
      }
    }

    // Gate signed-in users by their plan limit
    if (userId) {
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
    }

    const jobId = await createJob(outputType as 'white' | 'transparent' | 'custom', outputColor);

    // Link job to user or session
    if (userId) {
      await pool.query('UPDATE jobs SET clerk_user_id = $1 WHERE id = $2', [userId, jobId]);
    } else if (sessionToken) {
      await pool.query('UPDATE jobs SET session_token = $1 WHERE id = $2', [sessionToken, jobId]);
    }

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      await addImageToJob(jobId, file.name, buffer);
    }

    await finalizeJobUpload(jobId, files.length);

    // Fire-and-forget processing
    processJob(jobId).then(async () => {
      // After processing completes, update usage counts
      if (userId) {
        await incrementUserUsage(userId, files.length);
      } else if (sessionToken) {
        const { incrementSessionUsage } = await import('@/lib/sessions');
        await incrementSessionUsage(sessionToken, files.length);
      }
    }).catch((err) => console.error('Job processing error:', err));

    const response = NextResponse.json({ jobId });

    // Set session cookie for anonymous users
    if (!userId && sessionToken) {
      response.cookies.set(SESSION_COOKIE, sessionToken, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      });
    }

    return response;
  } catch (err) {
    console.error('POST /api/jobs error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
