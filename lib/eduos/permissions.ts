/**
 * Granular capability catalog.
 * Roles are collections of these permissions - never monolithic module access.
 */

export const PERMISSIONS = [
  'create_courses',
  'edit_courses',
  'delete_courses',
  'publish_courses',
  'grade_assignments',
  'view_analytics',
  'manage_students',
  'issue_certificates',
  'create_communities',
  'manage_payments',
  'invite_staff',
  'manage_departments',
  'approve_instructors',
  'approve_mentors',
  'manage_enrollment',
  'transfer_ownership',
  'view_audit_logs',
  // Platform-only
  'approve_institutions',
  'suspend_institutions',
  'verify_institutions',
  'manage_platform_admins',
  'manage_subscription_plans',
  'manage_ai_services',
  'manage_platform_settings',
  'view_system_analytics',
  'review_audit_logs_global',
  'provision_institutions',
  'issue_api_credentials',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const ALL_INSTITUTION: Permission[] = [
  'create_courses',
  'edit_courses',
  'delete_courses',
  'publish_courses',
  'grade_assignments',
  'view_analytics',
  'manage_students',
  'issue_certificates',
  'create_communities',
  'manage_payments',
  'invite_staff',
  'manage_departments',
  'approve_instructors',
  'approve_mentors',
  'manage_enrollment',
  'transfer_ownership',
  'view_audit_logs',
];

const PLATFORM_OWNER: Permission[] = [
  ...ALL_INSTITUTION,
  'approve_institutions',
  'suspend_institutions',
  'verify_institutions',
  'manage_platform_admins',
  'manage_subscription_plans',
  'manage_ai_services',
  'manage_platform_settings',
  'view_system_analytics',
  'review_audit_logs_global',
  'provision_institutions',
  'issue_api_credentials',
];

const PLATFORM_ADMIN: Permission[] = [
  'approve_institutions',
  'verify_institutions',
  'approve_mentors',
  'view_system_analytics',
  'review_audit_logs_global',
  // Sensitive: provision / suspend / create admins require PLATFORM_OWNER
];

/** Role → capabilities. Missing = denied. */
export const ROLE_PERMISSIONS: Record<string, readonly Permission[]> = {
  PLATFORM_OWNER,
  PLATFORM_ADMIN,
  SUPPORT: ['review_audit_logs_global'],
  INSTITUTION_OWNER: ALL_INSTITUTION,
  ORG_ADMIN: ALL_INSTITUTION.filter((p) => p !== 'transfer_ownership'),
  DEPARTMENT_ADMIN: [
    'create_courses',
    'edit_courses',
    'publish_courses',
    'grade_assignments',
    'view_analytics',
    'manage_students',
    'invite_staff',
  ],
  INSTRUCTOR: [
    'create_courses',
    'edit_courses',
    'publish_courses',
    'grade_assignments',
    'issue_certificates',
  ],
  MENTOR: ['grade_assignments'],
  TEACHING_ASSISTANT: ['grade_assignments'],
  STUDENT: [],
  GUEST: [],
  STAFF: ['manage_students'],
  USER: [],
};

export function hasPermission(role: string, permission: Permission): boolean {
  const caps = ROLE_PERMISSIONS[role] ?? [];
  return caps.includes(permission);
}

export function permissionsFor(role: string): Permission[] {
  return [...(ROLE_PERMISSIONS[role] ?? [])];
}

/** AI must inherit the caller's permissions - never escalate. */
export function aiMay(role: string, permission: Permission): boolean {
  return hasPermission(role, permission);
}
