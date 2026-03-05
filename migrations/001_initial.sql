-- BatchBG initial schema

CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY,
  status VARCHAR(20) NOT NULL DEFAULT 'queued',
  output_type VARCHAR(20) NOT NULL DEFAULT 'white',
  output_color VARCHAR(7),
  total_images INT NOT NULL DEFAULT 0,
  completed_images INT NOT NULL DEFAULT 0,
  failed_images INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job_images (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  original_filename VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  replicate_id VARCHAR(255),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_images_job_id ON job_images(job_id);
