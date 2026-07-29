/** Hard reject ceiling for mentor docs and media images (bytes). */
export const MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024;

/** Same hard cap for mentor CV / ID uploads. */
export const MAX_MENTOR_DOC_BYTES = 10 * 1024 * 1024;

type PrepareOpts = {
  /** Longest edge in px after resize. */
  maxEdge?: number;
  /** Starting JPEG/WebP quality 0-1. */
  quality?: number;
};

/**
 * Re-encode every raster image so bytes drop while the picture stays sharp.
 * 10 MB is only the maximum accepted size - files of any size still shrink.
 */
export async function prepareImageForUpload(
  file: File,
  opts: PrepareOpts = {},
): Promise<File> {
  if (!file.type.startsWith('image/')) return file;
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return file;

  const maxEdge = opts.maxEdge ?? 1920;
  const startQuality = opts.quality ?? 0.84;

  const bitmap = await loadBitmap(file);
  try {
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round((bitmap.width * scale) / 2) * 2);
    const h = Math.max(1, Math.round((bitmap.height * scale) / 2) * 2);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return file;

    // White matte so transparent PNGs don't turn black when flattened to JPEG/WebP.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bitmap, 0, 0, w, h);

    const preferWebp = supportsWebp();
    const mime = preferWebp ? 'image/webp' : 'image/jpeg';

    // Always re-encode; walk quality down until the result is smaller (or we hit the floor).
    const qualities = [startQuality, startQuality - 0.08, startQuality - 0.16, 0.68]
      .map((q) => Math.max(0.62, Math.min(0.92, q)))
      .filter((q, i, arr) => arr.indexOf(q) === i);

    let best: Blob | null = null;
    for (const q of qualities) {
      const blob = await canvasToBlob(canvas, mime, q);
      if (!blob || blob.size === 0) continue;
      if (!best || blob.size < best.size) best = blob;
      // Good enough shrink - stop early.
      if (blob.size < file.size * 0.92) break;
    }

    if (!best || best.size >= file.size) return file;

    const base = file.name.replace(/\.[^.]+$/, '') || 'image';
    const ext = preferWebp ? 'webp' : 'jpg';
    return new File([best], `${base}.${ext}`, { type: mime, lastModified: Date.now() });
  } finally {
    bitmap.close?.();
  }
}

/**
 * Mentor CV / ID prep: hard 10 MB max, then shrink every image (any size).
 * PDF/DOC pass the size gate only (no safe client re-encode without extra deps).
 */
export async function prepareMentorDocForUpload(
  file: File,
  kind: 'id' | 'resume' = 'id',
): Promise<File> {
  if (file.size > MAX_MENTOR_DOC_BYTES) {
    throw new Error('file_too_large');
  }
  if (!file.type.startsWith('image/')) return file;
  return prepareImageForUpload(file, {
    maxEdge: kind === 'resume' ? 1800 : 1600,
    quality: kind === 'resume' ? 0.84 : 0.86,
  });
}

function supportsWebp(): boolean {
  try {
    return document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    return false;
  }
}

async function loadBitmap(file: File): Promise<ImageBitmap & { close?: () => void }> {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(file);
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('image_load_failed'));
      el.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas_unavailable');
    ctx.drawImage(img, 0, 0);
    return createImageBitmap(canvas);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), mime, quality);
  });
}
