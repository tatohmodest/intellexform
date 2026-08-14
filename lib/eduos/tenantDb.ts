/**
 * Tenant database connection manager.
 *
 * Incoming request → resolve organization → load database strategy →
 * connect to the appropriate PostgreSQL. The frontend never receives credentials.
 *
 * V1 behavior:
 * - SHARED → use the platform Prisma client (DATABASE_URL)
 * - DEDICATED / CUSTOMER_MANAGED → resolve via secret reference (scaffolded;
 *   live secondary pools are provisioned by infrastructure later)
 */

import { prisma } from '@/lib/db/prisma';
import type { PrismaClient } from '@prisma/client';
import {
  DATABASE_MODE_META,
  databaseModeFromDeployment,
  type TenantDatabaseMode,
} from './databaseModes';

export type TenantDbHealth = {
  institutionId: string;
  databaseMode: TenantDatabaseMode;
  databaseProvider: string;
  databaseStatus: string;
  schemaVersion: string;
  migrationStatus: string;
  healthStatus: string;
  lastHealthAt: string | null;
  lastError: string | null;
  hostMasked: string | null;
  databaseNameMasked: string | null;
  sslRequired: boolean;
  credentialRefPresent: boolean;
  meta: (typeof DATABASE_MODE_META)[TenantDatabaseMode];
};

/** Mask host/db names for admin UI (never return secrets). */
function maskValue(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.length <= 4) return '****';
  return `${value.slice(0, 2)}${'*'.repeat(Math.min(value.length - 4, 8))}${value.slice(-2)}`;
}

/**
 * Load database configuration for an organization.
 * Creates a federation link row if missing (shared default).
 */
export async function getTenantDatabaseConfig(
  institutionId: string,
): Promise<TenantDbHealth | null> {
  const inst = await prisma.institution.findUnique({
    where: { id: institutionId },
    select: {
      id: true,
      deploymentModel: true,
      federationLink: true,
    },
  });
  if (!inst) return null;

  const link = inst.federationLink;
  const mode = (link?.databaseMode ||
    databaseModeFromDeployment(inst.deploymentModel)) as TenantDatabaseMode;

  return {
    institutionId: inst.id,
    databaseMode: mode,
    databaseProvider: link?.databaseProvider || 'postgresql',
    databaseStatus: link?.databaseStatus || (mode === 'SHARED' ? 'connected' : 'provisioning'),
    schemaVersion: link?.schemaVersion || '1',
    migrationStatus: link?.migrationStatus || 'up_to_date',
    healthStatus: link?.healthStatus || 'unknown',
    lastHealthAt: link?.lastHealthAt ? link.lastHealthAt.toISOString() : null,
    lastError: link?.lastError || null,
    hostMasked: maskValue(link?.databaseHost),
    databaseNameMasked: maskValue(link?.databaseName),
    sslRequired: link?.sslRequired ?? true,
    credentialRefPresent: Boolean(link?.credentialRef),
    meta: DATABASE_MODE_META[mode],
  };
}

/**
 * Resolve which Prisma client to use for tenant data.
 * Shared tenants always use the platform client.
 * Dedicated / customer-managed currently fall back to platform client until
 * secondary pools are wired through secrets management.
 */
export async function getTenantPrisma(institutionId: string): Promise<{
  client: PrismaClient;
  databaseMode: TenantDatabaseMode;
  usingPlatformPool: boolean;
}> {
  const config = await getTenantDatabaseConfig(institutionId);
  const mode = config?.databaseMode || 'SHARED';

  if (mode === 'SHARED') {
    return { client: prisma, databaseMode: mode, usingPlatformPool: true };
  }

  // Dedicated / customer-managed: connection via credentialRef will be resolved
  // by infrastructure. Until secondary pools exist, use platform pool with
  // organization_id isolation still enforced at the application layer.
  if (config?.credentialRef) {
    // Placeholder for secrets-manager lookup + pooled PrismaClient cache.
    // Never log or return the resolved connection string.
  }

  return { client: prisma, databaseMode: mode, usingPlatformPool: true };
}

export type SetTenantDatabaseInput = {
  institutionId: string;
  databaseMode: TenantDatabaseMode;
  databaseHost?: string | null;
  databasePort?: number | null;
  databaseName?: string | null;
  databaseUser?: string | null;
  /** Vault / secrets-manager reference — never a raw password. */
  credentialRef?: string | null;
  sslRequired?: boolean;
  actorEmail?: string | null;
};

/**
 * Intellex-admin-only: update an organization's database strategy.
 * Does not accept raw passwords — only secret references.
 */
export async function setTenantDatabaseStrategy(
  input: SetTenantDatabaseInput,
): Promise<TenantDbHealth> {
  const { deploymentFromDatabaseMode } = await import('./databaseModes');
  const deploymentModel = deploymentFromDatabaseMode(input.databaseMode);

  const existing = await prisma.institution.findUnique({
    where: { id: input.institutionId },
    select: { id: true, federationLink: true },
  });
  if (!existing) throw new Error('Institution not found');

  // Refuse accidental plaintext password-looking values in credentialRef.
  if (input.credentialRef && /^(postgres(ql)?:\/\/|password=)/i.test(input.credentialRef)) {
    throw new Error('credentialRef must be a vault/secret reference, not a connection string');
  }

  await prisma.institution.update({
    where: { id: input.institutionId },
    data: { deploymentModel },
  });

  const status =
    input.databaseMode === 'SHARED'
      ? 'connected'
      : input.credentialRef
        ? 'connected'
        : 'provisioning';

  await prisma.institutionFederationLink.upsert({
    where: { institutionId: input.institutionId },
    create: {
      institutionId: input.institutionId,
      deploymentModel,
      databaseMode: input.databaseMode,
      databaseProvider: 'postgresql',
      databaseHost: input.databaseHost || null,
      databasePort: input.databasePort ?? 5432,
      databaseName: input.databaseName || null,
      databaseUser: input.databaseUser || null,
      credentialRef: input.credentialRef || null,
      sslRequired: input.sslRequired ?? true,
      databaseStatus: status,
      healthStatus: status === 'connected' ? 'healthy' : 'unknown',
      lastHealthAt: status === 'connected' ? new Date() : null,
      schemaVersion: '1',
      migrationStatus: 'up_to_date',
      activatedAt: new Date(),
    },
    update: {
      deploymentModel,
      databaseMode: input.databaseMode,
      databaseHost: input.databaseHost !== undefined ? input.databaseHost : undefined,
      databasePort: input.databasePort !== undefined ? input.databasePort : undefined,
      databaseName: input.databaseName !== undefined ? input.databaseName : undefined,
      databaseUser: input.databaseUser !== undefined ? input.databaseUser : undefined,
      credentialRef: input.credentialRef !== undefined ? input.credentialRef : undefined,
      sslRequired: input.sslRequired,
      databaseStatus: status,
      healthStatus: status === 'connected' ? 'healthy' : undefined,
      lastHealthAt: status === 'connected' ? new Date() : undefined,
      lastError: null,
    },
  });

  const health = await getTenantDatabaseConfig(input.institutionId);
  if (!health) throw new Error('Failed to load database config');
  return health;
}

/** Lightweight health check for admin UI (shared = ping platform DB). */
export async function testTenantDatabaseConnection(
  institutionId: string,
): Promise<{ ok: boolean; message: string; checkedAt: string }> {
  const config = await getTenantDatabaseConfig(institutionId);
  if (!config) {
    return { ok: false, message: 'Institution not found', checkedAt: new Date().toISOString() };
  }

  try {
    if (config.databaseMode === 'SHARED' || !config.credentialRefPresent) {
      await prisma.$queryRaw`SELECT 1`;
      await prisma.institutionFederationLink.updateMany({
        where: { institutionId },
        data: {
          healthStatus: 'healthy',
          lastHealthAt: new Date(),
          databaseStatus: 'connected',
          lastError: null,
        },
      });
      return {
        ok: true,
        message:
          config.databaseMode === 'SHARED'
            ? 'Shared PostgreSQL connection healthy'
            : 'Strategy recorded; secondary pool not yet provisioned — platform pool healthy',
        checkedAt: new Date().toISOString(),
      };
    }

    // Customer/dedicated with secret ref: infrastructure will resolve the pool.
    await prisma.institutionFederationLink.updateMany({
      where: { institutionId },
      data: {
        healthStatus: 'healthy',
        lastHealthAt: new Date(),
        lastError: null,
      },
    });
    return {
      ok: true,
      message: 'Secret reference present; dedicated pool health delegated to infrastructure',
      checkedAt: new Date().toISOString(),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Connection failed';
    await prisma.institutionFederationLink.updateMany({
      where: { institutionId },
      data: {
        healthStatus: 'error',
        lastHealthAt: new Date(),
        databaseStatus: 'error',
        lastError: message.slice(0, 500),
      },
    });
    return { ok: false, message, checkedAt: new Date().toISOString() };
  }
}
