'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Search } from 'lucide-react';

type Course = { id: string; title: string; published: boolean; studentCount: number };

type Row = {
  userId: string;
  name: string;
  email: string;
  title: string;
  expertise: string[];
  canTeach: boolean;
  courseCount: number;
  studentCount: number;
  courses: Course[];
};

export default function TeachersDesk({ canManage }: { canManage: boolean }) {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (q.trim()) p.set('q', q.trim());
    return p.toString();
  }, [q]);

  function load() {
    setLoading(true);
    fetch(`/api/staff/teachers${query ? `?${query}` : ''}`)
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.error || 'Could not load teachers');
        setRows(data.teachers || []);
        setTotal(data.total || 0);
        setError('');
      })
      .catch((err) => setError(err.message || 'Could not load teachers'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  async function grant(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    setMsg('');
    try {
      const res = await fetch('/api/staff/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not grant teaching');
      setEmail('');
      setMsg(`Granted teaching access to ${data.teacher?.name || email}.`);
      load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Could not grant teaching');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {canManage ? (
        <form className="mb-5 flex flex-col gap-2 sm:flex-row" onSubmit={grant}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Account email to grant teaching"
            type="email"
            className="min-w-0 flex-1 border px-3 py-2.5 text-[14px]"
            style={{ borderColor: 'var(--line)', background: 'transparent' }}
          />
          <button
            type="submit"
            disabled={busy}
            className="px-4 py-2.5 text-[13px] font-semibold text-white"
            style={{ background: '#00B369' }}
          >
            {busy ? 'Granting…' : 'Give teaching access'}
          </button>
        </form>
      ) : null}
      {msg ? (
        <p className="mb-3 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          {msg}
        </p>
      ) : null}

      <div className="mb-4">
        <label className="relative block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-soft)' }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search teachers, courses…"
            className="w-full border py-2.5 pl-9 pr-3 text-[14px]"
            style={{ borderColor: 'var(--line)', background: 'transparent' }}
          />
        </label>
      </div>

      <p className="mb-3 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
        {loading ? 'Loading…' : `${total} teacher${total === 1 ? '' : 's'}`}
      </p>

      {error ? (
        <p className="text-[14px]" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      ) : rows.length === 0 && !loading ? (
        <div className="rounded-2xl border border-dashed px-4 py-10 text-center" style={{ borderColor: 'var(--line)' }}>
          <GraduationCap size={26} className="mx-auto" style={{ color: 'var(--ink-soft)' }} />
          <p className="mt-3 font-display text-[20px]">No teachers yet</p>
          <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            People appear here when they teach a course or you grant teaching access.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border" style={{ borderColor: 'var(--line)' }}>
          <table className="w-full min-w-[720px] text-left text-[13.5px]">
            <thead>
              <tr className="border-b text-[11px] uppercase tracking-wide" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
                <th className="px-3 py-2.5 font-medium">Teacher</th>
                <th className="px-3 py-2.5 font-medium">Teaching</th>
                <th className="px-3 py-2.5 font-medium">Courses</th>
                <th className="px-3 py-2.5 font-medium">Students</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.userId} className="border-b last:border-0" style={{ borderColor: 'var(--line)' }}>
                  <td className="px-3 py-3">
                    <Link
                      href={`/dashboard/staff/teachers/${row.userId}`}
                      className="inline-flex items-center border px-2.5 py-1 text-[12.5px] font-semibold"
                      style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
                    >
                      {row.name || 'Unnamed'}
                    </Link>
                    <div className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                      {row.email || row.title || '—'}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    {row.courses.slice(0, 3).map((c) => c.title).join(' · ') || '—'}
                    {row.courses.length > 3 ? ` +${row.courses.length - 3}` : ''}
                  </td>
                  <td className="px-3 py-3">{row.courseCount}</td>
                  <td className="px-3 py-3">{row.studentCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
