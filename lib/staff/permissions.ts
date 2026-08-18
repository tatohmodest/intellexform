/**
 * Institutional permissions, optional role presets, and scope.
 *
 * Desks are presets — not created automatically for every organization.
 * Access comes from permissions + campus scope. Users cannot self-assign.
 */

export const HOME_ORGANIZATION = {
  slug: 'intellex',
  name: 'InTelleX',
} as const;

export const STAFF_DESKS = [
  'director',
  'secretary',
  'finance',
  'academic',
  'admissions',
  'student_services',
  'hr',
] as const;

export type StaffDesk = (typeof STAFF_DESKS)[number];

export const STAFF_PERMISSIONS = [
  'staff.access',
  'staff.manage',
  'campuses.manage',
  'students.read',
  'students.write',
  'students.status',
  'admissions.read',
  'admissions.decide',
  'fees.read',
  'fees.write',
  'fees.record_payment',
  'announcements.write',
  'reports.read',
  'director.view',
  'hr.read',
] as const;

export type StaffPermission = (typeof STAFF_PERMISSIONS)[number];

export const DESK_LABELS: Record<StaffDesk, string> = {
  director: 'Director',
  secretary: 'Secretary',
  finance: 'Finance officer',
  academic: 'Academic',
  admissions: 'Admissions officer',
  student_services: 'Student services',
  hr: 'HR officer',
};

export const DESK_BLURBS: Record<StaffDesk, string> = {
  director: 'Institution health, campuses, and appointing staff.',
  secretary: 'Students, requests, announcements, and daily operations.',
  finance: 'Fee structures, payments, receipts, and outstanding balances.',
  academic: 'Programs, student records, and academic reports.',
  admissions: 'Applications, document checks, and admission decisions.',
  student_services: 'Student support, requests, and campus communication.',
  hr: 'Staff directory. Only appears if the Director assigns it.',
};

export const PERMISSION_LABELS: Record<StaffPermission, string> = {
  'staff.access': 'Open the staff workspace',
  'staff.manage': 'Appoint and revoke staff',
  'campuses.manage': 'Create and edit campuses',
  'students.read': 'View students',
  'students.write': 'Edit student records',
  'students.status': 'Change student status',
  'admissions.read': 'View applications',
  'admissions.decide': 'Admit or reject applicants',
  'fees.read': 'View fees and balances',
  'fees.write': 'Create fee structures and charges',
  'fees.record_payment': 'Record school-fee payments',
  'announcements.write': 'Publish announcements',
  'reports.read': 'View operational reports',
  'director.view': 'View the director dashboard',
  'hr.read': 'View HR / staff directory',
};

/** Optional presets. Organizations only get a module when someone is granted it. */
export const DESK_PERMISSIONS: Record<StaffDesk, StaffPermission[]> = {
  director: [
    'staff.access',
    'staff.manage',
    'campuses.manage',
    'students.read',
    'admissions.read',
    'fees.read',
    'reports.read',
    'director.view',
    'announcements.write',
    'hr.read',
  ],
  secretary: [
    'staff.access',
    'students.read',
    'students.write',
    'admissions.read',
    'announcements.write',
    'reports.read',
  ],
  finance: [
    'staff.access',
    'students.read',
    'fees.read',
    'fees.write',
    'fees.record_payment',
    'reports.read',
  ],
  academic: [
    'staff.access',
    'students.read',
    'students.write',
    'students.status',
    'reports.read',
  ],
  admissions: [
    'staff.access',
    'students.read',
    'students.write',
    'students.status',
    'admissions.read',
    'admissions.decide',
  ],
  student_services: [
    'staff.access',
    'students.read',
    'announcements.write',
    'reports.read',
  ],
  hr: ['staff.access', 'students.read', 'hr.read', 'reports.read'],
};

export function permissionsForDesks(desks: StaffDesk[]): StaffPermission[] {
  const set = new Set<StaffPermission>();
  for (const desk of desks) {
    for (const p of DESK_PERMISSIONS[desk] || []) set.add(p);
  }
  return Array.from(set);
}

export function isStaffDesk(value: string): value is StaffDesk {
  return (STAFF_DESKS as readonly string[]).includes(value);
}

export function isStaffPermission(value: string): value is StaffPermission {
  return (STAFF_PERMISSIONS as readonly string[]).includes(value);
}

export function formatXAF(n: number): string {
  return `${Math.round(Number(n) || 0).toLocaleString('en-US')} XAF`;
}

export const STUDENT_STATUSES = [
  'applicant',
  'pending_verification',
  'admitted',
  'active',
  'suspended',
  'deferred',
  'graduated',
  'withdrawn',
  'alumni',
] as const;

export type StudentStatus = (typeof STUDENT_STATUSES)[number];

export function slugifyCampus(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return slug || 'campus';
}
