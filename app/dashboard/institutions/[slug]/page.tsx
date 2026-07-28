import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, Globe2, Lock, Users } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner, setActiveContext } from '@/lib/learn/repo';
import {
  getInstitution,
  getMembership,
  listInstitutionPosts,
} from '@/lib/learn/ecosystem';
import { JoinCampusButton } from '@/components/dashboard/CampusActions';
import CampusProfileComplete from '@/components/dashboard/CampusProfileComplete';
import CampusCapabilityView from '@/components/dashboard/CampusCapabilityView';
import CampusInstructorSalesToggle from '@/components/dashboard/CampusInstructorSalesToggle';
import {
  getModuleMeta,
  resolveCampusModules,
  type ModuleId,
} from '@/lib/eduos/capabilities';

export const dynamic = 'force-dynamic';

export default async function CampusPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { complete?: string; tab?: string };
}) {
  const session = getSessionUser();
  if (!session) redirect(`/login?next=/dashboard/institutions/${params.slug}`);

  const inst = await getInstitution(params.slug);
  if (!inst) notFound();

  const membership = await getMembership(params.slug, session.uid);
  if (inst.visibility === 'private' && !membership) {
    return (
      <div className="mx-auto flex max-w-[520px] flex-col items-center border p-8 text-center sm:p-10" style={{ borderColor: 'var(--line)' }}>
        <span className="mb-4 flex h-14 w-14 items-center justify-center" style={{ background: 'var(--paper-dim)', color: 'var(--ink-soft)' }}>
          <Lock size={24} />
        </span>
        <h1 className="font-display text-[22px]">This campus is private</h1>
        <p className="mt-2 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          {inst.name} is invite-only. Ask an administrator of the institution to add you, or use an
          onboarding / enrollment link from the Platform Team.
        </p>
        <Link href="/dashboard/institutions" className="btn btn-ghost mt-6 !rounded-none !py-2.5 text-[13.5px]">
          Back to institutions
        </Link>
      </div>
    );
  }

  const [posts, learner] = await Promise.all([
    listInstitutionPosts(params.slug),
    getLearner(session.uid),
  ]);
  const affiliation = (learner?.affiliations ?? []).find(
    (a) => a.institutionSlug === params.slug,
  );

  if (affiliation) {
    await setActiveContext(session.uid, {
      kind: 'institution',
      institutionSlug: params.slug,
    }).catch(() => {});
  }

  const showProfileComplete =
    Boolean(affiliation) &&
    affiliation?.profileComplete === false &&
    (searchParams?.complete === '1' || affiliation?.profileComplete === false);

  const modules = resolveCampusModules({
    capabilityPack: inst.capabilityPack,
    enabledModules: (inst.enabledModules ?? []) as ModuleId[],
  });
  const role =
    affiliation?.role ||
    (membership === 'owner' ? 'owner' : membership ? 'member' : 'viewer');
  const tab = searchParams?.tab || 'home';
  const cover = inst.coverUrl || null;
  const logo = inst.logoUrl || null;
  const accent = inst.color || '#00b369';

  return (
    <div className="mx-auto max-w-[960px] overflow-x-hidden px-0">
      {showProfileComplete && (
        <CampusProfileComplete
          slug={inst.slug}
          institutionName={inst.name}
          accent={accent}
        />
      )}
      <Link
        href="/dashboard/institutions"
        className="mb-6 inline-flex items-center gap-1.5 px-1 text-[13.5px] font-semibold"
        style={{ color: 'var(--ink-soft)' }}
      >
        <ArrowLeft size={14} /> Institutions
      </Link>

      {/* Full-bleed campus hero: cover or gradient */}
      <header className="relative mb-8 overflow-hidden text-white">
        {cover ? (
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt="" className="h-full w-full object-cover" />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(120deg, ${accent}cc 0%, #0C1116e6 70%)`,
              }}
            />
          </div>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(120deg, ${accent} 0%, #0C1116 72%)`,
            }}
          />
        )}
        <div className="relative p-6 sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-4 flex items-center gap-3">
                {logo ? (
                  <span
                    className="relative h-14 w-14 shrink-0 overflow-hidden border border-white/25 bg-white/10 sm:h-16 sm:w-16"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo} alt={`${inst.name} logo`} className="h-full w-full object-contain p-1" />
                  </span>
                ) : (
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center font-display text-[22px] font-bold sm:h-16 sm:w-16"
                    style={{ background: 'rgba(255,255,255,0.12)' }}
                  >
                    {(inst.name || 'I').charAt(0)}
                  </span>
                )}
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 sm:text-[11px]">
                  Digital campus · Powered by InTelleX
                </p>
              </div>
              <h1 className="break-words font-display text-[32px] leading-[0.95] tracking-tight sm:text-[44px]">
                {inst.name}
              </h1>
              <p className="mt-3 max-w-xl text-[14px] text-white/75 sm:text-[15px]">{inst.tagline}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/55 sm:text-[11px]">
                <span className="flex items-center gap-1">
                  <Users size={12} /> {inst.memberCount.toLocaleString()} members
                </span>
                <span className="flex items-center gap-1">
                  {inst.visibility === 'public' ? <Globe2 size={12} /> : <Lock size={12} />}
                  {inst.visibility === 'public' ? 'Public' : 'Private'}
                </span>
                {affiliation?.externalStudentId && <span>ID {affiliation.externalStudentId}</span>}
                {membership === 'owner' && <span>You run this campus</span>}
                {affiliation?.role && <span>{affiliation.role}</span>}
              </div>
            </div>
            <div className="shrink-0">
              <JoinCampusButton slug={inst.slug} isMember={Boolean(membership)} />
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="min-w-0 lg:col-span-3">
          <CampusCapabilityView
            slug={inst.slug}
            institutionName={inst.name}
            accent={accent}
            pack={inst.capabilityPack || 'foundation'}
            modules={modules}
            role={role}
            tab={tab}
            posts={posts}
            canAnnounce={membership === 'owner'}
          />
        </div>

        <aside className="min-w-0 space-y-8 lg:col-span-2">
          <div className="border-t pt-5" style={{ borderColor: 'var(--line)' }}>
            <h3 className="mb-2 font-display text-[18px]">About</h3>
            <p className="break-words text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              {inst.about || inst.tagline || 'This institution has not written an about section yet.'}
            </p>
            <div className="mt-4 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
              Founded by <span className="font-semibold" style={{ color: 'var(--ink)' }}>{inst.ownerName}</span>
              <br />
              Campus since{' '}
              {new Date(inst.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </div>
          </div>

          {membership === 'owner' && (
            <CampusInstructorSalesToggle
              slug={inst.slug}
              initial={Boolean(inst.allowInstructorSales)}
              accent={accent}
            />
          )}

          <div className="overflow-hidden border-t pt-5" style={{ borderColor: 'var(--line)' }}>
            <h3 className="mb-2 font-display text-[18px]">Capabilities</h3>
            <p className="mb-3 text-[13px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Every campus starts with InTelleX Core. Additional capabilities are provisioned by the Platform Team.
            </p>
            {modules.length === 0 ? (
              <p className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                Foundation · Core campus management only.
              </p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {modules.map((m) => {
                  const meta = getModuleMeta(m);
                  return (
                    <li
                      key={m}
                      className="max-w-full break-words border px-2.5 py-1 text-[11.5px] font-semibold leading-snug"
                      style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
                    >
                      {meta?.name ?? m.replace(/_/g, ' ')}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {inst.slug === 'intellex' && (
            <div className="border-t pt-5" style={{ borderColor: 'var(--line)' }}>
              <h3 className="mb-2 font-display text-[18px]">Home campus</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                InTelleX is the founding campus - branding, courses, and capabilities are managed by
                Platform Admin. Customize logo, cover, and pack from /admin.
              </p>
              <Link href="/dashboard/courses" className="mt-3 inline-block text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
                Browse InTelleX courses →
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
