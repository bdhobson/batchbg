/**
 * Unified auth helper.
 * In production: delegates to Clerk.
 * With CLERK_BYPASS=true: returns the dev user without calling Clerk.
 */
import { auth as clerkAuth } from '@clerk/nextjs/server';
import { getDevAuth } from './dev-auth';

export async function auth(): Promise<{ userId: string | null }> {
  const dev = getDevAuth();
  if (dev) return dev;
  const { userId } = await clerkAuth();
  return { userId };
}
