import type { MediaUploadKind } from '@/lib/learn/mentorUploadKinds';
import { MAX_MENTOR_DOC_BYTES, prepareMentorDocForUpload } from '@/lib/compressImage';
import { extFromFilenameOrMime } from '@/lib/cloudinaryFormats';

export type UploadedAsset = {
  url: string;
  bytes: number;
  publicId: string;
  resourceType: string;
  format: string;
  originalFilename: string;
};

function friendlyUploadError(raw: string): string {
  const msg = raw.toLowerCase();
  if (msg.includes('file_too_large')) return 'file_too_large';
  if (msg.includes('upload_unavailable') || msg.includes('not configured')) {
    return 'Uploads are temporarily unavailable. Try again shortly.';
  }
  if (msg.includes('unauthorized') || msg.includes('401')) {
    return 'Your session expired. Sign in again and retry.';
  }
  if (msg.includes('invalid signature') || msg.includes('signature')) {
    return 'Upload signature failed. Refresh the page and try again.';
  }
  if (msg.includes('file format') || msg.includes('format')) {
    return 'That file format was rejected. Use PDF, DOC, or DOCX for documents; JPG/PNG for ID photos.';
  }
  if (raw && raw !== 'upload_failed' && raw !== 'network_error' && raw !== 'sign_failed') {
    return raw;
  }
  if (raw === 'network_error') return 'Network error while uploading. Check your connection.';
  return 'Upload failed. Please try again.';
}

/** Sign + upload a file directly to Cloudinary (keeps large videos off Next.js). */
export async function uploadMentorAsset(
  kind: MediaUploadKind,
  file: Blob,
  filename: string,
  onProgress?: (pct: number) => void,
): Promise<UploadedAsset> {
  let uploadBlob: Blob = file;
  let uploadName = filename;

  if (file.size > MAX_MENTOR_DOC_BYTES && kind !== 'intro_video') {
    throw new Error('file_too_large');
  }

  // Shrink ID / photo resumes; leave PDF/DOC/DOCX untouched.
  if (
    typeof File !== 'undefined' &&
    file instanceof File &&
    (kind === 'id_front' || kind === 'id_back' || kind === 'resume' || kind === 'assignment')
  ) {
    const isImage =
      file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|heic)$/i.test(file.name);
    if (isImage) {
      try {
        const prepared = await prepareMentorDocForUpload(
          file,
          kind === 'id_front' || kind === 'id_back' ? 'id' : 'resume',
        );
        uploadBlob = prepared;
        uploadName = prepared.name || filename;
      } catch (err) {
        if (err instanceof Error && err.message === 'file_too_large') throw err;
      }
    }
  }

  const mimeType =
    uploadBlob.type ||
    (typeof File !== 'undefined' && file instanceof File ? file.type : '') ||
    '';

  const signRes = await fetch('/api/learn/mentor/upload-sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind, mimeType, filename: uploadName }),
  });
  if (!signRes.ok) {
    const data = await signRes.json().catch(() => ({}));
    throw new Error(friendlyUploadError(String(data.error ?? 'sign_failed')));
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
        else {
          const cloudMsg =
            typeof json?.error === 'object' && json.error && 'message' in json.error
              ? String((json.error as { message: string }).message)
              : typeof json?.error === 'string'
                ? json.error
                : 'upload_failed';
          reject(new Error(friendlyUploadError(cloudMsg)));
        }
      } catch {
        reject(new Error('Upload failed. Please try again.'));
      }
    };
    xhr.onerror = () => reject(new Error('Network error while uploading. Check your connection.'));
    xhr.send(form);
  });

  const url = String(result.secure_url ?? result.url ?? '');
  if (!url) {
    throw new Error('Upload completed without a file URL. Please try again.');
  }

  const format =
    String(result.format || signed.format || '').replace(/^\./, '') ||
    extFromFilenameOrMime(uploadName, mimeType);

  return {
    url,
    bytes: Number(result.bytes ?? uploadBlob.size),
    publicId: String(result.public_id ?? signed.publicId),
    resourceType: String(result.resource_type ?? signed.resourceType),
    format,
    originalFilename: uploadName,
  };
}

/** Alias for assignment / general media uploads. */
export const uploadMediaAsset = uploadMentorAsset;
