-- Full Phase-4+ Institution / federation / lesson schema sync for Intellex.
-- Idempotent. Run via: npm run db:fix-schema  (needs DIRECT_URL)
-- Or paste into Supabase → SQL Editor → Run.

-- Enums
DO $$ BEGIN
  CREATE TYPE "DeploymentModel" AS ENUM (
    'SHARED_SAAS', 'MANAGED_CLOUD', 'DEDICATED_DB', 'CUSTOMER_HOSTED', 'HYBRID', 'EXTERNAL_SIS'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "DatabaseMode" AS ENUM ('SHARED', 'DEDICATED', 'CUSTOMER_MANAGED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "InstitutionLifecycleStatus" AS ENUM (
    'PENDING', 'PROVISIONING', 'ACTIVE', 'SUSPENDED', 'REJECTED', 'ARCHIVED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "InstitutionVisibility" AS ENUM ('PRIVATE', 'NETWORK', 'PUBLIC');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "CustomizationLevel" AS ENUM ('DEFAULT', 'BRANDED', 'FULL');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "EnrollmentPolicyType" AS ENUM (
    'OPEN', 'INVITE_ONLY', 'DOMAIN_RESTRICTED', 'APPROVAL_REQUIRED', 'CODE'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Institution columns used by Platform Admin / onboarding
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "deploymentModel" "DeploymentModel" NOT NULL DEFAULT 'SHARED_SAAS';
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "onboardingState" TEXT NOT NULL DEFAULT 'invited';
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "onboardingProgress" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "capabilityPack" TEXT NOT NULL DEFAULT 'foundation';
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "enabledModules" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "featuresEnabled" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "domainStatus" TEXT NOT NULL DEFAULT 'none';
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "pendingCustomDomain" TEXT;
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "domainVerifiedAt" TIMESTAMP(3);
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "domainNotes" TEXT;
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "provisionedAt" TIMESTAMP(3);
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "provisionedById" TEXT;
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "verified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "verifiedAt" TIMESTAMP(3);
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "isPlatformHome" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "federationBaseUrl" TEXT;
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "apiClientId" TEXT;
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "apiKeyHash" TEXT;
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "syncPolicy" JSONB NOT NULL DEFAULT '{"publicProfile":true,"publicCourses":true,"publicCertificates":true,"grades":false,"finance":false}'::jsonb;
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "settings" JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "customizationLevel" "CustomizationLevel" NOT NULL DEFAULT 'DEFAULT';
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "enrollmentPolicy" "EnrollmentPolicyType" NOT NULL DEFAULT 'INVITE_ONLY';
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "allowedEmailDomains" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "accreditationNote" TEXT;
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "estimatedStudents" INTEGER;
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "address" TEXT;
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "secondaryColor" TEXT;
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "subdomain" TEXT;
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "customDomain" TEXT;
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "website" TEXT;
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "email" TEXT;
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "country" TEXT;
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "city" TEXT;
ALTER TABLE "Institution" ADD COLUMN IF NOT EXISTS "ownerUserId" TEXT;

-- Unique indexes (ignore if already exist / conflict)
DO $$ BEGIN
  CREATE UNIQUE INDEX IF NOT EXISTS "Institution_subdomain_key" ON "Institution"("subdomain");
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
DO $$ BEGIN
  CREATE UNIQUE INDEX IF NOT EXISTS "Institution_customDomain_key" ON "Institution"("customDomain");
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
DO $$ BEGIN
  CREATE UNIQUE INDEX IF NOT EXISTS "Institution_apiClientId_key" ON "Institution"("apiClientId");
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS "Institution_capabilityPack_idx" ON "Institution"("capabilityPack");
CREATE INDEX IF NOT EXISTS "Institution_isPlatformHome_idx" ON "Institution"("isPlatformHome");
CREATE INDEX IF NOT EXISTS "Institution_verified_idx" ON "Institution"("verified");
CREATE INDEX IF NOT EXISTS "Institution_ownerUserId_idx" ON "Institution"("ownerUserId");

-- Federation link tenancy columns
ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "databaseMode" "DatabaseMode" NOT NULL DEFAULT 'SHARED';
ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "databaseProvider" TEXT NOT NULL DEFAULT 'postgresql';
ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "databaseHost" TEXT;
ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "databasePort" INTEGER DEFAULT 5432;
ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "databaseName" TEXT;
ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "databaseUser" TEXT;
ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "credentialRef" TEXT;
ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "sslRequired" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "schemaVersion" TEXT NOT NULL DEFAULT '1';
ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "databaseStatus" TEXT NOT NULL DEFAULT 'connected';
ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "migrationStatus" TEXT NOT NULL DEFAULT 'up_to_date';
ALTER TABLE "InstitutionFederationLink" ADD COLUMN IF NOT EXISTS "lastMigrationAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "InstitutionFederationLink_databaseMode_idx" ON "InstitutionFederationLink"("databaseMode");
CREATE INDEX IF NOT EXISTS "InstitutionFederationLink_databaseStatus_idx" ON "InstitutionFederationLink"("databaseStatus");
CREATE INDEX IF NOT EXISTS "InstitutionFederationLink_schemaVersion_idx" ON "InstitutionFederationLink"("schemaVersion");

-- Backfill federation databaseMode from deployment
UPDATE "InstitutionFederationLink" AS f
SET "databaseMode" = CASE i."deploymentModel"
  WHEN 'DEDICATED_DB' THEN 'DEDICATED'::"DatabaseMode"
  WHEN 'CUSTOMER_HOSTED' THEN 'CUSTOMER_MANAGED'::"DatabaseMode"
  ELSE 'SHARED'::"DatabaseMode"
END
FROM "Institution" AS i
WHERE i.id = f."institutionId"
  AND f."databaseMode" = 'SHARED'
  AND i."deploymentModel" IN ('DEDICATED_DB', 'CUSTOMER_HOSTED', 'MANAGED_CLOUD');

-- Onboarding invitations
DO $$ BEGIN
  ALTER TABLE "OnboardingInvitation" ADD COLUMN IF NOT EXISTS "databaseMode" "DatabaseMode" NOT NULL DEFAULT 'SHARED';
  ALTER TABLE "OnboardingInvitation" ADD COLUMN IF NOT EXISTS "onboardingState" TEXT NOT NULL DEFAULT 'invited';
  ALTER TABLE "OnboardingInvitation" ADD COLUMN IF NOT EXISTS "wizardStep" INTEGER NOT NULL DEFAULT 0;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- Lesson captions (experience slice 4)
DO $$ BEGIN
  ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "captionsUrl" TEXT;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
