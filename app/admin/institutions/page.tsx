'use client';

import AdminGate from '@/components/admin/AdminGate';
import AdminShell from '@/components/admin/AdminShell';
import PlatformControlPlane from '@/components/admin/PlatformControlPlane';

export default function AdminInstitutionsPage() {
  return (
    <AdminGate>
      {({ email, logout }) => (
        <AdminShell email={email} onLogout={logout} title="Institutions">
          <PlatformControlPlane initialSection="institutions" />
        </AdminShell>
      )}
    </AdminGate>
  );
}
