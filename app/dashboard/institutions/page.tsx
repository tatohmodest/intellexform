import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { listPublicInstitutions, myInstitutionSlugs } from '@/lib/learn/ecosystem';
import InstitutionsBrowser from '@/components/dashboard/InstitutionsBrowser';

export const dynamic = 'force-dynamic';

export default async function InstitutionsPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/institutions');

  const [institutions, mine] = await Promise.all([
    listPublicInstitutions(),
    myInstitutionSlugs(session.uid),
  ]);

  return (
    <div className="mx-auto max-w-[1080px]">
      <header className="mb-2 border-b pb-8" style={{ borderColor: 'var(--line)' }}>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--ink-soft)' }}>
          Digital campuses
        </p>
        <h1 className="font-display text-[40px] leading-[0.95] tracking-tight sm:text-[52px]">
          Institution
          <br />
          network
        </h1>
        <p className="mt-4 max-w-[420px] text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          One InTelleX identity. Many campuses. Pick where you study or teach — without another
          account.
        </p>
      </header>

      <InstitutionsBrowser institutions={institutions} memberOf={Array.from(mine)} />
    </div>
  );
}
