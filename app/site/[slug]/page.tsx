import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { listOrgCourses } from '@/lib/orgLms';
import { resolveInstitutionFeatures } from '@/lib/eduos/featureFlags';

export const dynamic = 'force-dynamic';

/**
 * Public white-label organization website (guest-accessible).
 * Custom domains can rewrite here via campus-gateway.
 */
export default async function OrgPublicSitePage({
  params,
}: {
  params: { slug: string };
}) {
  const inst = await prisma.institution.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      logoUrl: true,
      coverUrl: true,
      primaryColor: true,
      secondaryColor: true,
      website: true,
      email: true,
      country: true,
      city: true,
      status: true,
      visibility: true,
      subdomain: true,
      customDomain: true,
      capabilityPack: true,
      enabledModules: true,
      featuresEnabled: true,
      settings: true,
    },
  });

  if (!inst || inst.status === 'SUSPENDED' || inst.status === 'ARCHIVED') {
    notFound();
  }

  const settings =
    inst.settings && typeof inst.settings === 'object' && !Array.isArray(inst.settings)
      ? (inst.settings as Record<string, unknown>)
      : {};
  const platformName = String(settings.platformName || inst.name);
  const tagline = String(settings.tagline || inst.description || 'Learning powered by Intellex');
  const accent = inst.primaryColor || '#00B369';

  const courses = await listOrgCourses({
    slug: inst.slug,
    publishedOnly: true,
  });

  const features = resolveInstitutionFeatures({
    capabilityPack: inst.capabilityPack,
    enabledModules: inst.enabledModules,
    featuresEnabled: inst.featuresEnabled,
  });

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <header
        className="relative overflow-hidden text-white"
        style={{
          background: inst.coverUrl
            ? undefined
            : `linear-gradient(125deg, ${accent} 0%, #0C1116 75%)`,
        }}
      >
        {inst.coverUrl ? (
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={inst.coverUrl} alt="" className="h-full w-full object-cover" />
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(120deg, ${accent}cc 0%, #0C1116e8 70%)` }}
            />
          </div>
        ) : null}
        <div className="relative mx-auto flex max-w-[1040px] flex-col gap-8 px-5 py-14 sm:px-8 sm:py-20">
          <div className="flex items-center gap-3">
            {inst.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={inst.logoUrl}
                alt=""
                className="h-12 w-12 object-contain bg-white/10 p-1"
              />
            ) : (
              <span
                className="flex h-12 w-12 items-center justify-center font-display text-xl font-bold"
                style={{ background: 'rgba(255,255,255,0.12)' }}
              >
                {platformName.charAt(0)}
              </span>
            )}
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
              {platformName}
            </p>
          </div>
          <div className="max-w-2xl">
            <h1 className="font-display text-[42px] leading-[0.95] tracking-tight sm:text-[56px]">
              {platformName}
            </h1>
            <p className="mt-4 text-[16px] text-white/75 sm:text-[17px]">{tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/login?next=/dashboard/institutions/${inst.slug}`}
                className="px-5 py-3 text-[13.5px] font-semibold text-[#0C1116]"
                style={{ background: '#fff' }}
              >
                Enter LMS
              </Link>
              <a
                href="#courses"
                className="border border-white/30 px-5 py-3 text-[13.5px] font-semibold text-white"
              >
                Browse courses
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1040px] px-5 py-12 sm:px-8">
        <section className="mb-14">
          <h2 className="font-display text-[28px]">About</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            {inst.description ||
              `${platformName} runs on Intellex — a complete learning platform for students, instructors, and administrators.`}
          </p>
          <p className="mt-3 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            {[inst.city, inst.country].filter(Boolean).join(', ') || null}
            {inst.email ? ` · ${inst.email}` : ''}
          </p>
        </section>

        <section id="courses" className="mb-14">
          <h2 className="font-display text-[28px]">Courses</h2>
          {courses.length === 0 ? (
            <p className="mt-4 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              No published courses yet. Check back soon.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <article
                  key={c.id}
                  className="border p-4"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <h3 className="font-display text-[20px] leading-tight">{c.title}</h3>
                  <p className="mt-2 line-clamp-3 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                    {c.shortDescription || c.description || 'Course on this learning platform.'}
                  </p>
                  <p className="mt-3 text-[12px] font-semibold" style={{ color: accent }}>
                    {c.priceXaf ? `${c.priceXaf.toLocaleString()} XAF` : 'Free'}
                    {c._count.enrollments ? ` · ${c._count.enrollments} enrolled` : ''}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mb-14">
          <h2 className="font-display text-[28px]">Platform capabilities</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {features.map((f) => (
              <li
                key={f}
                className="border px-2.5 py-1 text-[12px] font-semibold capitalize"
                style={{ borderColor: 'var(--line)' }}
              >
                {f.replace(/_/g, ' ')}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer
        className="border-t px-5 py-8 text-center text-[12px] sm:px-8"
        style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
      >
        {platformName} · Powered by Intellex
        {inst.website ? (
          <>
            {' · '}
            <a href={inst.website} className="font-semibold" style={{ color: accent }}>
              Website
            </a>
          </>
        ) : null}
      </footer>
    </div>
  );
}
