'use client';

import AdminGate from '@/components/admin/AdminGate';
import AdminShell from '@/components/admin/AdminShell';
import AdminContentPricing from '@/components/admin/AdminContentPricing';

export default function AdminContentPage() {
  return (
    <AdminGate>
      {({ email, logout }) => (
        <AdminShell email={email} onLogout={logout} title="Content & pricing">
          <AdminContentPricing />
        </AdminShell>
      )}
    </AdminGate>
  );
}
