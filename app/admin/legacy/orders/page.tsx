'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminGate from '@/components/admin/AdminGate';
import AdminShell from '@/components/admin/AdminShell';
import { formatXAF } from '@/lib/format';

function fmt(d: string) {
  if (!d) return '-';
  return new Date(d).toLocaleString('en-GB');
}

export default function LegacyOrdersPage() {
  return (
    <AdminGate>
      {({ email, logout }) => (
        <AdminShell email={email} onLogout={logout} title="Mongo orders">
          <OrdersTable />
        </AdminShell>
      )}
    </AdminGate>
  );
}

function OrdersTable() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      setRows(res.ok ? await res.json() : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>Loading…</p>;
  if (!rows.length) return <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>No orders yet.</p>;

  return (
    <div className="overflow-x-auto border" style={{ borderColor: 'var(--line)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'var(--paper-dim)' }}>
            {['Name', 'Course', 'Amount', 'Status', 'Created'].map((h) => (
              <th key={h} className="px-3 py-2 text-left text-xs" style={{ color: 'var(--ink-soft)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={String(r._id)} className="border-t" style={{ borderColor: 'var(--line)' }}>
              <td className="px-3 py-2 font-semibold">{String(r.fullName)}</td>
              <td className="px-3 py-2">{String(r.courseName)}</td>
              <td className="px-3 py-2">{formatXAF(Number(r.amountXAF || 0))}</td>
              <td className="px-3 py-2">{String(r.status)}</td>
              <td className="px-3 py-2">{fmt(String(r.createdAt || ''))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
