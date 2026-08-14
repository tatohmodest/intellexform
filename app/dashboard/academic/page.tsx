import Link from 'next/link';
import { redirect } from 'next/navigation';
import { GraduationCap } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import { getAcademicOverview } from '@/lib/learn/academicOverview';
import AcademicPrefsEditor from '@/components/dashboard/AcademicPrefsEditor';

export const dynamic = 'force-dynamic';

export default async function AcademicOverviewPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/academic');

  const [overview, learner] = await Promise.all([
    getAcademicOverview(session.uid),
    getLearner(session.uid),
  ]);
  const prefs = learner?.preferences;

  const primary = overview.programs[0];
  const creditsDisplay =
    primary?.creditsEarned != null
      ? primary.creditsEarned
      : overview.estimatedCreditsFromCourses;
  const creditsRequired = primary?.creditsRequired;

  return (
    <div className="mx-auto max-w-[920px]">
      <header className="mb-8 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <GraduationCap size={11} /> Academic
        </div>
        <h1 className="font-display text-[32px] leading-tight">Academic overview</h1>
        <p className="mt-2 max-w-[640px] text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Program journey, cohort, GPA, and credits — when your campus enables them, or soft
          fields you maintain yourself.
        </p>
      </header>

      <section className="mb-8 grid gap-3 sm:grid-cols-4">
        {[
          ['GPA', primary?.gpa != null ? String(primary.gpa) : '—'],
          [
            'Credits',
            creditsRequired != null
              ? `${creditsDisplay}/${creditsRequired}`
              : String(creditsDisplay),
          ],
          ['In progress', String(overview.coursesInProgress)],
          ['Completed', String(overview.coursesCompleted)],
        ].map(([label, value]) => (
          <div key={label} className="border p-4" style={{ borderColor: 'var(--line)' }}>
            <p className="font-display text-[24px]">{value}</p>
            <p className="font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
              {label}
            </p>
          </div>
        ))}
      </section>

      {overview.programs.length > 0 ? (
        <section className="mb-8 space-y-3">
          <h2 className="font-display text-[20px]">Programs & campuses</h2>
          {overview.programs.map((p) => (
            <div key={p.institutionSlug} className="border p-4" style={{ borderColor: 'var(--line)' }}>
              <p className="font-semibold">{p.institutionName}</p>
              <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                {[p.program, p.cohort, p.year, p.department].filter(Boolean).join(' · ') ||
                  'Affiliation linked'}
              </p>
              {p.institutionSlug !== 'personal' ? (
                <Link
                  href={`/dashboard/institutions/${p.institutionSlug}`}
                  className="mt-2 inline-block text-[13px] font-semibold"
                  style={{ color: 'var(--green-deep)' }}
                >
                  Open campus →
                </Link>
              ) : null}
            </div>
          ))}
        </section>
      ) : (
        <section className="mb-8 border border-dashed p-6" style={{ borderColor: 'var(--line)' }}>
          <p className="font-display text-[18px]">No campus program yet</p>
          <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            Join an institution or set soft GPA/credits below. Course progress still counts toward
            your journey.
          </p>
          <Link
            href="/dashboard/institutions"
            className="mt-3 inline-block text-[13px] font-semibold"
            style={{ color: 'var(--green-deep)' }}
          >
            Browse institutions →
          </Link>
        </section>
      )}

      <section className="mb-8">
        <h2 className="mb-3 font-display text-[20px]">Journey</h2>
        <ul className="space-y-2">
          {overview.journey.map((j) => (
            <li key={j.label}>
              <Link href={j.href} className="flex items-center justify-between border p-3" style={{ borderColor: 'var(--line)' }}>
                <span>
                  <span className="font-semibold">{j.label}</span>
                  <span className="ml-2 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                    {j.detail}
                  </span>
                </span>
                <span style={{ color: 'var(--ink-soft)' }}>→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <AcademicPrefsEditor
        initialGpa={prefs?.academicGpa ?? primary?.gpa ?? null}
        initialCreditsEarned={prefs?.academicCreditsEarned ?? primary?.creditsEarned ?? null}
        initialCreditsRequired={prefs?.academicCreditsRequired ?? primary?.creditsRequired ?? null}
        initialCohort={prefs?.academicCohort || primary?.cohort || ''}
      />
    </div>
  );
}
