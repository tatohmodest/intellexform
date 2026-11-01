import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { dailyXaf, programmeHref, priceNumber, type Programme, type ProgrammeCategory } from '@/lib/programmes';

/** One pastel surface per discipline, so the catalogue reads at a glance. */
export const CATEGORY_TINT: Record<ProgrammeCategory, string> = {
  software: '#dcedfa',
  data: '#fff2c6',
  security: '#ebe7fa',
  marketing: '#ffe6d9',
  foundations: '#e2f4e9',
};

/** Pastel programme card - real syllabus data, investment framing, one clear action. */
export default function ProgrammeCard({ programme: p }: { programme: Programme }) {
  return (
    <Link
      href={programmeHref(p)}
      className="group flex h-full flex-col rounded-[28px] p-6 transition-transform duration-200 hover:-translate-y-1 sm:p-7"
      style={{ background: CATEGORY_TINT[p.category] }}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.logoUrl} alt="" className="h-7 w-7 object-contain" loading="lazy" />
        </span>
        <span className="rounded-full bg-white/70 px-3 py-1 text-[12.5px] font-semibold text-[#12324f]">
          {p.duration} · {p.level}
        </span>
      </div>

      <h3 className="mt-5 font-display text-[22px] font-bold leading-[1.15] text-[#12324f] sm:text-[24px]">{p.title}</h3>
      <p className="mt-2.5 line-clamp-2 text-[14.5px] leading-relaxed text-[#12324f]/70">{p.description}</p>

      <ul className="mt-5 flex flex-col gap-2 text-[14px] text-[#12324f]">
        {p.highlights.slice(0, 3).map((h) => (
          <li key={h} className="flex gap-2.5">
            <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[var(--green)] text-white">
              <Check size={11} strokeWidth={3} />
            </span>
            <span>{h}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-end justify-between gap-4 pt-7">
        <div>
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#12324f]/60">Your investment</div>
          <div className="font-display text-[24px] font-extrabold leading-none text-[#12324f]">
            {priceNumber(p.priceXAF)} <span className="text-[13px] font-semibold">XAF</span>
          </div>
          {p.monthlyXAF ? (
            <div className="mt-1.5 text-[12.5px] text-[#12324f]/70">
              or {priceNumber(p.monthlyXAF)}/month · about {priceNumber(dailyXaf(p.monthlyXAF))} a day
            </div>
          ) : (
            <div className="mt-1.5 text-[12.5px] text-[#12324f]/70">{p.format}</div>
          )}
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#12324f] transition-colors duration-200 group-hover:bg-[var(--green)] group-hover:text-white">
          <ArrowUpRight size={18} />
        </span>
      </div>
    </Link>
  );
}
