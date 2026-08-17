import Link from 'next/link';
import {
  BookOpen,
  Bot,
  Briefcase,
  Calendar,
  FlaskConical,
  Library,
  Megaphone,
  Radio,
  ShoppingBag,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  MODULE_CATALOG,
  campusNavItems,
  hasModule,
  packLabel,
  type ModuleId,
} from '@/lib/eduos/capabilities';
import { AnnouncementComposer } from '@/components/dashboard/CampusActions';
import MarkdownLite from '@/components/dashboard/MarkdownLite';
import CampusCoursesPanel from '@/components/dashboard/CampusCoursesPanel';
import CampusAssessmentsPanel from '@/components/dashboard/CampusAssessmentsPanel';
import CampusPeoplePanel from '@/components/dashboard/CampusPeoplePanel';
import CampusOrgCoursesPanel from '@/components/dashboard/CampusOrgCoursesPanel';
import CampusStudentHome from '@/components/dashboard/CampusStudentHome';
import CampusFeaturePanel from '@/components/dashboard/CampusFeaturePanel';

type Post = {
  id: string;
  title: string;
  body: string;
  authorName: string;
  createdAt: Date | string;
};

function tabAllowed(tab: string, modules: ModuleId[], role: string): boolean {
  const isStaff = ['instructor', 'owner', 'admin'].includes(role);
  const allowed = new Set(
    campusNavItems({ slug: '_', role, modules }).map((i) => i.id),
  );
  if (tab === 'home' || !tab) return true;
  if (allowed.has(tab)) return true;
  // Staff-only extras already in nav when staff
  if (isStaff && ['students', 'instructors', 'analytics'].includes(tab)) return true;
  return false;
}

export default function CampusCapabilityView({
  slug,
  institutionName,
  accent,
  pack,
  modules,
  role,
  tab,
  posts,
  canAnnounce,
  planName,
}: {
  slug: string;
  institutionName: string;
  accent: string;
  pack: string;
  modules: ModuleId[];
  role: string;
  tab: string;
  posts: Post[];
  canAnnounce: boolean;
  planName?: string | null;
}) {
  const nav = campusNavItems({ slug, role, modules });
  const active = tab || 'home';
  const isStaff = ['instructor', 'owner', 'admin'].includes(role);
  const digitalLearning = hasModule(modules, 'digital_learning');
  const assessment = hasModule(modules, 'assessment');
  const base = `/dashboard/institutions/${slug}`;
  const returnTo = encodeURIComponent(base);

  if (!tabAllowed(active, modules, role)) {
    return (
      <CampusFeaturePanel
        icon={Sparkles}
        title="Not on this campus plan"
        body=""
        accent={accent}
        campusName={institutionName}
        campusHref={base}
        locked
        lockedReason={`“${active}” is not included in ${institutionName}'s current tier (${packLabel(pack as 'foundation')}${planName ? ` · ${planName}` : ''}).`}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="min-w-0 overflow-hidden border-b pb-4" style={{ borderColor: 'var(--line)' }}>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
          {(planName || packLabel(pack as 'foundation'))} · Core + selected capabilities
        </span>
        <div className="mt-2 flex max-w-full flex-wrap gap-2">
          <span className="text-[12px] font-semibold" style={{ color: 'var(--ink-soft)' }}>
            Core
          </span>
          {modules.slice(0, 10).map((id) => {
            const meta = MODULE_CATALOG.find((m) => m.id === id);
            return (
              <span
                key={id}
                className="max-w-full break-words text-[12px] font-semibold sm:text-[12.5px]"
                style={{ color: accent }}
              >
                {meta?.name ?? id}
              </span>
            );
          })}
          {modules.length > 10 && (
            <span className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
              +{modules.length - 10} more
            </span>
          )}
        </div>
      </div>

      <nav className="-mx-1 flex gap-5 overflow-x-auto border-b" style={{ borderColor: 'var(--line)' }}>
        {nav.map((item) => {
          const isActive =
            item.id === active || (active === 'home' && item.id === 'home' && !tab);
          return (
            <Link
              key={item.id}
              href={item.href}
              className="shrink-0 border-b-2 pb-3 text-[13.5px] font-semibold transition-colors"
              style={{
                borderColor: isActive ? accent : 'transparent',
                color: isActive ? 'var(--ink)' : 'var(--ink-soft)',
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {active === 'home' && (
        <CampusStudentHome
          slug={slug}
          institutionName={institutionName}
          accent={accent}
          pack={pack}
          modules={modules}
          role={role}
          planName={planName}
        />
      )}

      {active === 'announcements' && (
        <section className="space-y-5">
          <div className="flex items-center gap-2.5">
            <Megaphone size={17} style={{ color: accent }} />
            <h2 className="font-display text-[21px]">Campus news</h2>
          </div>
          {canAnnounce && <AnnouncementComposer slug={slug} />}
          {posts.length === 0 ? (
            <div
              className="border border-dashed p-6 text-[13.5px]"
              style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
            >
              No announcements yet.
              {canAnnounce ? ' Post your first update above.' : ' Check back soon.'}
            </div>
          ) : (
            posts.map((p) => (
              <article key={p.id} className="border p-5" style={{ borderColor: 'var(--line)' }}>
                <div className="mb-1 text-[15px] font-semibold">{p.title}</div>
                <div className="mb-3 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                  {p.authorName} ·{' '}
                  {new Date(p.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
                <MarkdownLite text={p.body} />
              </article>
            ))
          )}
        </section>
      )}

      {active === 'courses' && (
        <div className="space-y-10">
          {!digitalLearning && !isStaff ? (
            <p className="text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
              Basic course access is part of Core. Full Course Studio (video paths, progress,
              certificates) unlocks with the Digital Learning capability.
            </p>
          ) : null}
          <CampusOrgCoursesPanel slug={slug} accent={accent} isStaff={isStaff} />
          <CampusCoursesPanel
            slug={slug}
            accent={accent}
            isStaff={isStaff}
            digitalLearning={digitalLearning}
          />
        </div>
      )}

      {active === 'students' && (
        <CampusPeoplePanel slug={slug} accent={accent} mode="students" />
      )}

      {active === 'instructors' && (
        <CampusPeoplePanel slug={slug} accent={accent} mode="instructors" />
      )}

      {active === 'calendar' && (
        <CampusFeaturePanel
          icon={Calendar}
          title="Campus calendar"
          body={`Deadlines, live classes, and class holdings for your work at ${institutionName}.`}
          accent={accent}
          campusName={institutionName}
          campusHref={base}
          actions={[
            {
              href: `/dashboard/calendar?campus=${encodeURIComponent(slug)}&returnTo=${returnTo}`,
              label: 'Open calendar',
              primary: true,
            },
            {
              href: `/dashboard/todos?campus=${encodeURIComponent(slug)}&returnTo=${returnTo}`,
              label: 'To-do list',
            },
            ...(assessment
              ? [
                  {
                    href: `${base}?tab=assignments`,
                    label: 'Exams & work',
                  },
                ]
              : []),
          ]}
        />
      )}

      {active === 'events' && (
        <CampusFeaturePanel
          icon={Sparkles}
          title="Events"
          body="Campus events and gatherings — included in InTelleX Core for every institution."
          accent={accent}
          campusName={institutionName}
          campusHref={base}
          actions={[
            {
              href: `/dashboard/calendar?campus=${encodeURIComponent(slug)}&returnTo=${returnTo}`,
              label: 'View schedule',
              primary: true,
            },
          ]}
        />
      )}

      {active === 'live' && (
        <CampusFeaturePanel
          icon={Radio}
          title="Live classes"
          body={`Join sessions and review class holdings for ${institutionName}. Live Teaching is enabled on this campus plan.`}
          accent={accent}
          campusName={institutionName}
          campusHref={base}
          locked={!hasModule(modules, 'live_teaching')}
          actions={[
            {
              href: `/dashboard/classroom?campus=${encodeURIComponent(slug)}&returnTo=${returnTo}`,
              label: 'Open live classroom',
              primary: true,
            },
            ...(isStaff
              ? [
                  {
                    href: `/dashboard/teach/courses?campus=${encodeURIComponent(slug)}&returnTo=${returnTo}`,
                    label: 'Teaching studio',
                  },
                ]
              : []),
          ]}
        />
      )}

      {active === 'assignments' && (
        assessment || isStaff ? (
          <CampusAssessmentsPanel slug={slug} accent={accent} isStaff={isStaff} />
        ) : (
          <CampusFeaturePanel
            icon={BookOpen}
            title="Exams & work"
            body=""
            accent={accent}
            campusName={institutionName}
            campusHref={base}
            locked
            lockedReason="Assessment Studio is not on this campus plan. Upgrade to Builder or higher to unlock exams and assignments."
          />
        )
      )}

      {active === 'library' && (
        <CampusFeaturePanel
          icon={Library}
          title="Digital library"
          body="Books, Drive files, slides, and class notes for this campus. Free titles open with Read now or Download."
          accent={accent}
          campusName={institutionName}
          campusHref={base}
          locked={!hasModule(modules, 'digital_library')}
          actions={[
            {
              href: `/dashboard/library?campus=${encodeURIComponent(slug)}&returnTo=${returnTo}`,
              label: 'Open library',
              primary: true,
            },
            {
              href: `/dashboard/notes?campus=${encodeURIComponent(slug)}&returnTo=${returnTo}`,
              label: 'Class notes',
            },
          ]}
        />
      )}

      {active === 'ai' && (
        <CampusFeaturePanel
          icon={Bot}
          title={isStaff ? 'AI assistant' : 'AI tutor'}
          body={`Campus AI uses ${institutionName}-approved materials and public InTelleX resources. Private institutional knowledge stays on this campus unless explicitly shared.`}
          accent={accent}
          campusName={institutionName}
          campusHref={base}
          locked={!hasModule(modules, 'ai_learning')}
          actions={[
            {
              href: `/dashboard/tutor?campus=${encodeURIComponent(slug)}&returnTo=${returnTo}`,
              label: 'Open AI Tutor',
              primary: true,
            },
          ]}
        />
      )}

      {active === 'intellex' && (
        <CampusFeaturePanel
          icon={Sparkles}
          title="InTelleX resources"
          body="Free tutorials and catalogue highlights embedded inside this campus — use InTelleX materials without leaving institutional context."
          accent={accent}
          campusName={institutionName}
          campusHref={base}
          locked={!hasModule(modules, 'intellex_resources')}
          actions={[
            {
              href: `/tutorials?campus=${encodeURIComponent(slug)}&returnTo=${returnTo}`,
              label: 'Browse free tutorials',
              primary: true,
            },
          ]}
        />
      )}

      {active === 'community' && (
        <CampusFeaturePanel
          icon={Users}
          title="Community"
          body="Clubs, forums, and faculty spaces unlocked by the Community capability on this campus."
          accent={accent}
          campusName={institutionName}
          campusHref={base}
          locked={!hasModule(modules, 'community')}
          actions={[
            {
              href: `/dashboard/messages?campus=${encodeURIComponent(slug)}&returnTo=${returnTo}`,
              label: 'Open messages',
              primary: true,
            },
          ]}
        />
      )}

      {active === 'career' && (
        <CampusFeaturePanel
          icon={Briefcase}
          title="Career center"
          body="CV builder, internships, job board, and portfolios — Career capability for this campus."
          accent={accent}
          campusName={institutionName}
          campusHref={base}
          locked={!hasModule(modules, 'career')}
          actions={[
            {
              href: `/dashboard/portfolio?campus=${encodeURIComponent(slug)}&returnTo=${returnTo}`,
              label: 'Open portfolio',
              primary: true,
            },
            {
              href: `/dashboard/academic?campus=${encodeURIComponent(slug)}&returnTo=${returnTo}`,
              label: 'Academic overview',
            },
          ]}
        />
      )}

      {active === 'research' && (
        <CampusFeaturePanel
          icon={FlaskConical}
          title="Research"
          body="Projects, publications, and repositories for university research workflows."
          accent={accent}
          campusName={institutionName}
          campusHref={base}
          locked={!hasModule(modules, 'research')}
        />
      )}

      {active === 'marketplace' && (
        <CampusFeaturePanel
          icon={ShoppingBag}
          title="Marketplace"
          body="Publish courses, books, and workshops publicly on InTelleX while showing this institution as the origin."
          accent={accent}
          campusName={institutionName}
          campusHref={base}
          locked={!hasModule(modules, 'marketplace')}
        />
      )}

      {active === 'analytics' && (
        <CampusFeaturePanel
          icon={Sparkles}
          title="Analytics"
          body="Basic campus analytics included in Core. Advanced reporting ships with Enterprise provisioning."
          accent={accent}
          campusName={institutionName}
          campusHref={base}
        />
      )}
    </div>
  );
}
