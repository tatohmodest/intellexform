import type { BrandUploadKind } from '@/lib/cloudinary';
import { prepareImageForUpload } from '@/lib/compressImage';

export type UploadedMedia = {
  url: string;
  bytes: number;
  publicId: string;
};

const KIND_MAX_EDGE: Record<BrandUploadKind, number> = {
  avatar: 1024,
  logo: 1200,
  cover: 1920,
  course_image: 1800,
  book_cover: 1600,
};

/** Sign + upload an image directly to Cloudinary; returns the secure URL for the DB. */
export async function uploadMediaAsset(
  kind: BrandUploadKind,
  file: Blob,
  filename: string,
  onProgress?: (pct: number) => void,
  ownerId?: string,
): Promise<UploadedMedia> {
  let uploadBlob: Blob = file;
  let uploadName = filename;

  // Client-side shrink first (10MB allowed → lean payload), Cloudinary finishes the job.
  if (typeof File !== 'undefined' && file instanceof File && file.type.startsWith('image/')) {
    try {
      const prepared = await prepareImageForUpload(file, {
        maxEdge: KIND_MAX_EDGE[kind],
        quality: kind === 'logo' ? 0.9 : 0.86,
      });
      uploadBlob = prepared;
      uploadName = prepared.name || filename;
    } catch {
      // Fall through with original file - Cloudinary transform still compresses.
    }
  }

  const signRes = await fetch('/api/media/upload-sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind, ownerId }),
  });
  if (!signRes.ok) {
    const data = await signRes.json().catch(() => ({}));
    throw new Error(data.error ?? 'sign_failed');
  }
  const signed = await signRes.json();

  const form = new FormData();
  form.append('file', uploadBlob, uploadName);
  form.append('api_key', signed.apiKey);
  form.append('timestamp', String(signed.timestamp));
  form.append('signature', signed.signature);
  form.append('folder', signed.folder);
  form.append('public_id', signed.publicId);
  if (signed.transformation) {
    form.append('transformation', signed.transformation);
  }

  const result = await new Promise<Record<string, unknown>>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', signed.uploadUrl);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) resolve(json);
        else reject(new Error(json.error?.message ?? 'upload_failed'));
      } catch {
        reject(new Error('upload_failed'));
      }
    };
    xhr.onerror = () => reject(new Error('network_error'));
    xhr.send(form);
  });

  const url = String(result.secure_url ?? result.url ?? '');
  if (!url) throw new Error('upload_failed');

  return {
    url,
    bytes: Number(result.bytes ?? uploadBlob.size),
    publicId: String(result.public_id ?? signed.publicId),
  };
}
