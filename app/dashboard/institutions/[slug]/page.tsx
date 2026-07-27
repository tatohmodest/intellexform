import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, Globe2, Lock, Megaphone, Users } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner, setActiveContext } from '@/lib/learn/repo';
import {
  getInstitution,
  getMembership,
  listInstitutionPosts,
} from '@/lib/learn/ecosystem';
import { AnnouncementComposer, JoinCampusButton } from '@/components/dashboard/CampusActions';
import CampusProfileComplete from '@/components/dashboard/CampusProfileComplete';
import MarkdownLite from '@/components/dashboard/MarkdownLite';

export const dynamic = 'force-dynamic';

export default async function CampusPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { complete?: string };
}) {
  const session = getSessionUser();
  if (!session) redirect(`/login?next=/dashboard/institutions/${params.slug}`);

  const inst = await getInstitution(params.slug);
  if (!inst) notFound();

  const membership = await getMembership(params.slug, session.uid);
  if (inst.visibility === 'private' && !membership) {
    return (
      <div className="mx-auto flex max-w-[520px] flex-col items-center rounded-3xl border p-10 text-center" style={{ borderColor: 'var(--line)' }}>
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: 'var(--paper-dim)', color: 'var(--ink-soft)' }}>
          <Lock size={24} />
        </span>
        <h1 className="font-display text-[22px]">This campus is private</h1>
        <p className="mt-2 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          {inst.name} is invite-only. Ask an administrator of the institution to add you.
        </p>
        <Link href="/dashboard/institutions" className="btn btn-ghost mt-6 !py-2.5 text-[13.5px]">
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

  return (
    <div className="mx-auto max-w-[900px]">
      {showProfileComplete && (
        <CampusProfileComplete
          slug={inst.slug}
          institutionName={inst.name}
          accent={inst.color}
        />
      )}
      <Link href="/dashboard/institutions" className="mb-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold" style={{ color: 'var(--ink-soft)' }}>
        <ArrowLeft size={14} /> Institutions
      </Link>

      {/* Branded campus header */}
      <div
        className="mb-8 overflow-hidden rounded-3xl text-white"
        style={{
          background: `radial-gradient(900px 400px at 0% 0%, ${inst.color}cc, transparent 65%), radial-gradient(700px 380px at 100% 100%, ${inst.color}66, transparent 60%), #0C1116`,
        }}
      >
        <div className="p-7 sm:p-9">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <span
                className="flex h-16 w-16 items-center justify-center rounded-2xl font-display text-[26px] font-semibold"
                style={{ background: 'rgba(255,255,255,0.14)' }}
              >
                {(inst.name || 'I').charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
                  Institution context · same InTelleX identity
                </p>
                <h1 className="font-display text-[28px] leading-tight">{inst.name}</h1>
                <p className="text-[13.5px] text-white/70">{inst.tagline}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[12px] text-white/60">
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {inst.memberCount.toLocaleString()} members
                  </span>
                  <span className="flex items-center gap-1">
                    {inst.visibility === 'public' ? <Globe2 size={12} /> : <Lock size={12} />}
                    {inst.visibility === 'public' ? 'Public campus' : 'Private campus'}
                  </span>
                  {affiliation?.externalStudentId && (
                    <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide">
                      ID {affiliation.externalStudentId}
                    </span>
                  )}
                  {membership === 'owner' && (
                    <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide">
                      You run this campus
                    </span>
                  )}
                </div>
              </div>
            </div>
            <JoinCampusButton slug={inst.slug} isMember={Boolean(membership)} />
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div className="flex items-center gap-2.5">
            <Megaphone size={17} style={{ color: 'var(--green-deep)' }} />
            <h2 className="font-display text-[21px]">Campus news</h2>
          </div>

          {membership === 'owner' && <AnnouncementComposer slug={inst.slug} />}

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-6 text-[13.5px]" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
              No announcements yet.
              {membership === 'owner' ? ' Post your first update above.' : ' Check back soon.'}
            </div>
          ) : (
            posts.map((p) => (
              <article key={p.id} className="rounded-2xl border p-5" style={{ borderColor: 'var(--line)' }}>
                <div className="mb-1 text-[15px] font-semibold">{p.title}</div>
                <div className="mb-3 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                  {p.authorName} ·{' '}
                  {new Date(p.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <MarkdownLite text={p.body} />
              </article>
            ))
          )}
        </div>

        <aside className="lg:col-span-2">
          <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--line)' }}>
            <h3 className="mb-2 font-display text-[17px]">About</h3>
            <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              {inst.about || inst.tagline || 'This institution has not written an about section yet.'}
            </p>
            <div className="mt-4 border-t pt-4 text-[12.5px]" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
              Founded by <span className="font-semibold" style={{ color: 'var(--ink)' }}>{inst.ownerName}</span>
              <br />
              Campus since{' '}
              {new Date(inst.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </div>
          </div>

          {inst.slug === 'intellex' && (
            <div className="mt-4 rounded-2xl border p-5" style={{ borderColor: 'rgba(0,179,105,0.3)', background: 'rgba(0,179,105,0.04)' }}>
              <h3 className="mb-2 font-display text-[17px]">Home campus</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                Intellex is the founding institution of the ecosystem — its courses,
                mentors, library and AI tutor are available to every member.
              </p>
              <Link href="/dashboard/courses" className="mt-3 inline-block text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
                Browse Intellex courses →
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
