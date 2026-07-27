'use client';

import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export default function AdminGate({
  children,
}: {
  children: (ctx: { email: string; logout: () => void }) => React.ReactNode;
}) {
  const [authState, setAuthState] = useState<'checking' | 'unauthenticated' | 'authenticated'>(
    'checking',
  );
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    fetch('/api/admin/auth')
      .then(async (r) => {
        if (!r.ok) {
          setAuthState('unauthenticated');
          return;
        }
        const data = await r.json().catch(() => ({}));
        setAdminEmail(data.email || '');
        setAuthState('authenticated');
      })
      .catch(() => setAuthState('unauthenticated'));
  }, []);

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin';
  }

  if (authState === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--paper)' }}>
        <div className="flex items-center gap-3" style={{ color: 'var(--ink-soft)' }}>
          <RefreshCw size={18} className="animate-spin" />
          <span className="text-sm">Checking access…</span>
        </div>
      </div>
    );
  }

  if (authState === 'unauthenticated') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4" style={{ background: 'var(--paper)' }}>
        <BrandLogo href={null} height={40} variant="mark" />
        <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
          Admin session required.
        </p>
        <a href="/admin" className="btn btn-primary !rounded-none">
          Sign in at /admin
        </a>
      </div>
    );
  }

  return <>{children({ email: adminEmail, logout })}</>;
}
