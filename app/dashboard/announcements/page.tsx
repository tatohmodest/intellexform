import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getStudentMembership } from '@/lib/learn/studentAccess';
import { getOrgConfig } from '@/lib/org/config';
import { listVisibleAnnouncements } from '@/lib/staff/store';
import AnnouncementCard from '@/components/dashboard/AnnouncementCard';
import PageHeader from '@/components/dashboard/PageHeader';

export const dynamic = 'force-dynamic';

export default async function DashboardAnnouncementsPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/announcements');

  const [membership, org] = await Promise.all([
    getStudentMembership(session.uid),
    getOrgConfig(),
  ]);
  const isStudent = membership.isStudent;
  const visible = await listVisibleAnnouncements({ isStudent }).catch(() => []);

  const publicItems = visible.filter((a) => a.audience === 'everyone');
  const institutionItems = visible.filter((a) => a.audience === 'students');

  return (
    <div className="mx-auto max-w-[800px]">
      <PageHeader art="/join_cta.webp" tone="sky" title="Announcements" />

      <section className="mb-10">
        <h2 className="mb-3 font-display text-[19px]">Public</h2>
        {publicItems.length === 0 ? (
          <p className="card muted p-5 text-[14px]">
            No public announcements yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {publicItems.map((item) => (
              <li key={item.id}>
                <AnnouncementCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-[19px]">Institution</h2>
        {!isStudent ? (
          <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
            <p className="muted text-[14px]">For registered students only.</p>
            <Link href="/dashboard/apply" className="chip chip-primary">
              Become a student
            </Link>
          </div>
        ) : institutionItems.length === 0 ? (
          <p className="card muted p-5 text-[14px]">
            No institution announcements yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {institutionItems.map((item) => (
              <li key={item.id}>
                <AnnouncementCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
