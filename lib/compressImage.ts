/** Max accepted upload before we reject (bytes). Large files are compressed down. */
export const MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024;

const TARGET_MAX_BYTES = 1_400_000;

type PrepareOpts = {
  /** Longest edge in px after resize. */
  maxEdge?: number;
  /** JPEG/WebP quality 0–1. */
  quality?: number;
};

/**
 * Accept images up to 10MB, then shrink dimensions / re-encode so uploads stay
 * lean while looking sharp. Small files pass through unchanged.
 */
export async function prepareImageForUpload(
  file: File,
  opts: PrepareOpts = {},
): Promise<File> {
  if (!file.type.startsWith('image/')) return file;
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return file;

  const maxEdge = opts.maxEdge ?? 1920;
  const quality = opts.quality ?? 0.86;

  // Already small enough — skip canvas work.
  if (file.size <= 900_000) return file;

  const bitmap = await loadBitmap(file);
  try {
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));

    if (scale >= 1 && file.size <= TARGET_MAX_BYTES) return file;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);

    const preferWebp = supportsWebp();
    const mime = preferWebp ? 'image/webp' : 'image/jpeg';
    let blob = await canvasToBlob(canvas, mime, quality);

    // If still heavy, nudge quality down once more.
    if (blob && blob.size > TARGET_MAX_BYTES) {
      blob = await canvasToBlob(canvas, mime, Math.max(0.72, quality - 0.12));
    }
    if (!blob || blob.size >= file.size) return file;

    const base = file.name.replace(/\.[^.]+$/, '') || 'image';
    const ext = preferWebp ? 'webp' : 'jpg';
    return new File([blob], `${base}.${ext}`, { type: mime, lastModified: Date.now() });
  } finally {
    bitmap.close?.();
  }
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
