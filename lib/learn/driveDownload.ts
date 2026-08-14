/**
 * Normalize Google Drive share links for view vs download.
 */

export function extractGoogleDriveFileId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  const filePath = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (filePath?.[1]) return filePath[1];
  const openId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openId?.[1]) return openId[1];
  return null;
}

/** Open-in-browser / preview URL. */
export function toDriveViewUrl(url: string): string {
  const id = extractGoogleDriveFileId(url);
  if (id) return `https://drive.google.com/file/d/${id}/view`;
  return url;
}

/** Force a download redirect when possible. */
export function toDriveDownloadUrl(url: string): string {
  const id = extractGoogleDriveFileId(url);
  if (id) return `https://drive.google.com/uc?export=download&id=${id}`;
  return url;
}

export function isHttpUrl(url: string | null | undefined): boolean {
  return Boolean(url && /^https?:\/\//i.test(url.trim()));
}

/** True when the book has at least one chapter with real body text. */
export function bookHasReadableChapters(
  chapters: { title?: string; content?: string }[] | null | undefined,
): boolean {
  if (!Array.isArray(chapters) || chapters.length === 0) return false;
  return chapters.some((c) => Boolean(String(c?.content || '').trim()));
}
