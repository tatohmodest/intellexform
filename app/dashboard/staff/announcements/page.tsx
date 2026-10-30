import AnnouncementsDesk from '@/components/staff/AnnouncementsDesk';
import { requireStaffPage } from '@/lib/staff/guard';
import { listAnnouncements, listCampuses } from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

export default async function StaffAnnouncementsPage() {
  const actor = await requireStaffPage('staff.access');
  const [items, campuses] = await Promise.all([listAnnouncements(), listCampuses()]);

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-[26px] leading-[1.1] tracking-tight sm:text-[32px]">Announcements</h1>
      </header>
      <AnnouncementsDesk
        items={items}
        canWrite={actor.permissions.includes('announcements.write')}
        campuses={campuses}
      />
    </div>
  );
}
