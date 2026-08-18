import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Users } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { isOfficialStudent } from '@/lib/learn/studentAccess';
import { getOrgConfig } from '@/lib/org/config';
import { listAnnouncements } from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

export default async function CommunityPage({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/community');

  const [isStudent, org, announcements] = await Promise.all([
    isOfficialStudent(session.uid),
    getOrgConfig(),
    listAnnouncements().catch(() => [] as Awaited<ReturnType<typeof listAnnouncements>>),
  ]);

  const tabs = isStudent
    ? ['for-you', 'public', 'institution', 'campus', 'class']
    : ['for-you', 'public'];
  const tab = tabs.includes(String(searchParams?.tab || ''))
    ? String(searchParams?.tab)
    : 'for-you';

  const official = announcements.filter((a) => a.audience !== 'staff');
  const showOfficial = isStudent && (tab === 'institution' || tab === 'for-you' || tab === 'campus' || tab === 'class');
  const showPublic = tab === 'public' || tab === 'for-you';

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
            Channels for chat, notes, and ideas. Class heads create the room and add course mates.
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

      {showOfficial ? (
        <section className="mb-10">
          <h2 className="mb-3 font-display text-[20px]">Official announcements</h2>
          {official.length === 0 ? (
            <p className="border border-dashed p-6 text-[14px]" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
              No official posts yet. Authorized staff publish here.
            </p>
          ) : (
            <ul className="space-y-3">
              {official.slice(0, 12).map((a) => (
                <li key={a.id} className="border p-4" style={{ borderColor: 'var(--line)' }}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--green-deep)' }}>
                    Official announcement
                  </p>
                  <h3 className="mt-1 font-display text-[20px] leading-tight">{a.title}</h3>
                  <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                    Published by {a.authorName || 'Administration'}
                    {a.campusSlug ? ` · ${a.campusSlug}` : ''}
                  </p>
                  <p className="mt-2 text-[14.5px] leading-relaxed">{a.body}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {showPublic ? (
        <section className="grid gap-3 sm:grid-cols-2">
          {[
            ['Groups', '/dashboard/study-groups', 'Class rooms — chat, notes, ideas'],
            ['Opportunities', '/dashboard/opportunities', 'Jobs, internships, and calls'],
            ['Messages', '/dashboard/messages', 'Direct conversations'],
            ['Notes', '/dashboard/notes', 'Educational resources'],
          ].map(([title, href, body]) => (
            <Link key={href} href={href} className="border p-4" style={{ borderColor: 'var(--line)' }}>
              <p className="font-semibold">{title}</p>
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
