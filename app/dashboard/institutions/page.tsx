import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth/getUser';
import { listPublicInstitutions, myInstitutionSlugs } from '@/lib/learn/ecosystem';
import { getOrgConfig } from '@/lib/org/config';
import InstitutionsBrowser from '@/components/dashboard/InstitutionsBrowser';

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
      <header className="mb-2 border-b pb-8" style={{ borderColor: 'var(--line)' }}>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--ink-soft)' }}>
          {org.name}
        </p>
        <h1 className="font-display text-[40px] leading-[0.95] tracking-tight sm:text-[52px]">
          This
          <br />
          institution
        </h1>
        <p className="mt-4 max-w-[480px] text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          This deployment is {org.name}. Anyone can use the learning platform. Becoming an official
          student is a separate application — same account, no second login.{' '}
          <Link href="/dashboard/apply" className="font-semibold" style={{ color: 'var(--green-deep)' }}>
            Apply now →
          </Link>
        </p>
      </header>

      <InstitutionsBrowser institutions={institutions} memberOf={Array.from(mine)} />
    </div>
  );
}
