'use client';

import AdminGate from '@/components/admin/AdminGate';
import AdminShell from '@/components/admin/AdminShell';
import AdminStaffDesk from '@/components/admin/AdminStaffDesk';

export default function AdminStaffPage() {
  return (
    <AdminGate>
      {({ email, logout }) => (
        <AdminShell email={email} onLogout={logout} title="Staff">
          <AdminStaffDesk />
        </AdminShell>
      )}
    </AdminGate>
  );
}
