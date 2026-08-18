'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Users } from 'lucide-react';
import { STUDENT_STATUSES, formatXAF } from '@/lib/staff/permissions';

type Row = {
  userId: string;
  studentCode: string;
  name: string;
  email: string;
  status: string;
  program: string;
  department: string;
  year: string;
  cohort: string;
  campusSlug: string;
  classHead?: boolean;
  outstandingXAF: number;
  courses: Array<{ id: string; title: string }>;
};

type Filters = {
  programs: string[];
  years: string[];
  departments: string[];
  cohorts: string[];
  courses: Array<{ id: string; title: string }>;
};

type Campus = { slug: string; name: string };

export default function StudentDesk() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [program, setProgram] = useState('');
  const [year, setYear] = useState('');
  const [cohort, setCohort] = useState('');
  const [campus, setCampus] = useState('');
  const [course, setCourse] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<Filters>({
    programs: [],
    years: [],
    departments: [],
    cohorts: [],
    courses: [],
  });
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (q.trim()) p.set('q', q.trim());
    if (status) p.set('status', status);
    if (program) p.set('program', program);
    if (year) p.set('year', year);
    if (cohort) p.set('cohort', cohort);
    if (campus) p.set('campus', campus);
    if (course) p.set('course', course);
    return p.toString();
  }, [q, status, program, year, cohort, campus, course]);

  useEffect(() => {
    fetch('/api/staff/campuses')
      .then((r) => r.json())
      .then((d) => setCampuses(d.campuses || []))
      .catch(() => setCampuses([]));
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      setLoading(true);
      fetch(`/api/staff/students${query ? `?${query}` : ''}`, { signal: ctrl.signal })
        .then(async (r) => {
          const data = await r.json().catch(() => ({}));
          if (!r.ok) throw new Error(data.error || 'Could not load students');
          setRows(data.students || []);
          setTotal(data.total || 0);
          if (data.filters) setFilters(data.filters);
          setError('');
        })
        .catch((err) => {
          if (err.name !== 'AbortError') setError(err.message || 'Could not load students');
        })
        .finally(() => setLoading(false));
    }, 250);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [query]);

  const selectCls = 'border px-3 py-2.5 text-[13px]';
  const selectStyle = { borderColor: 'var(--line)', background: 'transparent' as const };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3">
        <label className="relative min-w-0 flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-soft)' }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, student ID, program…"
            className="w-full border py-2.5 pl-9 pr-3 text-[14px]"
            style={{ borderColor: 'var(--line)', background: 'transparent' }}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls} style={selectStyle}>
            <option value="">All statuses</option>
            <option value="user">user (not yet a student)</option>
            {STUDENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          <select value={program} onChange={(e) => setProgram(e.target.value)} className={selectCls} style={selectStyle}>
            <option value="">All programs</option>
            {filters.programs.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(e.target.value)} className={selectCls} style={selectStyle}>
            <option value="">All levels</option>
            {filters.years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select value={cohort} onChange={(e) => setCohort(e.target.value)} className={selectCls} style={selectStyle}>
            <option value="">All classes</option>
            {filters.cohorts.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select value={campus} onChange={(e) => setCampus(e.target.value)} className={selectCls} style={selectStyle}>
            <option value="">All campuses</option>
            {campuses.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <select value={course} onChange={(e) => setCourse(e.target.value)} className={selectCls} style={selectStyle}>
            <option value="">All courses</option>
            {filters.courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mb-3 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
        {loading ? 'Loading…' : `${total} learner${total === 1 ? '' : 's'} in InTelleX`}
      </p>

      {error ? (
        <p className="text-[14px]" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      ) : rows.length === 0 && !loading ? (
        <div className="rounded-2xl border border-dashed px-4 py-10 text-center" style={{ borderColor: 'var(--line)' }}>
          <Users size={26} className="mx-auto" style={{ color: 'var(--ink-soft)' }} />
          <p className="mt-3 font-display text-[20px]">No students match this search</p>
          <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            Learners appear here after they create an InTelleX account.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border" style={{ borderColor: 'var(--line)' }}>
          <table className="w-full min-w-[960px] text-left text-[13.5px]">
            <thead>
              <tr className="border-b text-[11px] uppercase tracking-wide" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
                <th className="px-3 py-2.5 font-medium">Student</th>
                <th className="px-3 py-2.5 font-medium">ID</th>
                <th className="px-3 py-2.5 font-medium">Program</th>
                <th className="px-3 py-2.5 font-medium">Level</th>
                <th className="px-3 py-2.5 font-medium">Class</th>
                <th className="px-3 py-2.5 font-medium">Courses</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
                <th className="px-3 py-2.5 font-medium">Fees due</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.userId} className="border-b last:border-0" style={{ borderColor: 'var(--line)' }}>
                  <td className="px-3 py-3">
                    <Link
                      href={`/dashboard/staff/students/${row.userId}`}
                      className="inline-flex items-center border px-2.5 py-1 text-[12.5px] font-semibold"
                      style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
                    >
                      {row.name || 'Unnamed'}
                    </Link>
                    <div className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                      {row.email}
                    </div>
                  </td>
                  <td className="px-3 py-3 font-mono text-[12px]">{row.studentCode}</td>
                  <td className="px-3 py-3">
                    {row.program || '—'}
                    {row.department ? (
                      <div className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                        {row.department}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">{row.year || '—'}</td>
                  <td className="px-3 py-3">{row.cohort || '—'}</td>
                  <td className="max-w-[220px] px-3 py-3">
                    {row.courses?.length
                      ? row.courses
                          .slice(0, 2)
                          .map((c) => c.title)
                          .join(' · ')
                      : '—'}
                    {row.courses && row.courses.length > 2 ? ` +${row.courses.length - 2}` : ''}
                  </td>
                  <td className="px-3 py-3 capitalize">
                    {row.status.replace(/_/g, ' ')}
                    {row.classHead ? (
                      <span className="ml-2 text-[10px] font-semibold uppercase" style={{ color: '#00B369' }}>
                        class advocate
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">{row.outstandingXAF > 0 ? formatXAF(row.outstandingXAF) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
