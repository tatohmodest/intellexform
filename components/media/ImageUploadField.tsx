'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2, Upload } from 'lucide-react';
import type { MediaUploadKind } from '@/lib/cloudinary';
import { uploadMediaAsset } from '@/lib/mediaUpload';
import { extractDominantColor } from '@/lib/imageColor';

export default function ImageUploadField({
  label,
  value,
  onChange,
  kind,
  ownerId,
  hint,
  previewHeight = 140,
  round = false,
  autoColor = false,
  onColorExtracted,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  kind: MediaUploadKind;
  ownerId?: string;
  hint?: string;
  previewHeight?: number;
  round?: boolean;
  autoColor?: boolean;
  onColorExtracted?: (hex: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);
  const [error, setError] = useState('');

  async function onFile(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose an image (JPG, PNG, WebP, GIF).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Keep images under 8MB.');
      return;
    }
    setBusy(true);
    setError('');
    setPct(0);
    try {
      const uploaded = await uploadMediaAsset(kind, file, file.name, setPct, ownerId);
      onChange(uploaded.url);
      if (autoColor && onColorExtracted) {
        try {
          const hex = await extractDominantColor(file);
          onColorExtracted(hex);
        } catch {
          // best-effort
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'upload_failed';
      setError(
        msg === 'upload_unavailable'
          ? 'Image upload is not configured yet.'
          : msg === 'unauthorized'
            ? 'Sign in again to upload.'
            : 'Upload failed. Try again or paste a URL.',
      );
    } finally {
      setBusy(false);
      setPct(0);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
        {label}
      </span>

      <div
        className={`mb-3 overflow-hidden border ${round ? 'rounded-full' : 'rounded-xl'}`}
        style={{
          borderColor: 'var(--line)',
          background: 'var(--paper-dim)',
          height: round ? 96 : previewHeight,
          width: round ? 96 : '100%',
        }}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-1 text-[12px]"
            style={{ color: 'var(--ink-soft)' }}
          >
            <ImagePlus size={22} />
            No image
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          disabled={busy}
          className="inline-flex items-center gap-2 border px-3 py-2 text-[13px] font-semibold"
          style={{ borderColor: 'var(--ink)', background: 'var(--paper)' }}
          onClick={() => fileRef.current?.click()}
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {busy ? `Uploading ${pct}%` : 'Upload image'}
        </button>
        {value ? (
          <button
            type="button"
            disabled={busy}
            className="inline-flex items-center gap-1.5 border px-3 py-2 text-[13px]"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
            onClick={() => onChange('')}
          >
            <Trash2 size={14} /> Clear
          </button>
        ) : null}
      </div>

      <input
        className="form-input mt-2"
        value={value}
        onChange={(e) => onChange(e.target.value.trim())}
        placeholder="Or paste https:// image URL"
      />
      {hint ? (
        <p className="mt-1 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
          {hint}
        </p>
      ) : (
        <p className="mt-1 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
          Uploads go to Cloudinary; the generated link is what we store.
          {autoColor ? ' We also sample a brand color from the image.' : ''}
        </p>
      )}
      {error ? (
        <p className="mt-1 text-[12.5px]" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
