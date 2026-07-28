'use client';

import { Download, ExternalLink, FileText } from 'lucide-react';
import { isPreviewableFormat } from '@/lib/cloudinaryFormats';

/**
 * In-platform Cloudinary document viewer.
 * PDF / images: iframe via same-origin proxy (inline disposition).
 * DOC / DOCX: download only (browsers cannot render Word natively).
 */
export default function CloudinaryDocViewer({
  viewUrl,
  downloadUrl,
  format,
  title = 'Document',
  fileName,
  heightClass = 'min-h-[520px]',
}: {
  /** Same-origin URL that streams the file with Content-Disposition: inline */
  viewUrl?: string | null;
  downloadUrl: string;
  format?: string | null;
  title?: string;
  fileName?: string | null;
  heightClass?: string;
}) {
  const fmt = (format || '').toLowerCase().replace(/^\./, '');
  const canPreview = Boolean(viewUrl) && isPreviewableFormat(fmt || 'pdf');

  return (
    <div className="overflow-hidden border" style={{ borderColor: 'var(--line)', background: '#f8f7f4' }}>
      <div
        className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2"
        style={{ borderColor: 'var(--line)' }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
          {title}
          {fileName ? ` · ${fileName}` : ''}
          {fmt ? ` · ${fmt}` : ''}
        </span>
        <a
          href={downloadUrl}
          className="inline-flex items-center gap-1 text-[12px] font-semibold"
          style={{ color: 'var(--green-deep)' }}
        >
          <Download size={12} /> Download
        </a>
      </div>

      {canPreview ? (
        fmt === 'pdf' || !fmt ? (
          <iframe title={title} src={viewUrl!} className={`w-full ${heightClass}`} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={viewUrl!} alt={title} className="mx-auto max-h-[640px] w-auto object-contain p-4" />
        )
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <FileText size={28} style={{ color: 'var(--ink-soft)' }} />
          <p className="text-[14px] font-semibold">
            {fmt === 'doc' || fmt === 'docx'
              ? 'Word documents open via download'
              : 'Preview not available for this file type'}
          </p>
          <p className="max-w-sm text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            Browsers cannot render .doc / .docx inside the page. Download the file, or upload a PDF
            next time for in-platform preview.
          </p>
          <a
            href={downloadUrl}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white"
            style={{ background: 'var(--green)' }}
          >
            <ExternalLink size={14} /> Download {fmt ? `.${fmt}` : 'file'}
          </a>
        </div>
      )}
    </div>
  );
}
