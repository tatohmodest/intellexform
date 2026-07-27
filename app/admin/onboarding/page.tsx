'use client';

import AdminGate from '@/components/admin/AdminGate';
import AdminShell from '@/components/admin/AdminShell';
import PlatformControlPlane from '@/components/admin/PlatformControlPlane';

export default function AdminOnboardingPage() {
  return (
    <AdminGate>
      {({ email, logout }) => (
        <AdminShell email={email} onLogout={logout} title="Onboarding invites">
          <PlatformControlPlane initialSection="onboarding" />
        </AdminShell>
      )}
    </AdminGate>
  );
}
