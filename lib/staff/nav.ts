import type { StaffPermission } from '@/lib/staff/permissions';

export const STAFF_NAV: {
  href: string;
  label: string;
  permission: StaffPermission;
  exact?: boolean;
}[] = [
  { href: '/dashboard/staff', label: 'Staff home', permission: 'staff.access', exact: true },
  { href: '/dashboard/staff/students', label: 'Students', permission: 'students.read' },
  { href: '/dashboard/staff/admissions', label: 'Admissions', permission: 'admissions.read' },
  { href: '/dashboard/staff/fees', label: 'School fees', permission: 'fees.read' },
  { href: '/dashboard/staff/announcements', label: 'Announcements', permission: 'staff.access' },
  { href: '/dashboard/staff/reports', label: 'Reports', permission: 'reports.read' },
  { href: '/dashboard/staff/director', label: 'Director', permission: 'director.view' },
];

export function staffNavFor(permissions: StaffPermission[]) {
  return STAFF_NAV.filter((item) => permissions.includes(item.permission));
}
