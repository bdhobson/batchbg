/**
 * Dev auth bypass — only active when CLERK_BYPASS=true in .env.local
 * Returns a fake userId for local development without Clerk running.
 * Never active in production (Vercel env does not have this var).
 */

export const DEV_USER_ID = 'dev_bypass_user_001'
export const IS_DEV_BYPASS = process.env.CLERK_BYPASS === 'true'

export function getDevAuth() {
  if (!IS_DEV_BYPASS) return null
  return { userId: DEV_USER_ID }
}
