import { redirect } from 'next/navigation';
import type { StaffPermission } from '@/lib/staff/permissions';
import { StaffAuthError, requireStaff, type StaffActor } from '@/lib/staff/store';

/** For App Router pages. APIs should use requireStaff + staffFail instead. */
export async function requireStaffPage(permission: StaffPermission): Promise<StaffActor> {
  try {
    return await requireStaff(permission);
  } catch (err) {
    if (err instanceof StaffAuthError) {
      if (err.status === 401) redirect('/login?next=/dashboard/staff');
      redirect('/dashboard/staff');
    }
    throw err;
  }
}
