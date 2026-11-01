import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Award } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getPortfolioSnapshot } from '@/lib/learn/portfolio';
import PortfolioEditor from '@/components/dashboard/PortfolioEditor';
import PageHeader from '@/components/dashboard/PageHeader';

export const dynamic = 'force-dynamic';

export default async function PortfolioPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/portfolio');

  const p = await getPortfolioSnapshot(session.uid);

  return (
    <div className="mx-auto max-w-[920px]">
      <PageHeader art="/hero_career.webp" tone="peach"
        title={p.name}
        description={p.bio || null}
        actions={
          <>
            <Link href="/dashboard/opportunities" className="chip">
              Opportunities
            </Link>
            {p.publicUrl ? (
              <Link href={p.publicUrl} className="chip">
                Public view
              </Link>
            ) : null}
          </>
        }
      />

      <PortfolioEditor
        initialBio={p.bio}
        initialSkills={p.skills}
        initialGoals={p.goals}
        initialPublic={p.portfolioPublic}
        initialSlug={p.portfolioSlug || ''}
        publicUrl={p.publicUrl}
      />

      <section className="mb-8 grid gap-3 sm:grid-cols-4">
        {[
          ['XP', p.xp.toLocaleString()],
          ['Streak', String(p.streak)],
          ['Completed', String(p.coursesCompleted.length)],
          ['Certificates', String(p.certificates.length)],
        ].map(([label, value]) => (
          <div key={label} className="card p-4">
            <p className="font-display text-[24px]">{value}</p>
            <p className="font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
              {label}
            </p>
          </div>
        ))}
      </section>

      {p.goals.length > 0 ? (
        <section className="mb-8">
          <h2 className="mb-3 font-display text-[20px]">Goals</h2>
          <ul className="space-y-1">
            {p.goals.map((g) => (
              <li key={g} className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
                → {g}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {p.skills.length > 0 ? (
        <section className="mb-8">
          <h2 className="mb-3 font-display text-[20px]">Skills</h2>
          <ul className="flex flex-wrap gap-2">
            {p.skills.map((s) => (
              <li key={s} className="border px-2.5 py-1 text-[13px] font-semibold" style={{ borderColor: 'var(--line)' }}>
                {s}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mb-8">
        <h2 className="mb-3 font-display text-[20px]">In progress</h2>
        {p.coursesInProgress.length === 0 ? (
          <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            No active courses.
          </p>
        ) : (
          <ul className="space-y-2">
            {p.coursesInProgress.map((c) => (
              <li key={c.slug}>
                <Link href={c.href} className="block card p-3">
                  <p className="font-semibold">{c.title}</p>
                  <p className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                    {Math.round(c.pct)}% complete
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-8">
        <h2 className="mb-3 font-display text-[20px]">Certificates</h2>
        {p.certificates.length === 0 ? (
          <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            Complete a course to earn certificates.
          </p>
        ) : (
          <ul className="space-y-2">
            {p.certificates.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 card p-3">
                <span className="inline-flex items-center gap-2 font-semibold">
                  <Award size={16} style={{ color: 'var(--green-deep)' }} />
                  {c.title}
                </span>
                <Link href={c.verifyUrl} className="text-[12.5px] font-semibold" style={{ color: 'var(--ink-soft)' }}>
                  Verify
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
        Mentorship sessions: {p.mentorshipSessions} · Library titles: {p.booksOwned}
      </p>
    </div>
  );
}
