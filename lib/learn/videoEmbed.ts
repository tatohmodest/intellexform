/**
 * Helpers for embedding Drive / YouTube / direct video URLs in Course Studio.
 */
export function toEmbedUrl(videoUrl: string, provider?: string): string {
  if (provider === 'drive' || videoUrl.includes('drive.google.com')) {
    const m = videoUrl.match(/\/d\/([^/]+)/);
    if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
  }
  if (provider === 'youtube' || videoUrl.includes('youtube') || videoUrl.includes('youtu.be')) {
    const m =
      videoUrl.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/) ||
      null;
    if (m) return `https://www.youtube.com/embed/${m[1]}`;
  }
  return videoUrl;
}

export function isDirectVideo(url: string, provider?: string): boolean {
  if (provider === 'cloudinary') return true;
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url) || url.includes('res.cloudinary');
}
