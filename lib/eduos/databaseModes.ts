/**
 * PostgreSQL tenancy strategies for Intellex organizations.
 *
 * Intellex is one LMS application. Each organization's data may live on:
 * - SHARED: Intellex-managed shared PostgreSQL (default)
 * - DEDICATED: Intellex-managed dedicated PostgreSQL
 * - CUSTOMER_MANAGED: enterprise BYO PostgreSQL (admin-configured only)
 *
 * End users never see connection strings. Credentials use secret references.
 */

import type { DatabaseMode, DeploymentModel } from '@prisma/client';

export type TenantDatabaseMode = 'SHARED' | 'DEDICATED' | 'CUSTOMER_MANAGED';

export const DATABASE_MODE_META: Record<
  TenantDatabaseMode,
  { label: string; summary: string; managedBy: 'intellex' | 'customer' }
> = {
  SHARED: {
    label: 'Shared PostgreSQL',
    summary: 'Row-level isolation on Intellex managed PostgreSQL. Default for most organizations.',
    managedBy: 'intellex',
  },
  DEDICATED: {
    label: 'Dedicated PostgreSQL',
    summary: 'Intellex provisions an isolated PostgreSQL database for this organization.',
    managedBy: 'intellex',
  },
  CUSTOMER_MANAGED: {
    label: 'Customer PostgreSQL',
    summary: 'Enterprise bring-your-own PostgreSQL. Configured only by Intellex administrators.',
    managedBy: 'customer',
  },
};

/** Map legacy DeploymentModel enum → DatabaseMode. */
export function databaseModeFromDeployment(
  deployment: DeploymentModel | string | null | undefined,
): TenantDatabaseMode {
  switch (deployment) {
    case 'DEDICATED_DB':
    case 'MANAGED_CLOUD':
      return 'DEDICATED';
    case 'CUSTOMER_HOSTED':
    case 'HYBRID':
    case 'EXTERNAL_SIS':
      return 'CUSTOMER_MANAGED';
    case 'SHARED_SAAS':
    default:
      return 'SHARED';
  }
}

/** Inverse: pick a DeploymentModel that matches the DB strategy. */
export function deploymentFromDatabaseMode(
  mode: TenantDatabaseMode | DatabaseMode | string,
): DeploymentModel {
  switch (mode) {
    case 'DEDICATED':
      return 'DEDICATED_DB';
    case 'CUSTOMER_MANAGED':
      return 'CUSTOMER_HOSTED';
    case 'SHARED':
    default:
      return 'SHARED_SAAS';
  }
}

export function isValidDatabaseMode(v: unknown): v is TenantDatabaseMode {
  return v === 'SHARED' || v === 'DEDICATED' || v === 'CUSTOMER_MANAGED';
}
