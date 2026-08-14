/**
 * SaaS feature flags for organization tenants.
 *
 * Packs/modules (`capabilities.ts`) remain the commercial packaging layer.
 * These flags are the fine-grained product toggles Intellex sells and gates:
 * courses, assignments, quizzes, certificates, live_classes, etc.
 *
 * `featuresEnabled` on Institution stores these ids.
 * When modules are provisioned, flags are derived; admins can also toggle flags directly.
 */

import type { ModuleId } from './capabilities';
import { hasModule, resolveCampusModules, type CapabilityPack } from './capabilities';

export const FEATURE_FLAG_CATALOG = [
  {
    id: 'courses',
    label: 'Courses',
    description: 'Course catalogue, studio, and enrollments.',
    modules: ['digital_learning'] as ModuleId[],
    core: true,
  },
  {
    id: 'assignments',
    label: 'Assignments',
    description: 'Homework, projects, and file submissions.',
    modules: ['assessment'] as ModuleId[],
  },
  {
    id: 'quizzes',
    label: 'Quizzes & exams',
    description: 'Quizzes, timed exams, and auto-grading.',
    modules: ['assessment'] as ModuleId[],
  },
  {
    id: 'certificates',
    label: 'Certificates',
    description: 'Issue and verify completion certificates.',
    modules: ['digital_learning'] as ModuleId[],
  },
  {
    id: 'live_classes',
    label: 'Live classes',
    description: 'Live sessions, attendance, and recordings.',
    modules: ['live_teaching'] as ModuleId[],
  },
  {
    id: 'attendance',
    label: 'Attendance',
    description: 'Track class and session attendance.',
    modules: ['live_teaching'] as ModuleId[],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Enrollment, completion, and instructor analytics.',
    modules: [] as ModuleId[],
    core: true,
  },
  {
    id: 'messaging',
    label: 'Messaging',
    description: 'In-app messaging between staff and learners.',
    modules: ['community'] as ModuleId[],
  },
  {
    id: 'ai_tools',
    label: 'AI tools',
    description: 'Campus AI tutor and study assistants.',
    modules: ['ai_learning'] as ModuleId[],
  },
  {
    id: 'custom_domain',
    label: 'Custom domain',
    description: 'Connect a branded hostname to this LMS.',
    modules: [] as ModuleId[],
  },
  {
    id: 'payments',
    label: 'Payments',
    description: 'Paid courses, wallets, and checkout.',
    modules: ['marketplace'] as ModuleId[],
  },
  {
    id: 'subscriptions',
    label: 'Subscriptions',
    description: 'Recurring membership and plan billing.',
    modules: ['marketplace'] as ModuleId[],
  },
  {
    id: 'blog',
    label: 'Blog',
    description: 'Public blog / news on the organization website.',
    modules: [] as ModuleId[],
  },
  {
    id: 'events',
    label: 'Events',
    description: 'Campus events calendar.',
    modules: [] as ModuleId[],
    core: true,
  },
  {
    id: 'departments',
    label: 'Departments',
    description: 'Academic departments and faculties.',
    modules: [] as ModuleId[],
    core: true,
  },
  {
    id: 'programs',
    label: 'Programs',
    description: 'Programs, cohorts, and learning paths.',
    modules: ['digital_learning'] as ModuleId[],
  },
  {
    id: 'cohorts',
    label: 'Cohorts',
    description: 'Cohort / class group management.',
    modules: ['digital_learning'] as ModuleId[],
  },
] as const;

export type FeatureFlagId = (typeof FEATURE_FLAG_CATALOG)[number]['id'];

export function isFeatureFlagId(v: string): v is FeatureFlagId {
  return FEATURE_FLAG_CATALOG.some((f) => f.id === v);
}

/** Derive feature flags from enabled modules (and core defaults). */
export function featuresFromModules(modules: ModuleId[]): FeatureFlagId[] {
  const set = new Set<FeatureFlagId>();
  for (const flag of FEATURE_FLAG_CATALOG) {
    if ('core' in flag && flag.core) {
      set.add(flag.id);
      continue;
    }
    if (flag.modules.length === 0) continue;
    if (flag.modules.some((m) => hasModule(modules, m))) {
      set.add(flag.id);
    }
  }
  return Array.from(set);
}

/** Resolve effective feature flags for an institution. */
export function resolveInstitutionFeatures(inst: {
  capabilityPack?: CapabilityPack | string | null;
  enabledModules?: string[] | null;
  featuresEnabled?: string[] | null;
}): FeatureFlagId[] {
  const modules = resolveCampusModules({
    capabilityPack: (inst.capabilityPack as CapabilityPack) || 'foundation',
    enabledModules: (inst.enabledModules || []) as ModuleId[],
  });
  const derived = featuresFromModules(modules);
  const explicit = (inst.featuresEnabled || []).filter(isFeatureFlagId);

  // Explicit flags win when present; otherwise derive from modules.
  if (explicit.length > 0) {
    const merged = new Set<FeatureFlagId>([...derived.filter((f) => {
      const meta = FEATURE_FLAG_CATALOG.find((x) => x.id === f);
      return Boolean(meta && 'core' in meta && meta.core);
    }), ...explicit]);
    return Array.from(merged);
  }
  return derived;
}

export function hasFeature(
  features: FeatureFlagId[] | string[] | null | undefined,
  flag: FeatureFlagId,
): boolean {
  return Boolean(features?.includes(flag));
}

/** Map selected SaaS flags back to modules that should be enabled. */
export function modulesFromFeatures(flags: FeatureFlagId[]): ModuleId[] {
  const set = new Set<ModuleId>();
  for (const id of flags) {
    const meta = FEATURE_FLAG_CATALOG.find((f) => f.id === id);
    if (!meta) continue;
    for (const m of meta.modules) set.add(m);
  }
  return Array.from(set);
}
