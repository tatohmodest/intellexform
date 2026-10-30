import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function BecomeStudentBanner({
  institutionName,
  compact = false,
}: {
  institutionName: string;
  compact?: boolean;
}) {
  return (
    <section
      className="card mb-8 flex flex-wrap items-center justify-between gap-4 p-5"
      style={{ background: 'linear-gradient(135deg, rgba(0,179,105,0.07), rgba(31,95,168,0.05))' }}
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: 'rgba(0,179,105,0.12)', color: 'var(--green-deep)' }}
        >
          <GraduationCap size={19} />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-[18px] leading-tight">Become a student</h2>
          <p className="muted mt-0.5 text-[13.5px]">
            {compact ? `Apply to ${institutionName}.` : `Apply to ${institutionName} to unlock classes, fees and your matricule.`}
          </p>
        </div>
      </div>
      <Link href="/dashboard/apply" className="chip chip-primary shrink-0">
        Apply now →
      </Link>
    </section>
  );
}

export function StudentFeaturePrompt({ institutionName }: { institutionName: string }) {
  return (
    <div className="card mx-auto max-w-[560px] p-6 sm:p-8">
      <p className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--green-deep)' }}>
        <GraduationCap size={12} /> Student feature
      </p>
      <h1 className="mt-3 font-display text-[26px] leading-tight">For enrolled students</h1>
      <p className="muted mt-2 text-[15px]">Become a student at {institutionName} to use this.</p>
      <Link href="/dashboard/apply" className="chip chip-primary mt-6">
        Register as a student →
      </Link>
    </div>
  );
}
