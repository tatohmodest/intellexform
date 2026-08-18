import { Users } from 'lucide-react';
import TeamDesk from '@/components/staff/TeamDesk';
import { requireStaffPage } from '@/lib/staff/guard';

export const dynamic = 'force-dynamic';

export default async function StaffTeamPage() {
  const actor = await requireStaffPage('staff.manage');

  return (
    <div>
      <header className="mb-6">
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <Users size={11} /> Staff
        </div>
        <h1 className="font-display text-[28px] leading-tight sm:text-[32px]">Appoint staff</h1>
        <p className="mt-2 max-w-[640px] text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          The institution decides who is staff and what they can do. Teachers, fees, HR, and
          admissions are not created automatically — they appear only when you grant them.
        </p>
      </header>
      <TeamDesk actorPermissions={actor.permissions} actorCampusSlugs={actor.post.campusSlugs} />
    </div>
  );
}
