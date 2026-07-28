/**
 * Shared Cloudinary helpers for PDF / DOC / DOCX (and images).
 * Server-only — imports the Cloudinary Node SDK.
 *
 * Why files "didn't display" before:
 * 1. Rewriting delivery URLs with `fl_attachment` → Cloudinary 401
 * 2. Raw PDF/DOC need the extension in `public_id` (or format on download API)
 * 3. DOC/DOCX cannot be iframe-previewed in browsers — only PDF (and images) can
 * 4. Proxying a failed Cloudinary response saved JSON as a "file"
 *
 * Fix: store publicId + resourceType + format, use signed private_download_url
 * via our API, never fl_attachment on public URLs.
 */

import { cloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';
import {
  cloudinaryDownloadUrl,
  cloudinaryInlineUrl,
} from '@/lib/cloudinaryFormats';

export {
  cloudinaryDownloadUrl,
  cloudinaryInlineUrl,
  cloudinaryUrlWithFlag,
  ensureCloudinaryExtension,
  extFromFilenameOrMime,
  isCloudinaryUrl,
  isPreviewableFormat,
} from '@/lib/cloudinaryFormats';

export function parseCloudinaryAsset(url: string): {
  resourceType: 'raw' | 'image' | 'video';
  publicId: string;
  format: string;
} | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts.length < 4) return null;
    const resourceType = parts[1];
    if (resourceType !== 'raw' && resourceType !== 'image' && resourceType !== 'video') {
      return null;
    }
    const uploadIdx = parts.indexOf('upload');
    if (uploadIdx < 0) return null;

    const after = parts.slice(uploadIdx + 1);
    let i = 0;
    while (i < after.length) {
      const seg = after[i];
      if (/^v\d+$/.test(seg)) {
        i += 1;
        break;
      }
      if (seg.startsWith('s--') || seg.includes(',') || /^(c_|w_|h_|q_|f_|fl_)/.test(seg)) {
        i += 1;
        continue;
      }
      break;
    }

    const publicPath = after.slice(i).join('/');
    if (!publicPath) return null;

    const formatMatch = publicPath.match(/\.([a-z0-9]+)$/i);
    const format =
      formatMatch?.[1]?.toLowerCase() || (resourceType === 'raw' ? 'pdf' : '');
    const publicId = formatMatch
      ? publicPath.slice(0, -formatMatch[0].length)
      : publicPath;

    return { resourceType, publicId, format };
  } catch {
    return null;
  }
}

type CloudResource = {
  public_id: string;
  format?: string;
  resource_type?: string;
  secure_url?: string;
};

export async function lookupCloudinaryResource(
  publicId: string,
  preferred?: string,
): Promise<CloudResource | null> {
  if (!isCloudinaryConfigured()) return null;
  const types = [preferred, 'raw', 'image', 'auto'].filter(
    (v, i, a): v is string => Boolean(v) && a.indexOf(v) === i,
  );
  const idVariants = [publicId];
  if (!/\.[a-z0-9]+$/i.test(publicId)) {
    for (const ext of ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'webp']) {
      idVariants.push(`${publicId}.${ext}`);
    }
  }

  for (const resourceType of types) {
    for (const id of idVariants) {
      try {
        const resource = (await cloudinary.api.resource(id, {
          resource_type: resourceType,
        })) as CloudResource;
        if (resource?.public_id) return { ...resource, resource_type: resourceType };
      } catch {
        /* try next */
      }
    }
  }
  return null;
}

/** Short-lived Cloudinary URL for download (attachment) or inline view. */
export function signedCloudinaryFileUrl(opts: {
  publicId: string;
  format: string;
  resourceType: string;
  attachment?: boolean;
  expiresInSec?: number;
}): string {
  const format = (opts.format || 'pdf').replace(/^\./, '');
  return cloudinary.utils.private_download_url(opts.publicId, format, {
    resource_type: opts.resourceType || 'raw',
    type: 'upload',
    attachment: opts.attachment !== false,
    expires_at: Math.floor(Date.now() / 1000) + (opts.expiresInSec ?? 600),
  });
}

export function contentTypeForFormat(format: string): string {
  const f = format.toLowerCase().replace(/^\./, '');
  if (f === 'pdf') return 'application/pdf';
  if (f === 'docx') {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  if (f === 'doc') return 'application/msword';
  if (f === 'png') return 'image/png';
  if (f === 'jpg' || f === 'jpeg') return 'image/jpeg';
  if (f === 'webp') return 'image/webp';
  return 'application/octet-stream';
}

export function safeDownloadFilename(name: string, format: string): string {
  const base =
    (name || 'document')
      .toLowerCase()
      .replace(/[^\w.-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'document';
  const ext = (format || 'pdf').toLowerCase().replace(/[^a-z0-9]/g, '') || 'pdf';
  return `${base}.${ext === 'jpeg' ? 'jpg' : ext}`;
}

/**
 * Resolve a stored Cloudinary asset to delivery URLs, best candidate first.
 *
 * 1. Plain delivery URL ending in the real extension (…/raw/upload/v1/cv.pdf),
 *    with `fl_attachment` when a download is requested.
 * 2. Signed private_download_url as a fallback when delivery is restricted.
 */
export async function resolveCloudinaryDelivery(opts: {
  url?: string | null;
  publicId?: string | null;
  resourceType?: string | null;
  format?: string | null;
  attachment?: boolean;
}): Promise<
  | {
      ok: true;
      deliveryUrl: string;
      candidates: string[];
      publicId: string;
      format: string;
      resourceType: string;
    }
  | { ok: false; error: string }
> {
  if (!isCloudinaryConfigured()) return { ok: false, error: 'upload_unavailable' };

  const parsed = opts.url ? parseCloudinaryAsset(opts.url) : null;
  const publicId = (opts.publicId || parsed?.publicId || '').trim();
  if (!publicId && !opts.url) return { ok: false, error: 'file_missing' };

  const preferredType = opts.resourceType || parsed?.resourceType || 'raw';
  const preferredFormat = (opts.format || parsed?.format || 'pdf').replace(/^\./, '');

  const resource = publicId ? await lookupCloudinaryResource(publicId, preferredType) : null;
  const resolvedId = resource?.public_id || publicId;
  const format = (resource?.format || preferredFormat || 'pdf').replace(/^\./, '');
  const resourceType = resource?.resource_type || preferredType || 'raw';
  const attachment = opts.attachment !== false;

  const candidates: string[] = [];
  const base = resource?.secure_url || opts.url || '';
  if (base) {
    candidates.push(
      attachment ? cloudinaryDownloadUrl(base, format) : cloudinaryInlineUrl(base, format),
    );
  }
  if (resolvedId) {
    candidates.push(
      signedCloudinaryFileUrl({ publicId: resolvedId, format, resourceType, attachment }),
    );
  }
  if (base && !candidates.includes(base)) candidates.push(base);

  if (!candidates.length) return { ok: false, error: 'file_missing' };

  return {
    ok: true,
    deliveryUrl: candidates[0],
    candidates,
    publicId: resolvedId,
    format,
    resourceType,
  };
}

/** Fetch the first candidate that returns real bytes (not a Cloudinary JSON error). */
export async function fetchFirstWorkingCandidate(
  candidates: string[],
): Promise<{ response: Response; url: string } | null> {
  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: 'no-store', redirect: 'follow' });
      if (!res.ok) continue;
      const type = res.headers.get('content-type') || '';
      if (type.includes('application/json')) continue;
      return { response: res, url };
    } catch {
      /* try next */
    }
  }
  return null;
}
