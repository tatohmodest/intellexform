'use client';

import AdminGate from '@/components/admin/AdminGate';
import AdminShell from '@/components/admin/AdminShell';
import PlatformControlPlane from '@/components/admin/PlatformControlPlane';

export default function AdminCataloguePage() {
  return (
    <AdminGate>
      {({ email, logout }) => (
        <AdminShell email={email} onLogout={logout} title="Catalogue cleanup">
          <PlatformControlPlane initialSection="catalogue" />
        </AdminShell>
      )}
    </AdminGate>
  );
}
