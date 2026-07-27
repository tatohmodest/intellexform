'use client';

import { useCallback, useEffect, useState } from 'react';
import { Database, RefreshCw } from 'lucide-react';

interface Overview {
  collections: { name: string; count: number }[];
  bookRevenueXAF: number;
  recentLearners: Array<{ lbId: string; name: string; email: string; xp: number; streakCount: number; roles?: string[]; lastLoginAt?: string }>;
  recentEnrollments: Array<{ userId: string; courseSlug: string; enrolledAt: string }>;
  recentBookings: Array<{ _id: string; userId: string; mentorName: string; topic: string; scheduledAt: string; status: string; priceXAF?: number }>;
  recentBooks: Array<{ _id: string; title: string; authorName: string; priceXAF: number; published: boolean; sales: number }>;
  recentInstitutions: Array<{ slug: string; name: string; visibility: string; memberCount: number; ownerName: string }>;
}

function fmt(d?: string) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function Section({ title, head, rows, empty }: { title: string; head: string[]; rows: string[][]; empty: string }) {
  return (
    <section>
      <h3 className="mb-3 font-display text-[17px]">{title}</h3>
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed px-5 py-6 text-sm" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
          {empty}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--line)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--paper-dim)' }}>
                {head.map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--line)' }}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 align-top" style={{ color: j === 0 ? 'var(--ink)' : 'var(--ink-soft)', fontWeight: j === 0 ? 600 : 400, maxWidth: 240 }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function AdminLearning() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/learning');
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && !data) {
    return (
      <div className="flex items-center gap-3 py-20 justify-center" style={{ color: 'var(--ink-soft)' }}>
        <RefreshCw size={18} className="animate-spin" /> Loading learning platform data…
      </div>
    );
  }
  if (!data) {
    return (
      <div className="py-20 text-center text-sm" style={{ color: 'var(--ink-soft)' }}>
        Could not load learning data - is MONGODB_URL configured?
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Database collections */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Database size={16} style={{ color: 'var(--green-deep)' }} />
          <h3 className="font-display text-[17px]">Database collections (live)</h3>
          <span className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
            db: intellex · all collections created & indexed automatically
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {data.collections.map((c) => (
            <div key={c.name} className="rounded-2xl border p-4" style={{ borderColor: 'var(--line)' }}>
              <div className="font-display text-[22px] leading-none">{c.count.toLocaleString()}</div>
              <div className="mono mt-1.5 text-[10.5px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                {c.name}
              </div>
            </div>
          ))}
          <div className="rounded-2xl border p-4" style={{ borderColor: 'rgba(0,179,105,0.3)', background: 'rgba(0,179,105,0.05)' }}>
            <div className="font-display text-[22px] leading-none">{data.bookRevenueXAF.toLocaleString()}</div>
            <div className="mono mt-1.5 text-[10.5px] uppercase tracking-wide" style={{ color: 'var(--green-deep)' }}>
              book revenue (XAF)
            </div>
          </div>
        </div>
      </section>

      <Section
        title="Learners"
        head={['NAME', 'EMAIL', 'ROLES', 'XP', 'STREAK', 'LAST LOGIN']}
        rows={data.recentLearners.map((l) => [
          l.name,
          l.email || '-',
          (l.roles ?? ['student']).join(', '),
          String(l.xp ?? 0),
          String(l.streakCount ?? 0),
          fmt(l.lastLoginAt),
        ])}
        empty="No learners have signed up yet."
      />

      <Section
        title="Enrollments"
        head={['COURSE', 'LEARNER ID', 'ENROLLED']}
        rows={data.recentEnrollments.map((e) => [e.courseSlug, e.userId.slice(0, 16) + '…', fmt(e.enrolledAt)])}
        empty="No enrollments yet."
      />

      <Section
        title="Mentorship bookings"
        head={['TOPIC', 'MENTOR', 'WHEN', 'PRICE', 'STATUS']}
        rows={data.recentBookings.map((b) => [
          b.topic,
          b.mentorName,
          fmt(b.scheduledAt),
          b.priceXAF ? `${b.priceXAF.toLocaleString()} XAF` : '-',
          b.status,
        ])}
        empty="No mentorship bookings yet."
      />

      <Section
        title="Library books"
        head={['TITLE', 'AUTHOR', 'PRICE', 'SALES', 'STATUS']}
        rows={data.recentBooks.map((b) => [
          b.title,
          b.authorName,
          b.priceXAF > 0 ? `${b.priceXAF.toLocaleString()} XAF` : 'Free',
          String(b.sales ?? 0),
          b.published ? 'Published' : 'Draft',
        ])}
        empty="No books in the library yet."
      />

      <Section
        title="Institutions"
        head={['NAME', 'SLUG', 'VISIBILITY', 'MEMBERS', 'OWNER']}
        rows={data.recentInstitutions.map((i) => [
          i.name,
          i.slug,
          i.visibility,
          String(i.memberCount ?? 0),
          i.ownerName,
        ])}
        empty="No institutions yet."
      />
    </div>
  );
}
