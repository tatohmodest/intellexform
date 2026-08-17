import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, Settings2 } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getInstitution, getMembership } from '@/lib/learn/ecosystem';
import CampusDomainSettings from '@/components/dashboard/CampusDomainSettings';
import OrgAdminPanel from '@/components/dashboard/OrgAdminPanel';
import {
  resolveCampusModules,
  type ModuleId,
} from '@/lib/eduos/capabilities';
import { resolveInstitutionFeatures } from '@/lib/eduos/featureFlags';
import { prisma } from '@/lib/db/prisma';
import { enterCampusContext } from '@/lib/campus/session';

export const dynamic = 'force-dynamic';

export default async function OrgAdminPage({ params }: { params: { slug: string } }) {
  const session = getSessionUser();
  if (!session) redirect(`/site/${params.slug}/login?next=${encodeURIComponent(`/dashboard/institutions/${params.slug}/admin`)}`);

  const inst = await getInstitution(params.slug);
  if (!inst) notFound();

  // Bind session to this institution so dashboard chrome stays on campus.
  await enterCampusContext({
    userId: session.uid,
    userName: session.name || 'Admin',
    userEmail: session.email,
    slug: params.slug,
    allowJoin: false,
  });

  const membership = await getMembership(params.slug, session.uid);
  if (membership !== 'owner') {
    // Also allow Prisma INSTITUTION_OWNER / ORG_ADMIN when Mongo role is missing.
    const prismaUser = session.email
      ? await prisma.user.findUnique({
          where: { email: session.email.toLowerCase() },
          select: { id: true },
        })
      : null;
    const prismaMember = prismaUser
      ? await prisma.institutionMembership.findFirst({
          where: {
            userId: prismaUser.id,
            institution: { slug: params.slug },
            role: { in: ['INSTITUTION_OWNER', 'ORG_ADMIN'] },
            isActive: true,
            suspendedAt: null,
          },
          select: { id: true },
        })
      : null;
    if (!prismaMember) redirect(`/dashboard/institutions/${params.slug}`);
  }

  const prismaInst = await prisma.institution
    .findUnique({
      where: { slug: params.slug },
      select: {
        settings: true,
        featuresEnabled: true,
        enabledModules: true,
        capabilityPack: true,
        enrollmentPolicy: true,
        primaryColor: true,
      },
    })
    .catch(() => null);

  const modules = resolveCampusModules({
    capabilityPack: (prismaInst?.capabilityPack ||
      inst.capabilityPack ||
      'foundation') as 'foundation' | 'professional' | 'enterprise' | 'custom',
    enabledModules: (prismaInst?.enabledModules ||
      inst.enabledModules ||
      []) as ModuleId[],
  });
  const features = resolveInstitutionFeatures({
    capabilityPack: prismaInst?.capabilityPack || inst.capabilityPack,
    enabledModules: prismaInst?.enabledModules || inst.enabledModules,
    featuresEnabled: prismaInst?.featuresEnabled || [],
  });

  const settings =
    prismaInst?.settings &&
    typeof prismaInst.settings === 'object' &&
    !Array.isArray(prismaInst.settings)
      ? (prismaInst.settings as Record<string, unknown>)
      : {};

  const accent = prismaInst?.primaryColor || inst.color || '#00b369';

  return (
    <div className="mx-auto max-w-[920px] px-4 py-8 sm:px-6">
      <Link
        href={`/dashboard/institutions/${params.slug}`}
        className="mb-6 inline-flex items-center gap-2 text-[13px] font-semibold"
        style={{ color: 'var(--ink-soft)' }}
      >
        <ArrowLeft size={14} /> Back to campus
      </Link>

      <header className="mb-8 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
        <p
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em]"
          style={{ color: 'var(--ink-soft)' }}
        >
          <Settings2 size={12} /> Organization admin
        </p>
        <h1 className="mt-2 font-display text-[32px] leading-none">{inst.name}</h1>
        <p className="mt-2 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          Operate your LMS — branding overview, domains, people policies, and enabled features.
          Intellex master controls stay out of this view.
        </p>
      </header>

      <OrgAdminPanel
        slug={params.slug}
        name={inst.name}
        accent={accent}
        modules={modules}
        features={features}
        settings={settings}
        enrollmentPolicy={String(prismaInst?.enrollmentPolicy || 'INVITE_ONLY')}
      />

      <div className="mt-10">
        <CampusDomainSettings slug={params.slug} accent={accent} />
      </div>
    </div>
  );
}
