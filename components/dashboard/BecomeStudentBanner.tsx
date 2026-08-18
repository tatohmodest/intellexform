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
      className="mb-8 border p-5 sm:p-6"
      style={{
        borderColor: 'var(--line)',
        background: 'linear-gradient(135deg, rgba(0,179,105,0.08), rgba(31,95,168,0.06))',
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-[560px]">
          <p className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--green-deep)' }}>
            <GraduationCap size={12} /> Become a student
          </p>
          <h2 className="mt-2 font-display text-[24px] leading-tight sm:text-[28px]">
            Ready to take the next step?
          </h2>
          {!compact ? (
            <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Apply to study at {institutionName} and unlock your full academic experience — classes,
              assignments, campus announcements, fees, and your official matricule. Same account.
            </p>
          ) : (
            <p className="mt-2 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              Become a student at {institutionName} to access academic courses, classes, campus
              announcements, assignments, results, and more.
            </p>
          )}
        </div>
        <Link
          href="/dashboard/apply"
          className="shrink-0 px-4 py-2.5 text-[13px] font-semibold text-white"
          style={{ background: 'var(--ink)' }}
        >
          Apply now →
        </Link>
      </div>
    </section>
  );
}

export function StudentFeaturePrompt({ institutionName }: { institutionName: string }) {
  return (
    <div className="mx-auto max-w-[640px] border p-6 sm:p-8" style={{ borderColor: 'var(--line)' }}>
      <p className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--green-deep)' }}>
        <GraduationCap size={12} /> Student feature
      </p>
      <h1 className="mt-3 font-display text-[28px] leading-tight">This is part of the academic system</h1>
      <p className="mt-3 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        Become a student at {institutionName} to access academic courses, classes, campus
        announcements, assignments, results, and more.
      </p>
      <Link
        href="/dashboard/apply"
        className="mt-6 inline-flex px-4 py-2.5 text-[13px] font-semibold text-white"
        style={{ background: 'var(--ink)' }}
      >
        Register as a student →
      </Link>
    </div>
  );
}
