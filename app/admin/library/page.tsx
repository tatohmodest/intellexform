'use client';

import AdminGate from '@/components/admin/AdminGate';
import AdminShell from '@/components/admin/AdminShell';
import AdminLibrary from '@/components/admin/AdminLibrary';

export default function AdminLibraryPage() {
  return (
    <AdminGate>
      {({ email, logout }) => (
        <AdminShell email={email} onLogout={logout} title="Library">
          <AdminLibrary />
        </AdminShell>
      )}
    </AdminGate>
  );
}
