-- Idempotent fix: InstitutionFederationLink tenancy columns used by Intellex Phase 4+.
-- Apply against the platform Postgres (Supabase): 
--   psql "$DIRECT_URL" -f prisma/sql/20260814_federation_database_mode.sql
-- Or: npx prisma db execute --file prisma/sql/20260814_federation_database_mode.sql --schema prisma/schema.prisma
-- Prefer DIRECT_URL (non-pooler) for DDL.

DO $$ BEGIN
  CREATE TYPE "DatabaseMode" AS ENUM ('SHARED', 'DEDICATED', 'CUSTOMER_MANAGED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "InstitutionFederationLink"
  ADD COLUMN IF NOT EXISTS "databaseMode" "DatabaseMode" NOT NULL DEFAULT 'SHARED';

ALTER TABLE "InstitutionFederationLink"
  ADD COLUMN IF NOT EXISTS "databaseProvider" TEXT NOT NULL DEFAULT 'postgresql';

ALTER TABLE "InstitutionFederationLink"
  ADD COLUMN IF NOT EXISTS "databaseHost" TEXT;

ALTER TABLE "InstitutionFederationLink"
  ADD COLUMN IF NOT EXISTS "databasePort" INTEGER DEFAULT 5432;

ALTER TABLE "InstitutionFederationLink"
  ADD COLUMN IF NOT EXISTS "databaseName" TEXT;

ALTER TABLE "InstitutionFederationLink"
  ADD COLUMN IF NOT EXISTS "databaseUser" TEXT;

ALTER TABLE "InstitutionFederationLink"
  ADD COLUMN IF NOT EXISTS "credentialRef" TEXT;

ALTER TABLE "InstitutionFederationLink"
  ADD COLUMN IF NOT EXISTS "sslRequired" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "InstitutionFederationLink"
  ADD COLUMN IF NOT EXISTS "schemaVersion" TEXT NOT NULL DEFAULT '1';

ALTER TABLE "InstitutionFederationLink"
  ADD COLUMN IF NOT EXISTS "databaseStatus" TEXT NOT NULL DEFAULT 'connected';

ALTER TABLE "InstitutionFederationLink"
  ADD COLUMN IF NOT EXISTS "migrationStatus" TEXT NOT NULL DEFAULT 'up_to_date';

ALTER TABLE "InstitutionFederationLink"
  ADD COLUMN IF NOT EXISTS "lastMigrationAt" TIMESTAMP(3);

-- Backfill databaseMode from Institution.deploymentModel when still default SHARED
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

CREATE INDEX IF NOT EXISTS "InstitutionFederationLink_databaseMode_idx"
  ON "InstitutionFederationLink"("databaseMode");

CREATE INDEX IF NOT EXISTS "InstitutionFederationLink_databaseStatus_idx"
  ON "InstitutionFederationLink"("databaseStatus");

CREATE INDEX IF NOT EXISTS "InstitutionFederationLink_schemaVersion_idx"
  ON "InstitutionFederationLink"("schemaVersion");

-- OnboardingInvitation.databaseMode (also added in Phase 4)
DO $$ BEGIN
  ALTER TABLE "OnboardingInvitation"
    ADD COLUMN IF NOT EXISTS "databaseMode" "DatabaseMode" NOT NULL DEFAULT 'SHARED';
EXCEPTION
  WHEN undefined_table THEN NULL;
END $$;

-- Optional: Lesson.captionsUrl from experience slice 4
DO $$ BEGIN
  ALTER TABLE "Lesson"
    ADD COLUMN IF NOT EXISTS "captionsUrl" TEXT;
EXCEPTION
  WHEN undefined_table THEN NULL;
END $$;
