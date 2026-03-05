import pool from './db';
import { randomBytes } from 'crypto';

export const FREE_TRIAL_LIMIT = 5;

export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

export async function getOrCreateSession(token: string): Promise<{ images_used: number }> {
  const res = await pool.query(
    `INSERT INTO free_trial_sessions (session_token, images_used)
     VALUES ($1, 0)
     ON CONFLICT (session_token) DO UPDATE SET session_token = EXCLUDED.session_token
     RETURNING images_used`,
    [token]
  );
  return res.rows[0];
}

export async function getSessionUsage(token: string): Promise<number> {
  const res = await pool.query(
    'SELECT images_used FROM free_trial_sessions WHERE session_token = $1',
    [token]
  );
  return res.rows[0]?.images_used ?? 0;
}

export async function incrementSessionUsage(token: string, count: number): Promise<void> {
  await pool.query(
    `INSERT INTO free_trial_sessions (session_token, images_used, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (session_token) DO UPDATE
     SET images_used = free_trial_sessions.images_used + $2,
         updated_at = NOW()`,
    [token, count]
  );
}
