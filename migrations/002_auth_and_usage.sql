-- BatchBG Week 2: Auth, free trial, usage tracking

CREATE TABLE IF NOT EXISTS free_trial_sessions (
  session_token VARCHAR(64) PRIMARY KEY,
  images_used INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id VARCHAR(255) NOT NULL,
  month VARCHAR(7) NOT NULL,
  images_used INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(clerk_user_id, month)
);

CREATE INDEX IF NOT EXISTS idx_user_usage_user_month ON user_usage(clerk_user_id, month);

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS session_token VARCHAR(64);

CREATE INDEX IF NOT EXISTS idx_jobs_clerk_user_id ON jobs(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_session_token ON jobs(session_token);
