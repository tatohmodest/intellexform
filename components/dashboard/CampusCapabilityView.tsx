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
  type LucideIcon,
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

type Post = {
  id: string;
  title: string;
  body: string;
  authorName: string;
  createdAt: Date | string;
};

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
}) {
  const nav = campusNavItems({ slug, role, modules });
  const active = tab || 'home';
  const isStaff = ['instructor', 'owner', 'admin'].includes(role);
  const digitalLearning = hasModule(modules, 'digital_learning');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b pb-4" style={{ borderColor: 'var(--line)' }}>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
          {packLabel(pack as 'foundation')} · Core included
        </span>
        {modules.slice(0, 5).map((id) => {
          const meta = MODULE_CATALOG.find((m) => m.id === id);
          return (
            <span key={id} className="text-[12.5px] font-semibold" style={{ color: accent }}>
              {meta?.name ?? id}
            </span>
          );
        })}
        {modules.length > 5 && (
          <span className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
            +{modules.length - 5} more
          </span>
        )}
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

      {(active === 'home' || active === 'announcements') && (
        <section className="space-y-5">
          <div className="flex items-center gap-2.5">
            <Megaphone size={17} style={{ color: accent }} />
            <h2 className="font-display text-[21px]">Campus news</h2>
          </div>
          {canAnnounce && <AnnouncementComposer slug={slug} />}
          {posts.length === 0 ? (
            <div
              className="rounded-2xl border border-dashed p-6 text-[13.5px]"
              style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
            >
              No announcements yet.
              {canAnnounce ? ' Post your first update above.' : ' Check back soon.'}
            </div>
          ) : (
            posts.map((p) => (
              <article key={p.id} className="rounded-2xl border p-5" style={{ borderColor: 'var(--line)' }}>
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
        <CampusCoursesPanel
          slug={slug}
          accent={accent}
          isStaff={isStaff}
          digitalLearning={digitalLearning}
        />
      )}

      {active === 'calendar' && (
        <CapabilityPanel
          icon={Calendar}
          title="Calendar"
          accent={accent}
          body={`Core calendar for ${institutionName} - exams, deadlines, and campus dates. Live session blocks appear when Live Teaching is enabled.`}
        />
      )}

      {active === 'events' && (
        <CapabilityPanel
          icon={Sparkles}
          title="Events"
          accent={accent}
          body="Campus events and gatherings. Part of InTelleX Core for every institution."
        />
      )}

      {active === 'live' && (
        <CapabilityPanel
          icon={Radio}
          title="Live classes"
          accent={accent}
          body="Live Teaching capability: video classes, attendance, whiteboard, and session recordings - only visible because this campus unlocked it."
        />
      )}

      {active === 'assignments' && (
        <CampusAssessmentsPanel slug={slug} accent={accent} isStaff={isStaff} />
      )}

      {active === 'library' && (
        <CapabilityPanel
          icon={Library}
          title="Digital library"
          accent={accent}
          body="PDFs, slides, past questions, and notes. Creators set visibility: private to campus, partner network, or public on InTelleX."
          cta={
            <Link href="/dashboard/library" className="text-[13px] font-semibold" style={{ color: accent }}>
              Open personal library →
            </Link>
          }
        />
      )}

      {active === 'ai' && (
        <CapabilityPanel
          icon={Bot}
          title={isStaff ? 'AI assistant' : 'AI tutor'}
          accent={accent}
          body={`Campus AI learns only from ${institutionName}-approved materials and public InTelleX resources. Private institutional knowledge never leaves this campus unless explicitly shared.`}
          cta={
            <Link href="/dashboard/tutor" className="text-[13px] font-semibold" style={{ color: accent }}>
              Open AI Tutor →
            </Link>
          }
        />
      )}

      {active === 'intellex' && (
        <CapabilityPanel
          icon={Sparkles}
          title="InTelleX resources"
          accent={accent}
          body="Free tutorials and catalogue highlights embedded inside this campus - so learners use InTelleX materials without leaving institutional context."
          cta={
            <Link href="/tutorials" className="text-[13px] font-semibold" style={{ color: accent }}>
              Browse free tutorials →
            </Link>
          }
        />
      )}

      {active === 'community' && (
        <CapabilityPanel
          icon={Users}
          title="Community"
          accent={accent}
          body="Clubs, forums, and faculty spaces unlocked by the Community capability."
        />
      )}

      {active === 'career' && (
        <CapabilityPanel
          icon={Briefcase}
          title="Career center"
          accent={accent}
          body="CV builder, internships, job board, and portfolios - Career capability for this campus."
        />
      )}

      {active === 'research' && (
        <CapabilityPanel
          icon={FlaskConical}
          title="Research"
          accent={accent}
          body="Projects, publications, and repositories for university research workflows."
        />
      )}

      {active === 'marketplace' && (
        <CapabilityPanel
          icon={ShoppingBag}
          title="Marketplace"
          accent={accent}
          body="Publish courses, books, and workshops publicly on InTelleX while showing this institution as the origin."
        />
      )}

      {active === 'students' && (
        <CapabilityPanel
          icon={Users}
          title="Students"
          accent={accent}
          body="Core student management for instructors and admins on this campus."
        />
      )}

      {active === 'analytics' && (
        <CapabilityPanel
          icon={Sparkles}
          title="Analytics"
          accent={accent}
          body="Basic campus analytics included in Core. Advanced reporting ships with Enterprise provisioning."
        />
      )}
    </div>
  );
}

function CapabilityPanel({
  icon: Icon,
  title,
  body,
  accent,
  cta,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  accent: string;
  cta?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border p-6" style={{ borderColor: 'var(--line)' }}>
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
          style={{ background: accent }}
        >
          <Icon size={18} />
        </span>
        <h2 className="font-display text-[20px]">{title}</h2>
      </div>
      <p className="text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        {body}
      </p>
      {cta && <div className="mt-4">{cta}</div>}
    </section>
  );
}
