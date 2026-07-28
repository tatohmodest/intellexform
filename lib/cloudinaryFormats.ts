/** Client-safe helpers for Cloudinary document formats (no Node/Cloudinary SDK). */

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
