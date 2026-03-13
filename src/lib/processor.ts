import Replicate from 'replicate';
import sharp from 'sharp';
import { put } from '@vercel/blob';
import pool from './db';
import {
  updateImageStatus,
  updateImageProcessedUrl,
  incrementJobCompleted,
} from './jobs';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function submitImageToReplicate(
  imageId: string,
  filename: string,
  buffer: Buffer
): Promise<void> {
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
  const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
  const base64 = buffer.toString('base64');
  const dataUri = `data:${mimeType};base64,${base64}`;

  const prediction = await replicate.predictions.create({
    version: '95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1',
    input: { image: dataUri },
  });

  await pool.query(
    `UPDATE job_images SET replicate_id = $1, status = 'processing', updated_at = NOW() WHERE id = $2`,
    [prediction.id, imageId]
  );
}

export async function checkAndFinalizeImage(
  imageId: string,
  replicateId: string,
  outputType: string,
  outputColor: string | null
): Promise<'pending' | 'completed' | 'failed'> {
  const prediction = await replicate.predictions.get(replicateId);

  if (prediction.status === 'starting' || prediction.status === 'processing') {
    return 'pending';
  }

  // Get job_id for incrementJobCompleted
  const imgRes = await pool.query(`SELECT job_id FROM job_images WHERE id = $1`, [imageId]);
  const jobId = imgRes.rows[0]?.job_id;

  if (prediction.status === 'succeeded') {
    const outputUrl = prediction.output as string;
    const resp = await fetch(outputUrl);
    const pngBuffer = Buffer.from(await resp.arrayBuffer());

    let finalBuffer: Buffer;

    if (outputType === 'transparent') {
      finalBuffer = pngBuffer;
    } else {
      const color = outputType === 'white' ? '#ffffff' : (outputColor || '#ffffff');
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      const imgSharp = sharp(pngBuffer);
      const { width, height } = await imgSharp.metadata();
      const background = await sharp({
        create: { width: width!, height: height!, channels: 3, background: { r, g, b } },
      })
        .png()
        .toBuffer();

      finalBuffer = await sharp(background)
        .composite([{ input: pngBuffer, blend: 'over' }])
        .png()
        .toBuffer();
    }

    const blob = await put(`jobs/${imageId}.png`, finalBuffer, {
      access: 'private',
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    });

    await updateImageProcessedUrl(imageId, blob.url);
    await updateImageStatus(imageId, 'completed');
    if (jobId) await incrementJobCompleted(jobId);
    return 'completed';
  }

  // failed or other terminal state
  const errorMsg = (prediction.error as string) || 'Replicate prediction failed';
  await updateImageStatus(imageId, 'failed', undefined, errorMsg);
  if (jobId) await incrementJobCompleted(jobId, true);
  return 'failed';
}
