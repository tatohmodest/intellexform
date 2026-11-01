'use client';

import AdminGate from '@/components/admin/AdminGate';
import AdminShell from '@/components/admin/AdminShell';
import AdminAssignments from '@/components/admin/AdminAssignments';

export default function AdminAssignmentsPage() {
  return (
    <AdminGate>
      {({ email, logout }) => (
        <AdminShell email={email} onLogout={logout} title="Assign students">
          <AdminAssignments />
        </AdminShell>
      )}
    </AdminGate>
  );
}
