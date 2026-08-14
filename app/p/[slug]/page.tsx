import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Award } from 'lucide-react';
import { getPublicPortfolioBySlug } from '@/lib/learn/portfolio';

export const dynamic = 'force-dynamic';

export default async function PublicPortfolioPage({
  params,
}: {
  params: { slug: string };
}) {
  const p = await getPublicPortfolioBySlug(params.slug);
  if (!p) notFound();

  return (
    <main className="mx-auto min-h-screen max-w-[800px] px-4 py-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
        Public portfolio
      </p>
      <h1 className="mt-2 font-display text-[40px] leading-tight">{p.name}</h1>
      {p.bio ? (
        <p className="mt-3 text-[16px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          {p.bio}
        </p>
      ) : null}

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          ['XP', p.xp.toLocaleString()],
          ['Completed', String(p.coursesCompleted.length)],
          ['Certificates', String(p.certificates.length)],
        ].map(([label, value]) => (
          <div key={label} className="border p-4" style={{ borderColor: 'var(--line)' }}>
            <p className="font-display text-[24px]">{value}</p>
            <p className="font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {p.skills.length ? (
        <section className="mt-10">
          <h2 className="mb-3 font-display text-[22px]">Skills</h2>
          <ul className="flex flex-wrap gap-2">
            {p.skills.map((s) => (
              <li key={s} className="border px-2.5 py-1 text-[13px] font-semibold" style={{ borderColor: 'var(--line)' }}>
                {s}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {p.goals.length ? (
        <section className="mt-10">
          <h2 className="mb-3 font-display text-[22px]">Goals</h2>
          <ul className="space-y-1">
            {p.goals.map((g) => (
              <li key={g} style={{ color: 'var(--ink-soft)' }}>
                → {g}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="mb-3 font-display text-[22px]">Completed</h2>
        {p.coursesCompleted.length === 0 ? (
          <p style={{ color: 'var(--ink-soft)' }}>No completed courses yet.</p>
        ) : (
          <ul className="space-y-2">
            {p.coursesCompleted.map((c) => (
              <li key={c.slug} className="border p-3 font-semibold" style={{ borderColor: 'var(--line)' }}>
                {c.title}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 font-display text-[22px]">Certificates</h2>
        <ul className="space-y-2">
          {p.certificates.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-2 border p-3" style={{ borderColor: 'var(--line)' }}>
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
      </section>

      <p className="mt-12 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
        Powered by <Link href="/">Intellex</Link>
      </p>
    </main>
  );
}
