/**
 * Prefer Prisma (source of truth after onboard) for campus modules,
 * fall back to Mongo institution doc.
 */

import { prisma } from '@/lib/db/prisma';
import {
  resolveCampusModules,
  type CapabilityPack,
  type ModuleId,
} from '@/lib/eduos/capabilities';
import { COMMERCIAL_PLANS, type CommercialPlanId } from '@/lib/eduos/plans';

export type CampusTierInfo = {
  capabilityPack: CapabilityPack;
  enabledModules: ModuleId[];
  planName: string | null;
  featuresEnabled: string[];
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export async function getCampusTierInfo(
  slug: string,
  fallback?: {
    capabilityPack?: string | null;
    enabledModules?: string[] | null;
  },
): Promise<CampusTierInfo> {
  try {
    const row = await prisma.institution.findFirst({
      where: { OR: [{ slug }, { subdomain: slug }] },
      select: {
        capabilityPack: true,
        enabledModules: true,
        featuresEnabled: true,
        settings: true,
      },
    });
    if (row) {
      const settings = asRecord(row.settings);
      const planId = String(settings.onboardingPlan || '') as CommercialPlanId;
      const planName =
        planId && COMMERCIAL_PLANS[planId] ? COMMERCIAL_PLANS[planId].name : null;
      const pack = (row.capabilityPack || 'foundation') as CapabilityPack;
      const modules = resolveCampusModules({
        capabilityPack: pack,
        enabledModules: row.enabledModules as ModuleId[],
      });
      return {
        capabilityPack: pack,
        enabledModules: modules,
        planName,
        featuresEnabled: row.featuresEnabled || [],
      };
    }
  } catch {
    /* fall through */
  }

  const pack = (fallback?.capabilityPack || 'foundation') as CapabilityPack;
  const modules = resolveCampusModules({
    capabilityPack: pack,
    enabledModules: (fallback?.enabledModules || []) as ModuleId[],
  });
  return {
    capabilityPack: pack,
    enabledModules: modules,
    planName: null,
    featuresEnabled: [],
  };
}
