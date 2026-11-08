'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, CalendarDays, Check, FolderGit2, MessageSquareText, Pencil, Sparkles } from 'lucide-react';
import { JOURNEY, type JourneyPhase } from '@/lib/positioning';

const LOOK: Record<JourneyPhase['artefact']['kind'], { bg: string; icon: typeof Award }> = {
  schedule: { bg: 'var(--pastel-sky)', icon: CalendarDays },
  help: { bg: 'var(--pastel-lilac)', icon: Sparkles },
  review: { bg: 'var(--pastel-butter)', icon: MessageSquareText },
  project: { bg: 'var(--pastel-mint)', icon: FolderGit2 },
  certificate: { bg: 'var(--pastel-butter)', icon: Award },
};

/** A sample of what the learner sees in their dashboard during a phase. */
export function ArtefactCard({ phase, className = '' }: { phase: JourneyPhase; className?: string }) {
  const { kind, heading, lines } = phase.artefact;
  const Icon = LOOK[kind].icon;
  return (
    <div className={`rounded-3xl bg-white p-5 shadow-[0_24px_60px_-28px_rgba(18,50,79,0.45)] ring-1 ring-black/5 ${className}`}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--navy)]" style={{ background: LOOK[kind].bg }}>
          <Icon size={18} />
        </span>
        <span className="text-[15px] font-bold text-[var(--navy)]">{heading}</span>
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
                kind === 'help' && i === 1 ? 'bg-[var(--pastel-lilac)] text-[var(--navy)]' : 'bg-[var(--paper-dim)] text-[var(--navy)]/85'
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
                className={`flex w-full gap-4 rounded-3xl p-4 text-left transition-colors sm:p-5 ${
                  on ? 'bg-white shadow-[0_16px_40px_-24px_rgba(18,50,79,0.4)]' : 'hover:bg-white/60'
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[15px] font-bold transition-colors ${
                    on ? 'bg-[var(--green)] text-white' : 'bg-white text-[var(--navy)]'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-[12.5px] font-semibold text-[var(--green-deep)]">{p.when}</span>
                  <span className="block text-[18px] font-bold leading-snug text-[var(--navy)]">{p.title}</span>
                  {on && <span className="mt-1.5 block text-[14.5px] leading-relaxed text-[var(--navy)]/70">{p.body}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="relative flex min-h-[380px] items-center justify-center overflow-hidden rounded-[32px] bg-white/60 p-6 sm:p-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--pastel-mint)]" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-[var(--pastel-butter)]" />
        <AnimatePresence mode="wait">
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 16, rotate: -1.5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-[380px]"
          >
            <ArtefactCard phase={phase} />
          </motion.div>
        </AnimatePresence>
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[12px] text-[var(--navy)]/55">
          Sample from Full Stack Web Development
        </span>
      </div>
    </div>
  );
}
