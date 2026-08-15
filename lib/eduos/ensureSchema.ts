/**
 * Idempotent Postgres schema ensure for Platform Admin.
 * Runs safe ALTER TABLE … IF NOT EXISTS statements so production
 * self-heals when DATABASE_URL is configured but migrations lagged.
 */

import { prisma } from '@/lib/db/prisma';

let ensured: Promise<void> | null = null;
let lastError: string | null = null;

const STATEMENTS: string[] = [
  `DO $$ BEGIN
    CREATE TYPE "DatabaseMode" AS ENUM ('SHARED', 'DEDICATED', 'CUSTOMER_MANAGED');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  `DO $$ BEGIN
    CREATE TYPE "DeploymentModel" AS ENUM (
      'SHARED_SAAS', 'MANAGED_CLOUD', 'DEDICATED_DB', 'CUSTOMER_HOSTED', 'HYBRID', 'EXTERNAL_SIS'
    );
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  `ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "deploymentModel" "DeploymentModel" NOT NULL DEFAULT 'SHARED_SAAS'`,
  `ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "onboardingState" TEXT NOT NULL DEFAULT 'invited'`,
  `ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "onboardingProgress" INTEGER NOT NULL DEFAULT 0`,
  `ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "capabilityPack" TEXT NOT NULL DEFAULT 'foundation'`,
  `ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "enabledModules" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]`,
  `ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "featuresEnabled" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]`,
  `ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "domainStatus" TEXT NOT NULL DEFAULT 'none'`,
  `ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "pendingCustomDomain" TEXT`,
  `ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "domainVerifiedAt" TIMESTAMP(3)`,
  `ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "domainNotes" TEXT`,
  `ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "provisionedAt" TIMESTAMP(3)`,
  `ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "provisionedById" TEXT`,
  `ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "verified" BOOLEAN NOT NULL DEFAULT false`,
  `ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "verifiedAt" TIMESTAMP(3)`,
  `ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "isPlatformHome" BOOLEAN NOT NULL DEFAULT false`,
  `ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "subdomain" TEXT`,
  `ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "customDomain" TEXT`,
  `ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "federationBaseUrl" TEXT`,
  `ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "apiClientId" TEXT`,
  `ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "apiKeyHash" TEXT`,
  `ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "settings" JSONB NOT NULL DEFAULT '{}'::jsonb`,
  `ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "ownerUserId" TEXT`,

  `ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "databaseMode" "DatabaseMode" NOT NULL DEFAULT 'SHARED'`,
  `ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "databaseProvider" TEXT NOT NULL DEFAULT 'postgresql'`,
  `ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "databaseHost" TEXT`,
  `ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "databasePort" INTEGER DEFAULT 5432`,
  `ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "databaseName" TEXT`,
  `ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "databaseUser" TEXT`,
  `ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "credentialRef" TEXT`,
  `ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "sslRequired" BOOLEAN NOT NULL DEFAULT true`,
  `ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "schemaVersion" TEXT NOT NULL DEFAULT '1'`,
  `ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "databaseStatus" TEXT NOT NULL DEFAULT 'connected'`,
  `ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "migrationStatus" TEXT NOT NULL DEFAULT 'up_to_date'`,
  `ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "lastMigrationAt" TIMESTAMP(3)`,

  `DO $$ BEGIN
    ALTER TABLE "OnboardingInvitation" ADD COLUMN IF NOT EXISTS "databaseMode" "DatabaseMode" NOT NULL DEFAULT 'SHARED';
  EXCEPTION WHEN undefined_table THEN NULL; END $$`,

  `DO $$ BEGIN
    ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "captionsUrl" TEXT;
  EXCEPTION WHEN undefined_table THEN NULL; END $$`,
];

export function platformSchemaEnsureError(): string | null {
  return lastError;
}

/** Run once per process. Safe to call on every Platform Admin request. */
export async function ensurePlatformSchema(): Promise<void> {
  if (!ensured) {
    ensured = (async () => {
      const failures: string[] = [];
      for (const sql of STATEMENTS) {
        try {
          await prisma.$executeRawUnsafe(sql);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          // Ignore "already exists" / duplicate; collect real failures.
          if (
            /already exists|duplicate/i.test(msg) ||
            msg.includes('42710') ||
            msg.includes('42P07')
          ) {
            continue;
          }
          failures.push(msg.slice(0, 200));
        }
      }
      if (failures.length) {
        lastError = failures[0];
        console.warn(
          '[ensurePlatformSchema] some statements failed (app will soft-fallback):',
          failures[0],
        );
      } else {
        lastError = null;
      }
    })().catch((err) => {
      lastError = err instanceof Error ? err.message : String(err);
      console.warn('[ensurePlatformSchema] failed:', lastError);
      // Allow retry on next request
      ensured = null;
    });
  }
  await ensured;
}

/** Raw Institution row with Phase-4 defaults filled in. */
export async function fetchInstitutionRaw(
  id: string,
): Promise<Record<string, unknown> | null> {
  const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
    `SELECT * FROM "Institution" WHERE id = $1 LIMIT 1`,
    id,
  );
  const row = rows[0];
  if (!row) return null;
  return {
    deploymentModel: 'SHARED_SAAS',
    onboardingState: 'invited',
    onboardingProgress: 0,
    capabilityPack: 'foundation',
    enabledModules: [],
    featuresEnabled: [],
    domainStatus: 'none',
    verified: false,
    isPlatformHome: false,
    settings: {},
    syncPolicy: {},
    federationLink: null,
    ...row,
  };
}
