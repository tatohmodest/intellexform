import DatasetDesk from '@/components/staff/DatasetDesk';
import { requireStaffPage } from '@/lib/staff/guard';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function DatasetPage({ params }: { params: { id: string } }) {
  const actor = await requireStaffPage('data.read');
  const h = headers();
  const origin =
    process.env.APP_PUBLIC_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    `${h.get('x-forwarded-proto') || 'https'}://${h.get('x-forwarded-host') || h.get('host') || ''}`;
  return (
    <DatasetDesk
      datasetId={params.id}
      canWrite={actor.permissions.includes('data.write') || actor.permissions.includes('data.manage')}
      origin={origin}
    />
  );
}
