import type { MentorUploadKind } from '@/lib/learn/mentorUploadKinds';

export type UploadedAsset = {
  url: string;
  bytes: number;
  publicId: string;
  resourceType: string;
};

/** Sign + upload a file directly to Cloudinary (keeps large videos off Next.js). */
export async function uploadMentorAsset(
  kind: MentorUploadKind,
  file: Blob,
  filename: string,
  onProgress?: (pct: number) => void,
): Promise<UploadedAsset> {
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
  form.append('file', file, filename);
  form.append('api_key', signed.apiKey);
  form.append('timestamp', String(signed.timestamp));
  form.append('signature', signed.signature);
  form.append('folder', signed.folder);
  form.append('public_id', signed.publicId);
  if (signed.eager) form.append('eager', signed.eager);
  if (kind === 'id_front' || kind === 'id_back') {
    form.append('transformation', 'c_limit,w_1600,q_auto:good');
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

  // Prefer eager (compressed) URL for videos when Cloudinary returns it.
  const eager = Array.isArray(result.eager) ? result.eager[0] : null;
  const eagerUrl =
    eager && typeof eager === 'object' && eager !== null && 'secure_url' in eager
      ? String((eager as { secure_url: string }).secure_url)
      : null;

  return {
    // Prefer the original upload URL — eager derivatives can be async / empty.
    url: String(result.secure_url ?? result.url ?? eagerUrl ?? ''),
    bytes: Number(result.bytes ?? file.size),
    publicId: String(result.public_id ?? signed.publicId),
    resourceType: String(result.resource_type ?? signed.resourceType),
  };
}
