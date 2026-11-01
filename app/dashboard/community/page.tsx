import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FileText, Megaphone, MessageSquare, Sparkles, Users } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { isOfficialStudent } from '@/lib/learn/studentAccess';
import { getOrgConfig } from '@/lib/org/config';
import { listVisibleAnnouncements } from '@/lib/staff/store';
import AnnouncementCard from '@/components/dashboard/AnnouncementCard';
import PageHeader from '@/components/dashboard/PageHeader';

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
    <div className="mx-auto max-w-[1180px]">
      <PageHeader art="/mentor_session.webp" tone="peach"
        title="Community"
        description="News from your school, your classes and the InTelleX community."
        actions={
          <Link href="/dashboard/announcements" className="chip">
            <Megaphone size={14} /> Announcements
          </Link>
        }
      >
        <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {tabs.map((id) => (
            <Link
              key={id}
              href={`/dashboard/community?tab=${id}`}
              className={`chip capitalize ${tab === id ? 'chip-primary' : ''}`}
            >
              {id.replace('-', ' ')}
            </Link>
          ))}
        </div>
      </PageHeader>

      {isStudent && tab === 'class' ? (
        <section className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-[var(--pastel-lilac)] p-6">
          <div>
            <h2 className="text-[20px] font-bold text-[var(--navy)]">Class rooms</h2>
            <p className="mt-1 text-[14px] text-[var(--navy)]/70">
              Channels for chat, notes, and ideas. Class advocates create the room and add course mates.
            </p>
          </div>
          <Link href="/dashboard/study-groups" className="btn btn-dark !px-5">
            Open groups
          </Link>
        </section>
      ) : null}

      {showOfficial || showPublic ? (
        <section className="mb-10">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-[20px] font-bold text-[var(--navy)]">
              {tab === 'public' ? 'Public announcements' : tab === 'institution' ? 'Institution announcements' : 'Official announcements'}
            </h2>
            <Link
              href="/dashboard/announcements"
              className="inline-flex items-center rounded-xl bg-white px-3.5 py-2 text-[13px] font-semibold text-[var(--green-deep)]"
            >
              All announcements
            </Link>
          </div>
          {feed.length === 0 ? (
            <p className="rounded-3xl bg-white p-6 text-[14px] text-[var(--ink-soft)]">
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
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Groups', href: '/dashboard/study-groups', body: 'Class rooms — chat, notes, ideas', Icon: Users },
            { title: 'Opportunities', href: '/dashboard/opportunities', body: 'Jobs, internships, and calls', Icon: Sparkles },
            { title: 'Messages', href: '/dashboard/messages', body: 'Direct conversations', Icon: MessageSquare },
            { title: 'Notes', href: '/dashboard/notes', body: 'Educational resources', Icon: FileText },
          ].map(({ title, href, body, Icon }) => (
            <Link key={href} href={href} className="group flex flex-col gap-6 rounded-3xl bg-white p-5 transition-transform hover:-translate-y-1">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--pastel-mint)] text-[var(--green-deep)]">
                <Icon size={18} />
              </span>
              <span>
                <span className="block font-bold text-[var(--navy)]">{title}</span>
                <span className="mt-1 block text-[13px] text-[var(--ink-soft)]">{body}</span>
              </span>
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
