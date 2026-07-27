'use client';

import AdminGate from '@/components/admin/AdminGate';
import AdminShell from '@/components/admin/AdminShell';
import AdminApplications from '@/components/admin/AdminApplications';

export default function AdminApplicationsPage() {
  return (
    <AdminGate>
      {({ email, logout }) => (
        <AdminShell email={email} onLogout={logout} title="Applications">
          <AdminApplications />
        </AdminShell>
      )}
    </AdminGate>
  );
}
