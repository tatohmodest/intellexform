import { Megaphone } from 'lucide-react';
import AnnouncementsDesk from '@/components/staff/AnnouncementsDesk';
import { requireStaffPage } from '@/lib/staff/guard';
import { listAnnouncements } from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

export default async function StaffAnnouncementsPage() {
  const actor = await requireStaffPage('staff.access');
  const items = await listAnnouncements();

  return (
    <div>
      <header className="mb-6">
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <Megaphone size={11} /> Announcements
        </div>
        <h1 className="font-display text-[28px] leading-tight sm:text-[32px]">Announcements</h1>
        <p className="mt-2 max-w-[620px] text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Institutional notices for students and staff. Publishing is limited to authorized desks.
        </p>
      </header>
      <AnnouncementsDesk items={items} canWrite={actor.permissions.includes('announcements.write')} />
    </div>
  );
}
