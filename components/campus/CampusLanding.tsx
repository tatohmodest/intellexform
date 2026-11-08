import Link from 'next/link';
import {
  BookOpen,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react';
import { admissionsCopy, type CampusBrand } from '@/lib/campus/brand';

type CourseCard = {
  id: string;
  title: string;
  shortDescription?: string | null;
  description?: string | null;
  priceXaf?: number | null;
  _count?: { enrollments?: number };
};

const STRUCTURE_LABELS: Record<string, string> = {
  departments: 'Departments',
  programs: 'Programs',
  cohorts: 'Cohorts',
  groups: 'Groups',
  levels: 'Levels',
};

function featureLabel(id: string) {
  return id.replace(/_/g, ' ');
}

export default function CampusLanding({
  brand,
  courses,
  features,
}: {
  brand: CampusBrand;
  courses: CourseCard[];
  features: string[];
}) {
  const { config } = brand;
  const accent = brand.accent;
  const useCover = Boolean(brand.coverUrl) && config.heroStyle === 'cover';
  const ctaHref =
    config.ctaHref ||
    (brand.enrollmentOpen ? brand.signupHref : brand.loginHref);
  const joinNote =
    config.admissionsNote || admissionsCopy(brand.studentRegistration, brand.platformName);

  return (
    <>
      <section className={useCover ? 'relative overflow-hidden text-white' : 'px-3 pt-3 sm:px-5'}>
        {useCover ? (
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brand.coverUrl!} alt="" className="h-full w-full object-cover" />
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(120deg, ${accent}cc 0%, #0C1116e8 70%)` }}
            />
          </div>
        ) : null}
        <div
          className={
            useCover
              ? 'relative mx-auto max-w-[1100px] px-5 py-16 sm:px-8 sm:py-24'
              : 'relative mx-auto max-w-[1100px] overflow-hidden rounded-[24px] border border-[#e7e9ec] px-6 py-16 sm:px-12 sm:py-20'
          }
          style={useCover ? undefined : { background: `${accent}0d` }}
        >
          {!useCover ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{ backgroundImage: 'radial-gradient(#e7e9ec 1px, transparent 1px)', backgroundSize: '18px 18px' }}
            />
          ) : null}
          <p className={`relative inline-flex items-center gap-2 text-[13.5px] font-medium ${useCover ? 'text-white/70' : 'text-[#4b5563]'}`}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: useCover ? '#fff' : accent }} />
            Digital campus
          </p>
          <h1 className="relative mt-4 max-w-3xl text-[44px] leading-[1] sm:text-[60px]">{brand.platformName}</h1>
          <p className={`relative mt-5 max-w-2xl text-[16px] leading-relaxed sm:text-[18px] ${useCover ? 'text-white/75' : 'text-[#4b5563]'}`}>
            {brand.tagline}
          </p>
          <div className="relative mt-9 flex flex-wrap gap-3">
            <Link
              href={ctaHref}
              className="rounded-[10px] px-5 py-3 text-[14px] font-medium"
              style={useCover ? { background: '#fff', color: '#0C1116' } : { background: accent, color: '#fff' }}
            >
              {config.ctaLabel || (brand.enrollmentOpen ? 'Join campus' : 'Enter LMS')}
            </Link>
            {config.showCourses ? (
              <a
                href="#courses"
                className={`rounded-[10px] border px-5 py-3 text-[14px] font-medium ${
                  useCover ? 'border-white/30 text-white' : 'border-[#e7e9ec] bg-white text-[#0C1116]'
                }`}
              >
                Browse courses
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1100px] px-5 py-14 sm:px-8">
        <section id="about" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-2">
            <Sparkles size={18} style={{ color: accent }} />
            <h2 className="text-[30px]">About</h2>
          </div>
          <p className="mt-4 max-w-3xl text-[15.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            {config.about ||
              brand.description ||
              `${brand.platformName} is a complete learning campus for students, instructors, and administrators.`}
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            {[brand.city, brand.country].filter(Boolean).length ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} />
                {[brand.city, brand.country].filter(Boolean).join(', ')}
              </span>
            ) : null}
            {brand.email ? (
              <a href={`mailto:${brand.email}`} className="inline-flex items-center gap-1.5 font-semibold" style={{ color: accent }}>
                <Mail size={14} />
                {brand.email}
              </a>
            ) : null}
          </div>
        </section>

        {config.showPrograms && brand.learningStructure.length > 0 ? (
          <section id="programs" className="mb-16 scroll-mt-24">
            <div className="flex items-center gap-2">
              <Layers size={18} style={{ color: accent }} />
              <h2 className="text-[30px]">Learning structure</h2>
            </div>
            <p className="mt-2 max-w-2xl text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
              How this campus organizes learning — configured during onboarding.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {brand.learningStructure.map((id) => (
                <div
                  key={id}
                  className="rounded-[20px] border bg-white px-5 py-5"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <GraduationCap size={18} style={{ color: accent }} />
                  <h3 className="mt-3 text-[20px] leading-tight">
                    {STRUCTURE_LABELS[id] || featureLabel(id)}
                  </h3>
                  <p className="mt-1.5 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                    Built into your campus LMS for cohorts, staff, and students.
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {config.showCourses ? (
          <section id="courses" className="mb-16 scroll-mt-24">
            <div className="flex items-center gap-2">
              <BookOpen size={18} style={{ color: accent }} />
              <h2 className="text-[30px]">Courses</h2>
            </div>
            {courses.length === 0 ? (
              <p className="mt-4 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
                Courses will appear here once your instructors publish them. Sign in to the LMS to
                start building.
              </p>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((c) => (
                  <article
                    key={c.id}
                    className="flex flex-col rounded-[20px] border bg-white p-5"
                    style={{ borderColor: 'var(--line)' }}
                  >
                    <h3 className="text-[20px] leading-tight">{c.title}</h3>
                    <p
                      className="mt-2 flex-1 line-clamp-3 text-[13px]"
                      style={{ color: 'var(--ink-soft)' }}
                    >
                      {c.shortDescription || c.description || 'Course on this learning platform.'}
                    </p>
                    <p className="mt-3 text-[12px] font-semibold" style={{ color: accent }}>
                      {c.priceXaf ? `${c.priceXaf.toLocaleString()} XAF` : 'Free'}
                      {c._count?.enrollments ? ` · ${c._count.enrollments} enrolled` : ''}
                    </p>
                    <Link
                      href={`${brand.loginHref}?next=${encodeURIComponent(`/dashboard/institutions/${brand.slug}/learn/${c.id}`)}`}
                      className="mt-3 inline-block text-[12.5px] font-semibold"
                      style={{ color: accent }}
                    >
                      Start learning →
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {config.showCapabilities && features.length > 0 ? (
          <section id="capabilities" className="mb-16 scroll-mt-24">
            <div className="flex items-center gap-2">
              <Users size={18} style={{ color: accent }} />
              <h2 className="text-[30px]">Campus platform</h2>
            </div>
            <p className="mt-2 max-w-2xl text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
              Capabilities enabled for {brand.platformName} — collaboration, learning, and admin tools
              in one place.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {features.map((f) => (
                <li
                  key={f}
                  className="rounded-full border px-3 py-1 text-[12px] font-medium capitalize"
                  style={{ borderColor: 'var(--line)' }}
                >
                  {featureLabel(f)}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {config.showJoin ? (
          <section
            id="join"
            className="mb-16 scroll-mt-24 rounded-[20px] border p-6 sm:p-8"
            style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
          >
            <h2 className="text-[28px]">Join {brand.platformName}</h2>
            <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              {joinNote}
            </p>
            <p className="mt-2 text-[12.5px] font-semibold uppercase tracking-[0.08em]" style={{ color: accent }}>
              {brand.studentRegistration.replace(/_/g, ' ')}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {brand.studentRegistration === 'public' ? (
                <Link
                  href={brand.signupHref}
                  className="rounded-[10px] px-5 py-3 text-[13.5px] font-semibold text-white"
                  style={{ background: accent }}
                >
                  Create InTelleX account
                </Link>
              ) : null}
              <Link
                href={brand.loginHref}
                className={
                  brand.studentRegistration === 'public'
                    ? 'border rounded-[10px] px-5 py-3 text-[13.5px] font-semibold'
                    : 'rounded-[10px] px-5 py-3 text-[13.5px] font-semibold text-white'
                }
                style={
                  brand.studentRegistration === 'public'
                    ? { borderColor: 'var(--line)', color: 'var(--ink)' }
                    : { background: accent }
                }
              >
                Sign in
              </Link>
            </div>
          </section>
        ) : null}

        {config.showContact ? (
          <section id="contact" className="mb-6 scroll-mt-24">
            <h2 className="text-[30px]">Contact</h2>
            <p className="mt-3 max-w-2xl text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
              {config.contactBlurb ||
                'Reach the campus team for enrollment, partnerships, or support.'}
            </p>
            <div className="mt-5 space-y-2 text-[14px]">
              {brand.email ? (
                <p>
                  Email:{' '}
                  <a href={`mailto:${brand.email}`} className="font-semibold" style={{ color: accent }}>
                    {brand.email}
                  </a>
                </p>
              ) : null}
              {[brand.city, brand.country].filter(Boolean).length ? (
                <p style={{ color: 'var(--ink-soft)' }}>
                  Location: {[brand.city, brand.country].filter(Boolean).join(', ')}
                </p>
              ) : null}
              {brand.website ? (
                <p>
                  Web:{' '}
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold"
                    style={{ color: accent }}
                  >
                    {brand.website}
                  </a>
                </p>
              ) : null}
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}
