import Link from 'next/link';
import type { AnnouncementView } from '@/lib/staff/store';

export function audienceMeta(audience: string): { label: string; color: string; bg: string } {
  if (audience === 'students') {
    return { label: 'Institution', color: 'var(--green-deep)', bg: 'rgba(0,179,105,0.10)' };
  }
  if (audience === 'staff') {
    return { label: 'Staff only', color: 'var(--ink-soft)', bg: 'var(--paper-dim)' };
  }
  return { label: 'Public', color: 'var(--blue-ink)', bg: 'var(--amber-soft)' };
}

export default function AnnouncementCard({
  item,
  compact = false,
}: {
  item: AnnouncementView;
  compact?: boolean;
}) {
  const meta = audienceMeta(item.audience);
  return (
    <article
      className="card overflow-hidden"
    >
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt=""
          className={`w-full object-cover ${compact ? 'max-h-36' : 'max-h-56'}`}
        />
      ) : null}
      <div className={compact ? 'p-4' : 'p-5'}>
        <p
          className="inline-flex rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]"
          style={{ color: meta.color, background: meta.bg }}
        >
          {meta.label}
        </p>
        <h3 className={`mt-2 font-display leading-tight ${compact ? 'text-[18px]' : 'text-[22px]'}`}>
          {item.title}
        </h3>
        <p className="mt-1 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
          {item.authorName || 'Administration'}
          {item.campusSlug ? ` · ${item.campusSlug}` : ''}
          {' · '}
          {new Date(item.createdAt).toLocaleDateString()}
        </p>
        <p
          className={`mt-2 whitespace-pre-wrap leading-relaxed ${compact ? 'line-clamp-2 text-[13.5px]' : 'text-[14.5px]'}`}
        >
          {item.body}
        </p>
        {compact ? (
          <Link
            href="/dashboard/announcements"
            className="mt-2 inline-flex items-center text-[13px] font-semibold"
            style={{ color: 'var(--green-deep)' }}
          >
            Read more →
          </Link>
        ) : null}
      </div>
    </article>
  );
}
