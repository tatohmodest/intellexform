/**
 * Helpers for embedding Drive / YouTube / direct video URLs in Course Studio.
 */
export function toEmbedUrl(videoUrl: string | null | undefined, provider?: string): string {
  const url = String(videoUrl || '').trim();
  if (!url) return '';
  if (provider === 'drive' || url.includes('drive.google.com')) {
    const m = url.match(/\/d\/([^/]+)/);
    if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
  }
  if (provider === 'youtube' || url.includes('youtube') || url.includes('youtu.be')) {
    const m =
      url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/) ||
      null;
    if (m) return `https://www.youtube.com/embed/${m[1]}`;
  }
  return url;
}

export function isDirectVideo(url: string | null | undefined, provider?: string): boolean {
  const u = String(url || '');
  if (!u) return false;
  if (provider === 'cloudinary') return true;
  return /\.(mp4|webm|ogg)(\?|$)/i.test(u) || u.includes('res.cloudinary');
}
