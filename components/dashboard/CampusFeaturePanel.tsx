import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

/**
 * In-campus feature panel: keeps students inside the institution dashboard
 * while linking to the underlying InTelleX capability with campus return.
 */
export default function CampusFeaturePanel({
  icon: Icon,
  title,
  body,
  accent,
  campusName,
  campusHref,
  actions,
  locked,
  lockedReason,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  accent: string;
  campusName: string;
  campusHref: string;
  actions?: { href: string; label: string; primary?: boolean }[];
  locked?: boolean;
  lockedReason?: string;
}) {
  if (locked) {
    return (
      <section className="border p-6" style={{ borderColor: 'var(--line)' }}>
        <h2 className="font-display text-[22px]">{title}</h2>
        <p className="mt-3 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          {lockedReason ||
            `This capability is not on ${campusName}'s current plan. Ask a campus admin to unlock it.`}
        </p>
        <Link href={campusHref} className="mt-4 inline-block text-[13px] font-semibold" style={{ color: accent }}>
          ← Back to campus home
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-start gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center text-white"
          style={{ background: accent }}
        >
          <Icon size={18} />
        </span>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
            {campusName}
          </p>
          <h2 className="mt-1 font-display text-[22px] leading-tight">{title}</h2>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            {body}
          </p>
        </div>
      </div>
      {actions && actions.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {actions.map((a) => (
            <Link
              key={a.href + a.label}
              href={a.href}
              className={
                a.primary
                  ? 'px-4 py-2.5 text-[13px] font-semibold text-white'
                  : 'border px-4 py-2.5 text-[13px] font-semibold'
              }
              style={
                a.primary
                  ? { background: accent }
                  : { borderColor: 'var(--line)', color: 'var(--ink)' }
              }
            >
              {a.label}
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
