import type { MentorUploadKind } from '@/lib/learn/mentorUploadKinds';
import { MAX_MENTOR_DOC_BYTES, prepareImageForUpload } from '@/lib/compressImage';

export type UploadedAsset = {
  url: string;
  bytes: number;
  publicId: string;
  resourceType: string;
};

const ID_MAX_EDGE = 1600;
const ID_QUALITY = 0.88;

/** Sign + upload a file directly to Cloudinary (keeps large videos off Next.js). */
export async function uploadMentorAsset(
  kind: MentorUploadKind,
  file: Blob,
  filename: string,
  onProgress?: (pct: number) => void,
): Promise<UploadedAsset> {
  let uploadBlob: Blob = file;
  let uploadName = filename;

  // ID photos (and image CVs): accept up to 10MB, shrink client-side, keep them sharp.
  if (
    typeof File !== 'undefined' &&
    file instanceof File &&
    file.type.startsWith('image/') &&
    (kind === 'id_front' || kind === 'id_back' || kind === 'resume')
  ) {
    if (file.size > MAX_MENTOR_DOC_BYTES) {
      throw new Error('file_too_large');
    }
    try {
      const prepared = await prepareImageForUpload(file, {
        maxEdge: kind === 'resume' ? 1920 : ID_MAX_EDGE,
        quality: ID_QUALITY,
      });
      uploadBlob = prepared;
      uploadName = prepared.name || filename;
    } catch {
      // Fall through — Cloudinary transform still caps ID photos.
    }
  } else if (kind === 'resume' && file.size > MAX_MENTOR_DOC_BYTES) {
    throw new Error('file_too_large');
  }

  const signRes = await fetch('/api/learn/mentor/upload-sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind }),
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
  if (signed.eager) form.append('eager', signed.eager);
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

  const eager = Array.isArray(result.eager) ? result.eager[0] : null;
  const eagerUrl =
    eager && typeof eager === 'object' && eager !== null && 'secure_url' in eager
      ? String((eager as { secure_url: string }).secure_url)
      : null;

  return {
    url: String(result.secure_url ?? result.url ?? eagerUrl ?? ''),
    bytes: Number(result.bytes ?? uploadBlob.size),
    publicId: String(result.public_id ?? signed.publicId),
    resourceType: String(result.resource_type ?? signed.resourceType),
  };
}
