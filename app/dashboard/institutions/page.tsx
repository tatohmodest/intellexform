import { redirect } from 'next/navigation';
import { Building2 } from 'lucide-react';
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
    <div className="mx-auto max-w-[1000px]">
      <div className="mb-8">
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <Building2 size={11} />
          The ecosystem
        </div>
        <h1 className="font-display text-[30px] leading-tight">Institutions</h1>
        <p className="mt-1 max-w-2xl text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Intellex is one campus in a connected education ecosystem. Schools, academies
          and companies open their own campus here — one account, every institution
          you belong to.
        </p>
      </div>

      <InstitutionsBrowser institutions={institutions} memberOf={Array.from(mine)} />
    </div>
  );
}
