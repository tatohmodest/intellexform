import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FileText, Megaphone, MessageSquare, Sparkles, Users } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { isOfficialStudent } from '@/lib/learn/studentAccess';
import { getOrgConfig } from '@/lib/org/config';
import { listVisibleAnnouncements } from '@/lib/staff/store';
import AnnouncementCard from '@/components/dashboard/AnnouncementCard';

export const dynamic = 'force-dynamic';

export default async function CommunityPage({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/community');

  const [isStudent, org] = await Promise.all([
    isOfficialStudent(session.uid),
    getOrgConfig(),
  ]);
  const visible = await listVisibleAnnouncements({ isStudent }).catch(() => []);

  const tabs = isStudent
    ? ['for-you', 'public', 'institution', 'campus', 'class']
    : ['for-you', 'public'];
  const tab = tabs.includes(String(searchParams?.tab || ''))
    ? String(searchParams?.tab)
    : 'for-you';

  const official = visible.filter((a) => a.audience !== 'staff');
  const publicPosts = official.filter((a) => a.audience === 'everyone');
  const institutionPosts = official.filter((a) => a.audience === 'students');
  const showOfficial =
    isStudent && (tab === 'institution' || tab === 'for-you' || tab === 'campus' || tab === 'class');
  const showPublic = tab === 'public' || tab === 'for-you';
  const feed = tab === 'public' ? publicPosts : tab === 'institution' ? institutionPosts : official;

  return (
    <div className="mx-auto max-w-[800px]">
      <header className="mb-6 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <Users size={11} /> Community
        </div>
        <h1 className="font-display text-[32px] leading-tight">{org.name} community</h1>
        <p className="mt-2 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          {isStudent
            ? 'Public conversation plus official campus, department, and class rooms.'
            : `Public articles, discussions, and news. Official ${org.name} channels unlock when you become a student.`}
        </p>
        <Link
          href="/dashboard/announcements"
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold text-white"
          style={{ background: 'var(--green)' }}
        >
          <Megaphone size={14} /> Open announcements
        </Link>
        <div className="mt-5 flex flex-wrap gap-2">
          {tabs.map((id) => (
            <Link
              key={id}
              href={`/dashboard/community?tab=${id}`}
              className="border px-3 py-1.5 text-[12.5px] font-semibold capitalize"
              style={{
                borderColor: tab === id ? 'var(--ink)' : 'var(--line)',
                background: tab === id ? 'var(--ink)' : 'transparent',
                color: tab === id ? '#fff' : 'var(--ink-soft)',
              }}
            >
              {id.replace('-', ' ')}
            </Link>
          ))}
        </div>
      </header>

      {isStudent && tab === 'class' ? (
        <section className="mb-8 border p-5" style={{ borderColor: 'var(--line)' }}>
          <h2 className="font-display text-[22px]">Class rooms</h2>
          <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            Channels for chat, notes, and ideas. Class advocates create the room and add course mates.
          </p>
          <Link
            href="/dashboard/study-groups"
            className="mt-3 inline-block px-4 py-2 text-[13px] font-semibold text-white"
            style={{ background: '#00B369' }}
          >
            Open groups
          </Link>
        </section>
      ) : null}

      {showOfficial || showPublic ? (
        <section className="mb-10">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <h2 className="font-display text-[20px]">
              {tab === 'public' ? 'Public announcements' : tab === 'institution' ? 'Institution announcements' : 'Official announcements'}
            </h2>
            <Link
              href="/dashboard/announcements"
              className="inline-flex items-center border px-3 py-1.5 text-[12.5px] font-semibold"
              style={{ borderColor: 'var(--line)', color: 'var(--green-deep)' }}
            >
              All announcements
            </Link>
          </div>
          {feed.length === 0 ? (
            <p className="border border-dashed p-6 text-[14px]" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
              No posts in this feed yet. Authorized staff publish from Announcements.
            </p>
          ) : (
            <ul className="space-y-3">
              {feed.slice(0, 8).map((a) => (
                <li key={a.id}>
                  <AnnouncementCard item={a} compact />
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {showPublic ? (
        <section className="grid gap-3 sm:grid-cols-2">
          {[
            { title: 'Groups', href: '/dashboard/study-groups', body: 'Class rooms — chat, notes, ideas', Icon: Users },
            { title: 'Opportunities', href: '/dashboard/opportunities', body: 'Jobs, internships, and calls', Icon: Sparkles },
            { title: 'Messages', href: '/dashboard/messages', body: 'Direct conversations', Icon: MessageSquare },
            { title: 'Notes', href: '/dashboard/notes', body: 'Educational resources', Icon: FileText },
          ].map(({ title, href, body, Icon }) => (
            <Link key={href} href={href} className="border p-4" style={{ borderColor: 'var(--line)' }}>
              <p className="flex items-center gap-2 font-semibold">
                <Icon size={16} />
                {title}
              </p>
              <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                {body}
              </p>
            </Link>
          ))}
        </section>
      ) : null}

      {!isStudent && tab !== 'public' && tab !== 'for-you' ? (
        <p className="text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Institution, campus, and class feeds are for official students.{' '}
          <Link href="/dashboard/apply" className="font-semibold" style={{ color: 'var(--green-deep)' }}>
            Register as a student →
          </Link>
        </p>
      ) : null}
    </div>
  );
}
