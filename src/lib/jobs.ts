import { v4 as uuidv4 } from 'uuid';
import pool from './db';

export type OutputType = 'white' | 'transparent' | 'custom';

export interface Job {
  id: string;
  status: string;
  output_type: OutputType;
  output_color: string | null;
  total_images: number;
  completed_images: number;
  failed_images: number;
  created_at: string;
  updated_at: string;
  clerk_user_id?: string | null;
  session_token?: string | null;
  thumbnails?: string[];
  thumbnail_image_ids?: string[];
}

export interface JobImage {
  id: string;
  job_id: string;
  original_filename: string;
  status: string;
  replicate_id: string | null;
  error_message: string | null;
  processed_url: string | null;
}

export async function createJob(
  outputType: OutputType,
  outputColor: string | null
): Promise<string> {
  const jobId = uuidv4();
  await pool.query(
    `INSERT INTO jobs (id, status, output_type, output_color) VALUES ($1, 'queued', $2, $3)`,
    [jobId, outputType, outputColor]
  );
  return jobId;
}

export async function addImageToJob(
  jobId: string,
  filename: string
): Promise<string> {
  const imageId = uuidv4();
  await pool.query(
    `INSERT INTO job_images (id, job_id, original_filename, status) VALUES ($1, $2, $3, 'pending')`,
    [imageId, jobId, filename]
  );
  return imageId;
}

export async function updateImageProcessedUrl(imageId: string, url: string) {
  await pool.query(
    `UPDATE job_images SET processed_url = $1, updated_at = NOW() WHERE id = $2`,
    [url, imageId]
  );
}

export async function finalizeJobUpload(jobId: string, totalImages: number) {
  await pool.query(
    `UPDATE jobs SET total_images = $1, status = 'processing', updated_at = NOW() WHERE id = $2`,
    [totalImages, jobId]
  );
}

export async function getJob(jobId: string): Promise<Job | null> {
  const res = await pool.query(`SELECT * FROM jobs WHERE id = $1`, [jobId]);
  return res.rows[0] || null;
}

export async function getJobImages(jobId: string): Promise<JobImage[]> {
  const res = await pool.query(
    `SELECT * FROM job_images WHERE job_id = $1 ORDER BY created_at`,
    [jobId]
  );
  return res.rows;
}

export async function updateImageStatus(
  imageId: string,
  status: string,
  replicateId?: string,
  errorMessage?: string
) {
  await pool.query(
    `UPDATE job_images SET status = $1, replicate_id = $2, error_message = $3, updated_at = NOW() WHERE id = $4`,
    [status, replicateId || null, errorMessage || null, imageId]
  );
}

export async function incrementJobCompleted(jobId: string, failed = false) {
  if (failed) {
    await pool.query(
      `UPDATE jobs SET failed_images = failed_images + 1, updated_at = NOW() WHERE id = $1`,
      [jobId]
    );
  } else {
    await pool.query(
      `UPDATE jobs SET completed_images = completed_images + 1, updated_at = NOW() WHERE id = $1`,
      [jobId]
    );
  }
  const res = await pool.query(
    `SELECT total_images, completed_images, failed_images FROM jobs WHERE id = $1`,
    [jobId]
  );
  const { total_images, completed_images, failed_images } = res.rows[0];
  if (completed_images + failed_images >= total_images) {
    await pool.query(
      `UPDATE jobs SET status = 'completed', updated_at = NOW() WHERE id = $1`,
      [jobId]
    );
  }
}

export async function getUserJobs(clerkUserId: string): Promise<Job[]> {
  const res = await pool.query(
    `SELECT j.*,
       COALESCE(
         ARRAY(
           SELECT ji.id
           FROM job_images ji
           WHERE ji.job_id = j.id
             AND ji.status = 'completed'
             AND ji.processed_url IS NOT NULL
           ORDER BY ji.created_at
           LIMIT 3
         ),
         ARRAY[]::text[]
       ) AS thumbnail_image_ids
     FROM jobs j
     WHERE j.clerk_user_id = $1
     ORDER BY j.created_at DESC
     LIMIT 50`,
    [clerkUserId]
  );
  return res.rows;
}
