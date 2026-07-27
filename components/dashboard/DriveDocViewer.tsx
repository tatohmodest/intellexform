'use client';

/** In-dashboard Google Drive / Docs / Sheets / Slides viewer — no leave to Drive. */
export default function DriveDocViewer({
  embedUrl,
  title = 'Document',
  heightClass = 'min-h-[520px]',
}: {
  embedUrl: string;
  title?: string;
  heightClass?: string;
}) {
  if (!embedUrl) {
    return (
      <div
        className="flex items-center justify-center border py-16 text-[14px]"
        style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
      >
        No document linked yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden border" style={{ borderColor: 'var(--line)', background: '#f8f7f4' }}>
      <div
        className="flex items-center justify-between border-b px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em]"
        style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
      >
        <span>{title} · opened inside InTelleX</span>
      </div>
      <iframe
        title={title}
        src={embedUrl}
        className={`w-full ${heightClass}`}
        allow="autoplay"
      />
    </div>
  );
}
