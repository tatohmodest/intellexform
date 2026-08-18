import DataHomeClient from '@/components/staff/DataHomeClient';
import { requireStaffPage } from '@/lib/staff/guard';

export const dynamic = 'force-dynamic';

export default async function DataWorkspacePage() {
  const actor = await requireStaffPage('data.read');
  return <DataHomeClient canWrite={actor.permissions.includes('data.write') || actor.permissions.includes('data.manage')} />;
}
