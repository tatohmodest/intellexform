import Link from 'next/link';
import {
  BookOpen,
  Bot,
  Briefcase,
  Calendar,
  ClipboardList,
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

const ICONS: Record<string, LucideIcon> = {
  home: Sparkles,
  announcements: Megaphone,
  calendar: Calendar,
  events: Sparkles,
  courses: BookOpen,
  assignments: ClipboardList,
  live: Radio,
  library: Library,
  ai: Bot,
  intellex: Sparkles,
  community: Users,
  career: Briefcase,
  research: FlaskConical,
  marketplace: ShoppingBag,
  students: Users,
  instructors: Users,
  analytics: Sparkles,
};

const BLURBS: Record<string, string> = {
  home: 'Your campus home and news feed.',
  announcements: 'Campus news and updates from staff.',
  calendar: 'Deadlines, live sessions, and campus schedule.',
  events: 'Campus gatherings and programs.',
  courses: 'Your enrolled courses and learning paths.',
  assignments: 'Exams, quizzes, and graded work.',
  live: 'Live classes and session holdings.',
  library: 'Books, notes, slides, and Drive files.',
  ai: 'Campus-scoped AI tutor and study help.',
  intellex: 'Free InTelleX tutorials inside your campus.',
  community: 'Clubs, forums, and peer spaces.',
  career: 'CV, internships, and portfolios.',
  research: 'Research projects and repositories.',
  marketplace: 'Publish and sell campus offerings.',
  students: 'Student directory and enrollment.',
  instructors: 'Teaching staff directory.',
  analytics: 'Campus learning analytics.',
};

/**
 * Student-facing overview of everything unlocked on this campus tier.
 */
export default function CampusStudentHome({
  slug,
  institutionName,
  accent,
  pack,
  modules,
  role,
  planName,
}: {
  slug: string;
  institutionName: string;
  accent: string;
  pack: string;
  modules: ModuleId[];
  role: string;
  planName?: string | null;
}) {
  const nav = campusNavItems({ slug, role, modules }).filter((i) => i.id !== 'home');
  const moduleMetas = modules
    .map((id) => MODULE_CATALOG.find((m) => m.id === id))
    .filter(Boolean);

  return (
    <div className="space-y-8">
      <section>
        <p
          className="font-mono text-[10px] uppercase tracking-[0.16em]"
          style={{ color: 'var(--ink-soft)' }}
        >
          {planName || packLabel(pack as 'foundation')} · Your student dashboard
        </p>
        <h2 className="mt-2 font-display text-[28px] leading-tight tracking-tight">
          Welcome to {institutionName}
        </h2>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          This campus includes InTelleX Core plus the capabilities on your institution&apos;s plan.
          Open a tool below — everything stays inside {institutionName}.
        </p>
      </section>

      <section
        className="border px-4 py-4 sm:px-5"
        style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
      >
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em]" style={{ color: accent }}>
          Unlocked on this campus
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className="border px-2.5 py-1 text-[12px] font-semibold"
            style={{ borderColor: 'var(--line)' }}
          >
            Core campus
          </span>
          {moduleMetas.map((m) => (
            <span
              key={m!.id}
              className="border px-2.5 py-1 text-[12px] font-semibold"
              style={{ borderColor: `${accent}55`, color: accent }}
            >
              {m!.name}
            </span>
          ))}
          {modules.length === 0 ? (
            <span className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              Starter / Core only — ask your admin to upgrade for courses, AI, live classes, and more.
            </span>
          ) : null}
        </div>
      </section>

      <section>
        <h3 className="font-display text-[22px]">Your campus tools</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {nav.map((item) => {
            const Icon = ICONS[item.id] || Sparkles;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="group border p-4 transition-colors hover:border-current"
                style={{ borderColor: 'var(--line)' }}
              >
                <span
                  className="flex h-10 w-10 items-center justify-center text-white"
                  style={{ background: accent }}
                >
                  <Icon size={18} />
                </span>
                <h4 className="mt-3 font-display text-[18px] leading-tight">{item.label}</h4>
                <p className="mt-1.5 text-[13px] leading-snug" style={{ color: 'var(--ink-soft)' }}>
                  {BLURBS[item.id] || 'Open this campus capability.'}
                </p>
                <span className="mt-3 inline-block text-[12.5px] font-semibold" style={{ color: accent }}>
                  Open →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {!hasModule(modules, 'digital_learning') && !hasModule(modules, 'assessment') ? (
        <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          Tip: Course Studio and Assessment unlock on Builder and higher plans. Your admin can upgrade
          from Organization admin.
        </p>
      ) : null}
    </div>
  );
}
