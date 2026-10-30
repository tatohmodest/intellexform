import TeamDesk from '@/components/staff/TeamDesk';
import { requireStaffPage } from '@/lib/staff/guard';

export const dynamic = 'force-dynamic';

export default async function StaffTeamPage() {
  const actor = await requireStaffPage('staff.manage');

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-[26px] leading-[1.1] tracking-tight sm:text-[32px]">Appoint staff</h1>
      </header>
      <TeamDesk actorPermissions={actor.permissions} actorCampusSlugs={actor.post.campusSlugs} />
    </div>
  );
}
