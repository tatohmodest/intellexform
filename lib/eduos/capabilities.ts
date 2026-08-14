/**
 * InTelleX EduIaaS - Core + Capabilities (Modules)
 *
 * Every institution gets the Core. Capabilities unlock based on what they
 * pay for / are provisioned. Internally: modules. Externally: capabilities.
 *
 * Institutions assemble a digital campus - they don't buy a "Gold plan" story.
 */

export const CORE_CAPABILITIES = [
  'portal',
  'branding',
  'students',
  'teachers',
  'departments',
  'courses_basic',
  'announcements',
  'events',
  'calendar',
  'notifications',
  'library_basic',
  'roles',
  'identity',
  'dashboard',
  'analytics_basic',
  'api',
] as const;

export type CoreCapabilityId = (typeof CORE_CAPABILITIES)[number];

/** Optional modules unlocked beyond Core. */
export const MODULE_CATALOG = [
  {
    id: 'digital_learning',
    name: 'Digital Learning',
    tagline: 'Video courses, progress, assessments, certificates.',
    includes: [
      'Video courses & lesson progress',
      'Course builder',
      'Assessments & learning paths',
      'Certificates of completion',
    ],
  },
  {
    id: 'live_teaching',
    name: 'Live Teaching',
    tagline: 'Live classes, attendance, whiteboard, recordings.',
    includes: [
      'Live classes & video conferencing',
      'Attendance',
      'Screen sharing & whiteboard',
      'Session recording',
    ],
  },
  {
    id: 'assessment',
    name: 'Assessment',
    tagline: 'Quizzes, exams, rubrics, submissions.',
    includes: [
      'Quizzes & exams',
      'Auto grading',
      'Assignment submission',
      'Rubrics',
    ],
  },
  {
    id: 'ai_learning',
    name: 'AI Learning',
    tagline: 'Campus AI that learns only from approved knowledge.',
    includes: [
      'AI Tutor for students',
      'Study assistant & summaries',
      'Question generator',
      'Institution-scoped knowledge boundaries',
    ],
  },
  {
    id: 'digital_library',
    name: 'Digital Library',
    tagline: 'PDFs, notes, slides, past questions - with visibility controls.',
    includes: [
      'Institution library',
      'Instructor uploads',
      'Private / partner / public visibility',
    ],
  },
  {
    id: 'community',
    name: 'Community',
    tagline: 'Clubs, forums, discussions, campus life.',
    includes: ['Student & faculty communities', 'Clubs', 'Discussion boards'],
  },
  {
    id: 'career',
    name: 'Career',
    tagline: 'CV builder, jobs, internships, portfolios.',
    includes: ['Career center', 'Job board', 'Internships', 'Portfolios'],
  },
  {
    id: 'research',
    name: 'Research',
    tagline: 'Publications, labs, repositories for universities.',
    includes: ['Research projects', 'Publications', 'Repositories'],
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    tagline: 'Sell courses, books, and workshops on InTelleX.',
    includes: ['Public listings', 'Paid courses & books', 'Institution storefront'],
  },
  {
    id: 'intellex_resources',
    name: 'InTelleX Resources',
    tagline: 'Show free InTelleX tutorials & catalogue inside the campus.',
    includes: ['Free tutorials embed', 'Catalogue highlights', 'Shared open resources'],
  },
] as const;

export type ModuleId = (typeof MODULE_CATALOG)[number]['id'];

export type CapabilityId = CoreCapabilityId | ModuleId;

/** Commercial packs - provisioned by Platform Team, not self-serve. */
export type CapabilityPack = 'foundation' | 'professional' | 'enterprise' | 'custom';

export const CAPABILITY_PACKS: Record<
  Exclude<CapabilityPack, 'custom'>,
  {
    name: string;
    summary: string;
    modules: ModuleId[];
  }
> = {
  foundation: {
    name: 'Foundation',
    summary: 'InTelleX Core - enough to run a digital campus on day one.',
    modules: [],
  },
  professional: {
    name: 'Professional',
    summary: 'Core plus digital learning, AI, library, and InTelleX resources.',
    modules: [
      'digital_learning',
      'assessment',
      'ai_learning',
      'digital_library',
      'intellex_resources',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    summary: 'Full campus stack - live teaching, career, community, marketplace, research.',
    modules: MODULE_CATALOG.map((m) => m.id),
  },
};

export function modulesForPack(pack: CapabilityPack, customModules?: ModuleId[]): ModuleId[] {
  if (pack === 'custom') {
    return Array.from(new Set(customModules ?? []));
  }
  return [...CAPABILITY_PACKS[pack].modules];
}

export function hasModule(
  enabled: ModuleId[] | undefined | null,
  moduleId: ModuleId,
): boolean {
  return Boolean(enabled?.includes(moduleId));
}

export type CampusNavItem = {
  id: string;
  label: string;
  href: string;
  /** Core always; otherwise requires this module. */
  module?: ModuleId;
  roles?: Array<'student' | 'instructor' | 'owner' | 'member' | 'admin'>;
};

/** Dynamic campus navigation - only Core + enabled modules appear. */
export function campusNavItems(opts: {
  slug: string;
  role: string;
  modules: ModuleId[];
}): CampusNavItem[] {
  const base = `/dashboard/institutions/${opts.slug}`;
  const role = opts.role;
  const isStaff = ['instructor', 'owner', 'admin'].includes(role);
  const items: CampusNavItem[] = [
    { id: 'home', label: 'Campus home', href: base },
    { id: 'announcements', label: 'Announcements', href: `${base}?tab=announcements` },
    { id: 'calendar', label: 'Calendar', href: `${base}?tab=calendar` },
    { id: 'events', label: 'Events', href: `${base}?tab=events` },
    {
      id: 'courses',
      label: isStaff
        ? hasModule(opts.modules, 'digital_learning')
          ? 'Course studio'
          : 'Courses'
        : 'My courses',
      href: `${base}?tab=courses`,
    },
    {
      id: 'assignments',
      label: 'Exams & work',
      href: `${base}?tab=assignments`,
    },
  ];
  if (hasModule(opts.modules, 'live_teaching')) {
    items.push({
      id: 'live',
      label: 'Live classes',
      href: `${base}?tab=live`,
      module: 'live_teaching',
    });
  }
  if (hasModule(opts.modules, 'digital_library')) {
    items.push({
      id: 'library',
      label: 'Library',
      href: `${base}?tab=library`,
      module: 'digital_library',
    });
  }
  if (hasModule(opts.modules, 'ai_learning')) {
    items.push({
      id: 'ai',
      label: 'AI assistant',
      href: `${base}?tab=ai`,
      module: 'ai_learning',
    });
  }
  if (hasModule(opts.modules, 'intellex_resources')) {
    items.push({
      id: 'intellex',
      label: 'InTelleX resources',
      href: `${base}?tab=intellex`,
      module: 'intellex_resources',
    });
  }
  if (hasModule(opts.modules, 'community')) {
    items.push({
      id: 'community',
      label: 'Community',
      href: `${base}?tab=community`,
      module: 'community',
    });
  }
  if (hasModule(opts.modules, 'career')) {
    items.push({
      id: 'career',
      label: 'Career',
      href: `${base}?tab=career`,
      module: 'career',
    });
  }
  if (hasModule(opts.modules, 'research') && isStaff) {
    items.push({
      id: 'research',
      label: 'Research',
      href: `${base}?tab=research`,
      module: 'research',
    });
  }
  if (hasModule(opts.modules, 'marketplace') && isStaff) {
    items.push({
      id: 'marketplace',
      label: 'Marketplace',
      href: `${base}?tab=marketplace`,
      module: 'marketplace',
    });
  }
  if (isStaff) {
    items.push({
      id: 'students',
      label: 'Students',
      href: `${base}?tab=students`,
    });
    items.push({
      id: 'instructors',
      label: 'Instructors',
      href: `${base}?tab=instructors`,
    });
    items.push({
      id: 'analytics',
      label: 'Analytics',
      href: `${base}?tab=analytics`,
    });
  }

  return items;
}

/**
 * Resolve enabled modules for a campus.
 * Explicit `enabledModules` wins (Platform Team provisioning).
 * Otherwise derive from the commercial pack.
 */
export function resolveCampusModules(inst: {
  capabilityPack?: CapabilityPack | null;
  enabledModules?: ModuleId[] | null;
}): ModuleId[] {
  if (inst.enabledModules && inst.enabledModules.length > 0) {
    return Array.from(new Set(inst.enabledModules));
  }
  const pack = inst.capabilityPack ?? 'foundation';
  if (pack === 'custom') return [];
  return modulesForPack(pack);
}

export function getModuleMeta(id: ModuleId) {
  return MODULE_CATALOG.find((m) => m.id === id);
}

export function packLabel(pack: CapabilityPack | null | undefined): string {
  if (!pack || pack === 'custom') return 'Custom capabilities';
  return CAPABILITY_PACKS[pack].name;
}
