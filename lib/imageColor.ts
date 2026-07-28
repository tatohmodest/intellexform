/**
 * Sample an image and pick a vivid brand-friendly hex color (client-side canvas).
 * Skips near-white / near-black so campus accents stay usable on light UI.
 */
export async function extractDominantColor(source: File | string): Promise<string> {
  const objectUrl = typeof source === 'string' ? source : URL.createObjectURL(source);
  try {
    const img = await loadImage(objectUrl);
    const canvas = document.createElement('canvas');
    const size = 48;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return '#00b369';
    ctx.drawImage(img, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);

    const buckets = new Map<string, { r: number; g: number; b: number; w: number }>();
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a < 200) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const { h, s, l } = rgbToHsl(r, g, b);
      // Skip washed-out / near-black / near-white pixels
      if (l < 0.12 || l > 0.92 || s < 0.12) continue;
      const key = `${Math.round(h * 24)}_${Math.round(s * 8)}_${Math.round(l * 8)}`;
      const weight = 0.35 + s * 0.65;
      const cur = buckets.get(key);
      if (cur) {
        cur.r += r * weight;
        cur.g += g * weight;
        cur.b += b * weight;
        cur.w += weight;
      } else {
        buckets.set(key, { r: r * weight, g: g * weight, b: b * weight, w: weight });
      }
    }

    type Bucket = { r: number; g: number; b: number; w: number };
    const list: Bucket[] = Array.from(buckets.values());
    list.sort((a, b) => b.w - a.w);
    const best = list[0];

    if (!best || best.w < 1) {
      // Fallback: average mid-luminance pixels
      let r = 0;
      let g = 0;
      let b = 0;
      let n = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 200) continue;
        const rr = data[i];
        const gg = data[i + 1];
        const bb = data[i + 2];
        const avg = (rr + gg + bb) / 3;
        if (avg < 40 || avg > 220) continue;
        r += rr;
        g += gg;
        b += bb;
        n += 1;
      }
      if (!n) return '#00b369';
      return toHex(r / n, g / n, b / n);
    }

    return toHex(best.r / best.w, best.g / best.w, best.b / best.w);
  } finally {
    if (typeof source !== 'string') URL.revokeObjectURL(objectUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image_load_failed'));
    img.src = src;
  });
}

function rgbToHsl(r: number, g: number, b: number) {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6;
  else if (max === gg) h = ((bb - rr) / d + 2) / 6;
  else h = ((rr - gg) / d + 4) / 6;
  return { h, s, l };
}

function toHex(r: number, g: number, b: number) {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((n) => n.toString(16).padStart(2, '0'))
    .join('')}`;
}

function normalizeHexColor(value: string, fallback = '#00b369'): string {
  const v = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(v)) {
    const a = v.charAt(1);
    const b = v.charAt(2);
    const c = v.charAt(3);
    return `#${a}${a}${b}${b}${c}${c}`.toLowerCase();
  }
  return fallback;
}

export { normalizeHexColor };
