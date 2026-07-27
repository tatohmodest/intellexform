'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminGate from '@/components/admin/AdminGate';
import AdminShell from '@/components/admin/AdminShell';

function fmt(d: string) {
  if (!d) return '-';
  return new Date(d).toLocaleString('en-GB');
}

export default function LegacyRequestsPage() {
  return (
    <AdminGate>
      {({ email, logout }) => (
        <AdminShell email={email} onLogout={logout} title="Contact requests">
          <RequestsTable />
        </AdminShell>
      )}
    </AdminGate>
  );
}

function RequestsTable() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/requests');
      setRows(res.ok ? await res.json() : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>Loading…</p>;
  if (!rows.length) return <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>No requests yet.</p>;

  return (
    <div className="overflow-x-auto border" style={{ borderColor: 'var(--line)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'var(--paper-dim)' }}>
            {['Type', 'Name', 'WhatsApp', 'Field', 'Plan', 'Created'].map((h) => (
              <th key={h} className="px-3 py-2 text-left text-xs" style={{ color: 'var(--ink-soft)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={String(r._id)} className="border-t" style={{ borderColor: 'var(--line)' }}>
              <td className="px-3 py-2">{String(r.contactType || 'learner')}</td>
              <td className="px-3 py-2 font-semibold">{String(r.fullName)}</td>
              <td className="px-3 py-2">{String(r.whatsapp)}</td>
              <td className="px-3 py-2">{String(r.field)}</td>
              <td className="px-3 py-2">{String(r.plan)}</td>
              <td className="px-3 py-2">{fmt(String(r.createdAt || ''))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
