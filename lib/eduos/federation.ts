/**
 * Federated education architecture.
 *
 * InTelleX is not a centralized database for all schools.
 * It is a federated education network — AWS for Education.
 *
 * Layer 1 — Core: registry, identity, trust, discovery, verification, AI routing.
 * Layer 2 — Institution: academic records stay with the owning campus.
 */

export const FEDERATION_LAYERS = {
  core: {
    owns: [
      'institution_registry',
      'institution_status_verification',
      'public_institution_profiles',
      'global_user_identity',
      'authentication',
      'platform_subscriptions',
      'platform_permissions',
      'api_credentials',
      'global_announcements',
      'platform_analytics',
      'public_certificates_index',
      'global_search_index',
      'ai_routing',
      'marketplace',
      'applications_queue',
      'audit_coordination',
    ],
    neverOwns: [
      'grades',
      'exam_papers',
      'attendance',
      'employee_salaries',
      'private_research',
      'internal_financial_records',
      'sensitive_student_records',
    ],
  },
  institution: {
    owns: [
      'teachers',
      'students',
      'departments',
      'courses',
      'grades',
      'attendance',
      'financial_records',
      'research',
      'internal_announcements',
      'employee_data',
      'examination_records',
    ],
  },
} as const;

export type DeploymentChoice =
  | 'SHARED_SAAS'
  | 'MANAGED_CLOUD'
  | 'DEDICATED_DB'
  | 'CUSTOMER_HOSTED'
  | 'HYBRID'
  | 'EXTERNAL_SIS';

export const DEPLOYMENT_CHOICES: Record<
  DeploymentChoice,
  { label: string; summary: string }
> = {
  SHARED_SAAS: {
    label: 'Shared SaaS',
    summary: 'Row-level isolation on InTelleX managed Postgres (starter campuses).',
  },
  MANAGED_CLOUD: {
    label: 'Managed Cloud',
    summary: 'InTelleX provisions a dedicated database and storage for the institution.',
  },
  DEDICATED_DB: {
    label: 'Dedicated Database',
    summary: 'Isolated database instance operated by InTelleX.',
  },
  CUSTOMER_HOSTED: {
    label: 'Customer-Hosted',
    summary: 'Institution provides infrastructure; InTelleX connects via secure APIs.',
  },
  HYBRID: {
    label: 'Hybrid',
    summary: 'Mix of institution-owned and InTelleX-managed services.',
  },
  EXTERNAL_SIS: {
    label: 'External SIS',
    summary: 'Connect an existing student information system through the API gateway.',
  },
};

/** Institutions never talk DB-to-DB — only through the gateway. */
export function federationPath(fromInstitutionId: string, toInstitutionId: string) {
  return {
    from: fromInstitutionId,
    via: 'intellex_api_gateway',
    to: toInstitutionId,
    guarantees: [
      'authenticated',
      'authorized',
      'encrypted',
      'logged',
      'audited',
      'rate_limited',
      'permission_checked',
    ] as const,
  };
}
