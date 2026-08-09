/**
 * Helper utilities for parsing and embedding Google Drive video and folder links.
 */

export function extractGoogleDriveFileId(url: string): string | null {
  if (!url) return null;
  // Patterns:
  // https://drive.google.com/file/d/FILE_ID/view...
  // https://drive.google.com/file/d/FILE_ID/preview
  // https://drive.google.com/open?id=FILE_ID
  // https://drive.google.com/uc?id=FILE_ID
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];

  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && !url.includes('/folders/')) return idMatch[1];

  return null;
}

export function extractGoogleDriveFolderId(url: string): string | null {
  if (!url) return null;
  // Patterns:
  // https://drive.google.com/drive/folders/FOLDER_ID
  // https://drive.google.com/drive/u/0/folders/FOLDER_ID
  // https://drive.google.com/embeddedfolderview?id=FOLDER_ID
  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) return folderMatch[1];

  const embedMatch = url.match(/embeddedfolderview\?id=([a-zA-Z0-9_-]+)/);
  if (embedMatch) return embedMatch[1];

  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && url.includes('folders')) return idMatch[1];

  return null;
}

export function toGoogleDriveEmbedUrl(url: string): string {
  if (!url) return '';

  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  const folderId = extractGoogleDriveFolderId(url);
  if (folderId) {
    return `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
  }

  // If it's already an embed link or other video URL, return as is
  return url;
}

export function isGoogleDriveUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('drive.google.com') || url.includes('docs.google.com');
}

/** Check whether a course is an official Intellex course. */
export function isIntellexCourse(origin?: string | null): boolean {
  if (!origin) return true; // Default legacy courses on platform are Intellex unless specified otherwise
  const lower = origin.trim().toLowerCase();
  return lower === 'intellex' || lower === 'intellex' || lower === 'intellex program' || lower === 'loopingbinary';
}
