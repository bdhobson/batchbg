import { NextRequest, NextResponse } from 'next/server';
import { getSessionUsage, FREE_TRIAL_LIMIT } from '@/lib/sessions';

const SESSION_COOKIE = 'batchbg_session';

export async function GET(req: NextRequest) {
  const sessionToken = req.cookies.get(SESSION_COOKIE)?.value;
  if (!sessionToken) {
    return NextResponse.json({ used: 0, limit: FREE_TRIAL_LIMIT, remaining: FREE_TRIAL_LIMIT });
  }
  const used = await getSessionUsage(sessionToken);
  return NextResponse.json({
    used,
    limit: FREE_TRIAL_LIMIT,
    remaining: Math.max(0, FREE_TRIAL_LIMIT - used),
    exhausted: used >= FREE_TRIAL_LIMIT,
  });
}
