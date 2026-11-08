'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, CalendarDays, Check, FolderGit2, MessageSquareText, Pencil, Sparkles } from 'lucide-react';
import { JOURNEY, type JourneyPhase } from '@/lib/positioning';

const LOOK: Record<JourneyPhase['artefact']['kind'], { icon: typeof Award; doodle: string }> = {
  schedule: { icon: CalendarDays, doodle: '/doodles/sittingreading.svg' },
  help: { icon: Sparkles, doodle: '/doodles/coffee.svg' },
  review: { icon: MessageSquareText, doodle: '/doodles/readingside.svg' },
  project: { icon: FolderGit2, doodle: '/doodles/unboxing.svg' },
  certificate: { icon: Award, doodle: '/doodles/jumping.svg' },
};

/** A sample of what the learner sees in their dashboard during a phase. */
export function ArtefactCard({ phase, className = '' }: { phase: JourneyPhase; className?: string }) {
  const { kind, heading, lines } = phase.artefact;
  const Icon = LOOK[kind].icon;
  return (
    <div className={`rounded-2xl border border-[#e7e9ec] bg-white p-5 shadow-[0_20px_50px_-30px_rgba(12,17,22,0.35)] ${className}`}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e7e9ec] bg-[#f3fbf7] text-[var(--ink)]">
          <Icon size={18} strokeWidth={1.75} />
        </span>
        <span className="text-[15px] font-semibold text-[var(--ink)]">{heading}</span>
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {lines.map((l, i) => {
          const fix = l.startsWith('✎');
          const ok = l.startsWith('✓');
          const text = fix || ok ? l.slice(2) : l;
          return (
            <li
              key={l}
              className={`flex items-start gap-2.5 rounded-xl px-3 py-2 text-[13.5px] leading-snug ${
                kind === 'help' && i === 1 ? 'bg-[#f3fbf7] text-[var(--ink)]' : 'bg-[#f6f7f8] text-[var(--ink)]/80'
              }`}
            >
              {ok && <Check size={15} className="mt-0.5 shrink-0 text-[var(--green-deep)]" strokeWidth={3} />}
              {fix && <Pencil size={14} className="mt-0.5 shrink-0 text-[#c27b00]" />}
              <span>{text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** "A programme, week by week": the learning experience shown instead of described. */
export default function ProgrammeJourney() {
  const [active, setActive] = useState(0);
  const phase = JOURNEY[active];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
      <ol className="flex flex-col gap-2">
        {JOURNEY.map((p, i) => {
          const on = i === active;
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                aria-pressed={on}
                className={`flex w-full gap-4 rounded-2xl border p-4 text-left transition-colors sm:p-5 ${
                  on ? 'border-[rgba(0,179,105,0.45)] bg-[#f3fbf7]' : 'border-transparent hover:border-[#e7e9ec]'
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[15px] font-bold transition-colors ${
                    on ? 'bg-[var(--green)] text-white' : 'border border-[#e7e9ec] bg-white text-[var(--ink)]'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-[12.5px] font-semibold text-[var(--green-deep)]">{p.when}</span>
                  <span className="block text-[18px] font-medium leading-snug tracking-[-0.02em] text-[var(--ink)]">{p.title}</span>
                  {on && <span className="mt-1.5 block text-[14.5px] leading-relaxed text-[#4b5563]">{p.body}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="relative flex min-h-[440px] flex-col items-center justify-center overflow-hidden rounded-[20px] border border-[#e7e9ec] bg-white p-6 pb-12 sm:p-10 sm:pb-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{ backgroundImage: 'radial-gradient(#e7e9ec 1px, transparent 1px)', backgroundSize: '18px 18px' }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 16, rotate: -1.5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="relative flex w-full max-w-[380px] flex-col items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOOK[phase.artefact.kind].doodle} alt="" className="-mb-3 h-36 w-auto select-none" />
            <ArtefactCard phase={phase} className="w-full" />
          </motion.div>
        </AnimatePresence>
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[12px] text-[#4b5563]/70">
          Sample from Full Stack Web Development
        </span>
      </div>
    </div>
  );
}
