/**
 * Configurable subscription / commercial plan catalog.
 * Student resource membership defaults to 1,999 XAF / month.
 * Prices are editable from Platform Admin — never hard-code in checkout UI long-term.
 */

import { prisma } from '@/lib/db/prisma';
import { CERT_MONTHLY_XAF, CERT_YEARLY_XAF } from '@/lib/learn/certPricing';

export const STUDENT_RESOURCE_PLAN_CODE = 'student_resource_monthly';

export type CatalogPlanView = {
  id: string;
  code: string;
  kind: string;
  name: string;
  summary: string | null;
  status: string;
  currency: string;
  priceMonthly: number;
  priceYearly: number | null;
  features: string[];
  limits: Record<string, unknown>;
};

const FALLBACK_STUDENT: CatalogPlanView = {
  id: 'fallback-student',
  code: STUDENT_RESOURCE_PLAN_CODE,
  kind: 'STUDENT_RESOURCE',
  name: 'Intellex Learning Resources',
  summary: 'Monthly access to Intellex learning resources.',
  status: 'ACTIVE',
  currency: 'XAF',
  priceMonthly: CERT_MONTHLY_XAF,
  priceYearly: CERT_YEARLY_XAF,
  features: ['resources', 'certificates_track'],
  limits: {},
};

/** Ensure default catalog rows exist (idempotent). */
export async function ensureDefaultCatalogPlans(): Promise<void> {
  await prisma.catalogPlan.upsert({
    where: { code: STUDENT_RESOURCE_PLAN_CODE },
    create: {
      code: STUDENT_RESOURCE_PLAN_CODE,
      kind: 'STUDENT_RESOURCE',
      name: 'Intellex Learning Resources',
      summary: 'Monthly access to Intellex learning resources.',
      status: 'ACTIVE',
      currency: 'XAF',
      priceMonthly: CERT_MONTHLY_XAF,
      priceYearly: CERT_YEARLY_XAF,
      features: ['resources', 'certificates_track'],
      limits: {},
      sortOrder: 10,
    },
    update: {
      // Keep admin edits; only fill name/summary if somehow blank via no-op update.
      status: 'ACTIVE',
    },
  });

  const orgDefaults: Array<{
    code: string;
    name: string;
    summary: string;
    priceMonthly: number;
    priceYearly: number | null;
    features: string[];
    sortOrder: number;
  }> = [
    {
      code: 'org_starter',
      name: 'Starter',
      summary: 'Core LMS capabilities for small academies.',
      priceMonthly: 45000,
      priceYearly: 45000 * 12,
      features: ['courses', 'students', 'instructors'],
      sortOrder: 20,
    },
    {
      code: 'org_professional',
      name: 'Professional',
      summary: 'Advanced features, analytics, and one custom domain.',
      priceMonthly: 95000,
      priceYearly: 95000 * 12,
      features: [
        'courses',
        'students',
        'instructors',
        'assignments',
        'quizzes',
        'analytics',
        'custom_domain',
      ],
      sortOrder: 30,
    },
    {
      code: 'org_enterprise',
      name: 'Enterprise',
      summary: 'Higher limits, dedicated PostgreSQL option, multiple custom domains.',
      priceMonthly: 180000,
      priceYearly: null,
      features: [
        'courses',
        'students',
        'instructors',
        'assignments',
        'quizzes',
        'certificates',
        'live_classes',
        'analytics',
        'custom_domain',
        'ai_tools',
        'dedicated_database',
      ],
      sortOrder: 40,
    },
  ];

  for (const plan of orgDefaults) {
    await prisma.catalogPlan.upsert({
      where: { code: plan.code },
      create: {
        code: plan.code,
        kind: 'ORGANIZATION',
        name: plan.name,
        summary: plan.summary,
        status: 'ACTIVE',
        currency: 'XAF',
        priceMonthly: plan.priceMonthly,
        priceYearly: plan.priceYearly,
        features: plan.features,
        limits: {},
        sortOrder: plan.sortOrder,
      },
      update: {},
    });
  }
}

function toView(row: {
  id: string;
  code: string;
  kind: string;
  name: string;
  summary: string | null;
  status: string;
  currency: string;
  priceMonthly: number;
  priceYearly: number | null;
  features: string[];
  limits: unknown;
}): CatalogPlanView {
  return {
    id: row.id,
    code: row.code,
    kind: row.kind,
    name: row.name,
    summary: row.summary,
    status: row.status,
    currency: row.currency,
    priceMonthly: row.priceMonthly,
    priceYearly: row.priceYearly,
    features: row.features,
    limits: (row.limits as Record<string, unknown>) || {},
  };
}

export async function getStudentResourcePlan(): Promise<CatalogPlanView> {
  try {
    await ensureDefaultCatalogPlans();
    const row = await prisma.catalogPlan.findUnique({
      where: { code: STUDENT_RESOURCE_PLAN_CODE },
    });
    if (!row || row.status !== 'ACTIVE') return FALLBACK_STUDENT;
    return toView(row);
  } catch {
    return FALLBACK_STUDENT;
  }
}

/** Server-side price for student resource subscription (monthly). */
export async function studentResourceMonthlyXaf(): Promise<number> {
  const plan = await getStudentResourcePlan();
  return plan.priceMonthly;
}

export async function listCatalogPlans(kind?: 'STUDENT_RESOURCE' | 'ORGANIZATION') {
  try {
    await ensureDefaultCatalogPlans();
    const rows = await prisma.catalogPlan.findMany({
      where: {
        status: 'ACTIVE',
        ...(kind ? { kind } : {}),
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return rows.map(toView);
  } catch {
    return kind === 'ORGANIZATION' ? [] : [FALLBACK_STUDENT];
  }
}

export async function updateCatalogPlanPrice(opts: {
  code: string;
  priceMonthly?: number;
  priceYearly?: number | null;
  name?: string;
  summary?: string | null;
  features?: string[];
}): Promise<CatalogPlanView> {
  const data: Record<string, unknown> = {};
  if (opts.priceMonthly !== undefined) {
    if (opts.priceMonthly < 0) throw new Error('Invalid price');
    data.priceMonthly = opts.priceMonthly;
  }
  if (opts.priceYearly !== undefined) data.priceYearly = opts.priceYearly;
  if (opts.name !== undefined) data.name = opts.name.slice(0, 120);
  if (opts.summary !== undefined) data.summary = opts.summary;
  if (opts.features !== undefined) data.features = opts.features;

  const row = await prisma.catalogPlan.update({
    where: { code: opts.code },
    data,
  });
  return toView(row);
}
