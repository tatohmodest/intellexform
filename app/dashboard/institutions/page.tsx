import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth/getUser';
import { listPublicInstitutions, myInstitutionSlugs } from '@/lib/learn/ecosystem';
import { getOrgConfig } from '@/lib/org/config';
import InstitutionsBrowser from '@/components/dashboard/InstitutionsBrowser';
import PageHeader from '@/components/dashboard/PageHeader';

export const dynamic = 'force-dynamic';

export default async function InstitutionsPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/institutions');

  const [institutions, mine, org] = await Promise.all([
    listPublicInstitutions(),
    myInstitutionSlugs(session.uid),
    getOrgConfig(),
  ]);

  return (
    <div className="mx-auto max-w-[1080px]">
      <PageHeader
        title={org.name}
        actions={
          <>
            <Link href="/dashboard/apply" className="chip chip-primary">
              Apply as a student
            </Link>
          </>
        }
      />

      <InstitutionsBrowser institutions={institutions} memberOf={Array.from(mine)} />
    </div>
  );
}
