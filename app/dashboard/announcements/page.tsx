import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Megaphone } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getStudentMembership } from '@/lib/learn/studentAccess';
import { getOrgConfig } from '@/lib/org/config';
import { listVisibleAnnouncements } from '@/lib/staff/store';
import AnnouncementCard from '@/components/dashboard/AnnouncementCard';

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
      <header className="mb-8 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <Megaphone size={11} /> Announcements
        </div>
        <h1 className="font-display text-[36px] leading-[0.95] tracking-tight sm:text-[44px]">
          Announcements
        </h1>
        <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          Public notices for everyone signed in, and institution notices for official {org.name}{' '}
          students.
        </p>
      </header>

      <section className="mb-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--blue-ink)' }}>
              Open to all
            </p>
            <h2 className="font-display text-[22px]">Public announcements</h2>
          </div>
        </div>
        {publicItems.length === 0 ? (
          <p
            className="border border-dashed p-6 text-[14px]"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
          >
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
        <div className="mb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--green-deep)' }}>
            Official students
          </p>
          <h2 className="font-display text-[22px]">Institution announcements</h2>
          <p className="mt-1 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
            Visible only to registered students. Staff choose public or institution when they publish.
          </p>
        </div>
        {!isStudent ? (
          <div
            className="border p-6"
            style={{ borderColor: 'rgba(0,179,105,0.28)', background: 'rgba(0,179,105,0.05)' }}
          >
            <p className="font-display text-[20px]">For official students</p>
            <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              Institution announcements unlock when you are registered as a student.
            </p>
            <Link
              href="/dashboard/apply"
              className="mt-4 inline-flex px-4 py-2.5 text-[13px] font-semibold text-white"
              style={{ background: 'var(--green)' }}
            >
              Become a student
            </Link>
          </div>
        ) : institutionItems.length === 0 ? (
          <p
            className="border border-dashed p-6 text-[14px]"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
          >
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
