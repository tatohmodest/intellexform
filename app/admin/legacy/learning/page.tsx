'use client';

import AdminGate from '@/components/admin/AdminGate';
import AdminShell from '@/components/admin/AdminShell';
import AdminLearning from '@/components/admin/AdminLearning';

export default function LegacyLearningPage() {
  return (
    <AdminGate>
      {({ email, logout }) => (
        <AdminShell email={email} onLogout={logout} title="Learning (Mongo)">
          <AdminLearning />
        </AdminShell>
      )}
    </AdminGate>
  );
}
