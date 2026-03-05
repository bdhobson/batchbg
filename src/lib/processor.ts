import Replicate from 'replicate';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import fetch from 'node-fetch';
import {
  getJob,
  getJobImages,
  updateImageStatus,
  incrementJobCompleted,
} from './jobs';

const JOBS_DIR = process.env.JOBS_DIR || '/home/brian/batchbg-jobs';
const MAX_CONCURRENT = 5;

export async function processJob(jobId: string) {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const job = await getJob(jobId);
  if (!job) return;

  const images = await getJobImages(jobId);
  const pending = images.filter((img) => img.status === 'pending');

  for (let i = 0; i < pending.length; i += MAX_CONCURRENT) {
    const chunk = pending.slice(i, i + MAX_CONCURRENT);
    await Promise.all(chunk.map((img) => processSingleImage(replicate, job, img)));
  }
}

async function processSingleImage(
  replicate: Replicate,
  job: { id: string; output_type: string; output_color: string | null },
  img: { id: string; original_filename: string }
) {
  try {
    await updateImageStatus(img.id, 'processing');

    const ext = path.extname(img.original_filename);
    const originalPath = path.join(JOBS_DIR, job.id, 'originals', img.id + ext);
    const imageBuffer = await fs.readFile(originalPath);
    const base64 = imageBuffer.toString('base64');
    const mimeType = ext.toLowerCase() === '.png' ? 'image/png' : ext.toLowerCase() === '.webp' ? 'image/webp' : 'image/jpeg';
    const dataUri = `data:${mimeType};base64,${base64}`;

    const output = await replicate.run(
      'lucataco/remove-bg:95fcc2a26d3899cd6c2691c900465aaeff466285',
      { input: { image: dataUri } }
    ) as unknown as string;

    const resp = await fetch(output);
    const pngBuffer = Buffer.from(await resp.arrayBuffer());

    let finalBuffer: Buffer;

    if (job.output_type === 'transparent') {
      finalBuffer = pngBuffer;
    } else {
      const color = job.output_type === 'white' ? '#ffffff' : (job.output_color || '#ffffff');
      // Parse hex color
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      const img_sharp = sharp(pngBuffer);
      const { width, height } = await img_sharp.metadata();
      const background = await sharp({
        create: { width: width!, height: height!, channels: 3, background: { r, g, b } }
      }).png().toBuffer();

      finalBuffer = await sharp(background)
        .composite([{ input: pngBuffer, blend: 'over' }])
        .png()
        .toBuffer();
    }

    const processedPath = path.join(JOBS_DIR, job.id, 'processed', img.id + '.png');
    await fs.writeFile(processedPath, finalBuffer);

    await updateImageStatus(img.id, 'completed');
    await incrementJobCompleted(job.id);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Error processing image ${img.id}:`, message);
    await updateImageStatus(img.id, 'failed', undefined, message);
    await incrementJobCompleted(job.id, true);
  }
}
