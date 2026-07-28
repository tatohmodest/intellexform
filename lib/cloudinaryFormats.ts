/** Client-safe helpers for Cloudinary document URLs (no Node/Cloudinary SDK). */

export function isPreviewableFormat(format?: string | null): boolean {
  const f = (format || '').toLowerCase().replace(/^\./, '');
  return f === 'pdf' || ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(f);
}

export function extFromFilenameOrMime(filename?: string, mimeType?: string): string {
  const name = (filename || '').toLowerCase();
  const m = name.match(/\.([a-z0-9]+)$/);
  if (m) {
    const e = m[1] === 'jpeg' ? 'jpg' : m[1];
    if (
      ['pdf', 'doc', 'docx', 'png', 'jpg', 'webp', 'gif', 'heic', 'mp4', 'webm', 'mov'].includes(e)
    ) {
      return e;
    }
  }
  const mime = (mimeType || '').toLowerCase();
  if (mime.includes('pdf')) return 'pdf';
  if (mime.includes('wordprocessingml') || mime.includes('docx')) return 'docx';
  if (mime.includes('msword') || mime.endsWith('/msword')) return 'doc';
  if (mime.includes('png')) return 'png';
  if (mime.includes('jpeg') || mime.includes('jpg')) return 'jpg';
  if (mime.includes('webp')) return 'webp';
  if (mime.includes('mp4')) return 'mp4';
  if (mime.includes('webm')) return 'webm';
  return 'pdf';
}

export function isCloudinaryUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && u.hostname.includes('cloudinary.com');
  } catch {
    return false;
  }
}

/**
 * Raw assets must end in the real extension (…/raw/upload/v123/cv_1.pdf) so the
 * browser knows how to render or download them.
 */
export function ensureCloudinaryExtension(url: string, format?: string | null): string {
  if (!url) return url;
  const fmt = (format || '').toLowerCase().replace(/^\./, '');
  if (!fmt) return url;
  const [path, query = ''] = url.split('?');
  if (new RegExp(`\\.${fmt}$`, 'i').test(path)) return url;
  if (/\.[a-z0-9]{2,5}$/i.test(path)) return url;
  return `${path}.${fmt}${query ? `?${query}` : ''}`;
}

/** Insert a delivery flag (e.g. fl_attachment) right after /upload/. */
export function cloudinaryUrlWithFlag(url: string, flag: string): string {
  if (!url || !url.includes('/upload/')) return url;
  if (url.includes(`/upload/${flag}/`)) return url;
  return url.replace('/upload/', `/upload/${flag}/`);
}

/** Direct URL that forces a browser download. */
export function cloudinaryDownloadUrl(url: string, format?: string | null): string {
  return cloudinaryUrlWithFlag(ensureCloudinaryExtension(url, format), 'fl_attachment');
}

/** Direct URL for inline viewing (PDF / image). */
export function cloudinaryInlineUrl(url: string, format?: string | null): string {
  return ensureCloudinaryExtension(url, format);
}
