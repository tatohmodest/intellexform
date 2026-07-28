/**
 * Verifies Cloudinary can store and deliver PDF / DOCX documents.
 *
 * Run: npx tsx scripts/check-cloudinary-docs.ts
 */

import { config as loadEnv } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

loadEnv({ path: '.env.local' });
loadEnv({ path: '.env' });

const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? '';
const apiKey = process.env.CLOUDINARY_API_KEY ?? '';
const apiSecret = process.env.CLOUDINARY_API_SECRET ?? '';

if (!cloudName || !apiKey || !apiSecret) {
  console.error('Missing CLOUDINARY_* env vars. Set them in .env.local');
  process.exit(1);
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

/** Smallest valid one-page PDF. */
const MINIMAL_PDF = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj
trailer<</Root 1 0 R>>
%%EOF`;

async function probe(label: string, url: string) {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    const type = res.headers.get('content-type') || '';
    const isJsonError = type.includes('application/json');
    const status = res.ok && !isJsonError ? 'OK' : 'BLOCKED';
    console.log(`  ${status.padEnd(8)} ${label}`);
    console.log(`           status=${res.status} content-type=${type || 'n/a'}`);
    if (isJsonError) {
      const body = await res.text();
      console.log(`           body=${body.slice(0, 200)}`);
    }
    return res.ok && !isJsonError;
  } catch (err) {
    console.log(`  ERROR    ${label}: ${err instanceof Error ? err.message : err}`);
    return false;
  }
}

async function main() {
  console.log(`Cloudinary cloud: ${cloudName}\n`);

  const publicId = `intellex/_healthcheck/doc_${Date.now()}.pdf`;
  console.log('1. Uploading raw PDF (extension inside public_id)…');

  const uploaded = await new Promise<Record<string, unknown>>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { resource_type: 'raw', public_id: publicId, overwrite: true },
        (error, result) => (error ? reject(error) : resolve(result as Record<string, unknown>)),
      )
      .end(Buffer.from(MINIMAL_PDF, 'utf8'));
  });

  const secureUrl = String(uploaded.secure_url);
  console.log(`   uploaded: ${secureUrl}\n`);

  console.log('2. Delivery checks:');
  const inlineOk = await probe('plain URL (inline view)', secureUrl);
  const attachOk = await probe(
    'fl_attachment URL (download)',
    secureUrl.replace('/upload/', '/upload/fl_attachment/'),
  );
  const signed = cloudinary.utils.private_download_url(publicId, 'pdf', {
    resource_type: 'raw',
    type: 'upload',
    attachment: true,
    expires_at: Math.floor(Date.now() / 1000) + 300,
  });
  const signedOk = await probe('signed private_download_url (fallback)', signed);

  console.log('\n3. Cleaning up…');
  await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }).catch(() => {});

  console.log('\nSummary');
  console.log(`  inline view   : ${inlineOk ? 'working' : 'blocked'}`);
  console.log(`  fl_attachment : ${attachOk ? 'working' : 'blocked'}`);
  console.log(`  signed download: ${signedOk ? 'working' : 'blocked'}`);

  if (!inlineOk && !attachOk && !signedOk) {
    console.log(
      '\nAll delivery paths blocked. In Cloudinary: Settings → Security → enable delivery of PDF and ZIP files.',
    );
    process.exit(2);
  }
  if (!inlineOk) {
    console.log(
      '\nInline PDF viewing is blocked. Enable Settings → Security → PDF and ZIP files delivery.',
    );
  }
}

main().catch((err) => {
  console.error('Check failed:', err);
  process.exit(1);
});
