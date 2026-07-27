'use client';

import AdminGate from '@/components/admin/AdminGate';
import AdminShell from '@/components/admin/AdminShell';
import AdminCourses from '@/components/admin/AdminCourses';

export default function LegacyCoursesPage() {
  return (
    <AdminGate>
      {({ email, logout }) => (
        <AdminShell email={email} onLogout={logout} title="Mongo catalogue">
          <AdminCourses />
        </AdminShell>
      )}
    </AdminGate>
  );
}
