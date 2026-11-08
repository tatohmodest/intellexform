import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { dailyXaf, programmeHref, priceNumber, type Programme } from '@/lib/programmes';

/** White hairline programme card - real syllabus data, investment framing, one clear action. */
export default function ProgrammeCard({ programme: p }: { programme: Programme }) {
  return (
    <Link
      href={programmeHref(p)}
      className="group flex h-full flex-col rounded-[20px] border border-[#e7e9ec] bg-white p-6 transition-colors duration-200 hover:border-[rgba(0,179,105,0.5)] sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#e7e9ec]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.logoUrl} alt="" className="h-7 w-7 object-contain" loading="lazy" />
        </span>
        <span className="rounded-full border border-[#e7e9ec] bg-[#f6f7f8] px-3 py-1 text-[12.5px] text-[#4b5563]">
          {p.duration} · {p.level}
        </span>
      </div>

      <h3 className="mt-5 text-[21px] font-medium leading-[1.2] tracking-[-0.025em] text-[#0C1116] sm:text-[22px]">{p.title}</h3>
      <p className="mt-2.5 line-clamp-2 text-[14px] leading-relaxed text-[#4b5563]">{p.description}</p>

      <ul className="mt-5 flex flex-col gap-2 border-t border-[#e7e9ec] pt-5 text-[14px] text-[#0C1116]">
        {p.highlights.slice(0, 3).map((h) => (
          <li key={h} className="flex gap-2.5">
            <Check size={16} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[var(--green-deep)]" />
            <span>{h}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-end justify-between gap-4 pt-7">
        <div>
          <div className="mb-1 text-[12px] text-[#4b5563]">Your investment</div>
          <div className="text-[24px] font-medium leading-none tracking-[-0.03em] text-[#0C1116]">
            {priceNumber(p.priceXAF)} <span className="text-[13px] font-normal text-[#4b5563]">XAF</span>
          </div>
          <div className="mt-1.5 text-[12.5px] text-[#4b5563]">
            {p.monthlyXAF ? `or ${priceNumber(p.monthlyXAF)}/month · about ${priceNumber(dailyXaf(p.monthlyXAF))} a day` : p.format}
          </div>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e7e9ec] text-[#0C1116] transition-colors duration-200 group-hover:border-transparent group-hover:bg-[#5ce39a]">
          <ArrowUpRight size={18} />
        </span>
      </div>
    </Link>
  );
}
