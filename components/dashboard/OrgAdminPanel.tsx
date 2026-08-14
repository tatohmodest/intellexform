'use client';

import Link from 'next/link';
import { FEATURE_FLAG_CATALOG } from '@/lib/eduos/featureFlags';
import { getModuleMeta, type ModuleId } from '@/lib/eduos/capabilities';

export default function OrgAdminPanel({
  slug,
  name,
  accent,
  modules,
  features,
  settings,
  enrollmentPolicy,
}: {
  slug: string;
  name: string;
  accent: string;
  modules: ModuleId[];
  features: string[];
  settings: Record<string, unknown>;
  enrollmentPolicy: string;
}) {
  const platformName = String(settings.platformName || name);
  const structure = Array.isArray(settings.learningStructure)
    ? (settings.learningStructure as string[])
    : [];
  const studentRegistration = String(settings.studentRegistration || enrollmentPolicy);
  const instructorMode = String(settings.instructorMode || 'admin_create');

  return (
    <div className="space-y-8">
      <section className="border p-5" style={{ borderColor: 'var(--line)' }}>
        <h2 className="font-display text-[20px]">Overview</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-[14px]">
          <div>
            <dt style={{ color: 'var(--ink-soft)' }}>Platform</dt>
            <dd className="font-semibold">{platformName}</dd>
          </div>
          <div>
            <dt style={{ color: 'var(--ink-soft)' }}>Enrollment</dt>
            <dd className="font-semibold capitalize">{studentRegistration.replace(/_/g, ' ')}</dd>
          </div>
          <div>
            <dt style={{ color: 'var(--ink-soft)' }}>Instructors</dt>
            <dd className="font-semibold capitalize">{instructorMode.replace(/_/g, ' ')}</dd>
          </div>
          <div>
            <dt style={{ color: 'var(--ink-soft)' }}>Structure</dt>
            <dd className="font-semibold">{structure.length ? structure.join(', ') : 'Default'}</dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href={`/dashboard/institutions/${slug}?tab=courses`}
            className="px-3 py-2 text-[13px] font-semibold text-white"
            style={{ background: accent }}
          >
            Manage courses
          </Link>
          <Link
            href={`/dashboard/institutions/${slug}?tab=students`}
            className="border px-3 py-2 text-[13px] font-semibold"
            style={{ borderColor: 'var(--line)' }}
          >
            Manage students
          </Link>
          <Link
            href={`/dashboard/teach`}
            className="border px-3 py-2 text-[13px] font-semibold"
            style={{ borderColor: 'var(--line)' }}
          >
            Teaching studio
          </Link>
        </div>
      </section>

      <section className="border p-5" style={{ borderColor: 'var(--line)' }}>
        <h2 className="font-display text-[20px]">Enabled features</h2>
        <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          Flags from your Intellex plan. Contact Intellex Admin to change the commercial package.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {FEATURE_FLAG_CATALOG.map((f) => {
            const on = features.includes(f.id);
            return (
              <div
                key={f.id}
                className="border px-3 py-2 text-[13px]"
                style={{
                  borderColor: 'var(--line)',
                  opacity: on ? 1 : 0.45,
                }}
              >
                <span className="font-semibold">{f.label}</span>
                <span className="ml-2 text-[11px] font-mono uppercase" style={{ color: 'var(--ink-soft)' }}>
                  {on ? 'on' : 'off'}
                </span>
                <p className="mt-0.5 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border p-5" style={{ borderColor: 'var(--line)' }}>
        <h2 className="font-display text-[20px]">Capability modules</h2>
        <ul className="mt-3 space-y-1 text-[13px]">
          {modules.length === 0 ? (
            <li style={{ color: 'var(--ink-soft)' }}>Core campus only.</li>
          ) : (
            modules.map((id) => (
              <li key={id} className="font-semibold">
                {getModuleMeta(id)?.name || id}
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="border p-5" style={{ borderColor: 'var(--line)' }}>
        <h2 className="font-display text-[20px]">Empty states guide</h2>
        <p className="mt-2 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          No courses yet? Create your first course in Course Studio. No instructors? Invite staff or
          search verified Intellex mentors from the students/instructors campus tabs after your plan
          unlocks those tools.
        </p>
      </section>
    </div>
  );
}
