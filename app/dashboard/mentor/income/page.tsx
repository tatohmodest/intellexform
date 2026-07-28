import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, BookMarked, GraduationCap, Video, Wallet } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getInstructorIncome, getMentorProfile } from '@/lib/learn/ecosystem';

export const dynamic = 'force-dynamic';

export default async function MentorIncomePage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/mentor/income');

  const profile = await getMentorProfile(session.uid);
  if (!profile) redirect('/dashboard/mentor');

  const income = await getInstructorIncome(session.uid);

  const rows = [
    {
      label: 'Course sales',
      gross: income.courses.grossXAF,
      yours: income.courses.instructorXAF,
      platform: income.courses.platformXAF,
      detail: `${income.courses.students} student${income.courses.students === 1 ? '' : 's'}`,
      icon: Video,
    },
    {
      label: 'Paid sessions',
      gross: income.sessions.grossXAF,
      yours: income.sessions.instructorXAF,
      platform: income.sessions.platformXAF,
      detail: `${income.sessions.sessions} session${income.sessions.sessions === 1 ? '' : 's'}`,
      icon: GraduationCap,
    },
    {
      label: 'Book sales',
      gross: income.booksXAF,
      yours: income.booksXAF,
      platform: 0,
      detail: 'Library purchases',
      icon: BookMarked,
    },
  ];

  return (
    <div className="mx-auto max-w-[860px]">
      <Link
        href="/dashboard/mentor"
        className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-semibold"
        style={{ color: 'var(--ink-soft)' }}
      >
        <ArrowLeft size={14} /> Mentor Studio
      </Link>

      <div className="mb-8">
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <Wallet size={11} /> Income
        </div>
        <h1 className="font-display text-[28px] leading-tight sm:text-[32px]">Your earnings</h1>
        <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          Students pay through PayUnit. InTelleX keeps 100% of the first paid lesson with every new
          student (trial), then a sliding platform fee on later purchases with that student.
        </p>
      </div>

      <div
        className="mb-10 grid grid-cols-1 gap-5 border-y py-6 sm:grid-cols-3"
        style={{ borderColor: 'var(--line)' }}
      >
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
            You keep
          </div>
          <div className="mt-1 font-display text-[26px] leading-none sm:text-[30px]">
            {income.yourTotalXAF.toLocaleString()} XAF
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
            Platform fee
          </div>
          <div className="mt-1 font-display text-[26px] leading-none sm:text-[30px]">
            {income.platformTotalXAF.toLocaleString()} XAF
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
            Gross volume
          </div>
          <div className="mt-1 font-display text-[26px] leading-none sm:text-[30px]">
            {income.grossTotalXAF.toLocaleString()} XAF
          </div>
        </div>
      </div>

      <ul className="divide-y" style={{ borderColor: 'var(--line)' }}>
        {rows.map((r) => (
          <li key={r.label} className="flex flex-wrap items-start gap-4 py-5">
            <span
              className="flex h-10 w-10 items-center justify-center"
              style={{ background: 'rgba(0,179,105,0.1)', color: 'var(--green-deep)' }}
            >
              <r.icon size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-semibold">{r.label}</div>
              <div className="mt-0.5 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                {r.detail}
              </div>
            </div>
            <div className="text-right text-[13px]">
              <div className="font-semibold">{r.yours.toLocaleString()} XAF yours</div>
              <div style={{ color: 'var(--ink-soft)' }}>
                {r.platform.toLocaleString()} XAF platform · {r.gross.toLocaleString()} gross
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
