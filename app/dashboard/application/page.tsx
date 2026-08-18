import Link from 'next/link';
import { redirect } from 'next/navigation';
import { GraduationCap } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getMyApplication } from '@/lib/learn/applications';
import { getStudentMembership, isOfficialStudent } from '@/lib/learn/studentAccess';
import { getOrgConfig } from '@/lib/org/config';

export const dynamic = 'force-dynamic';

const LABELS: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under Review',
  documents_required: 'Documents Required',
  accepted: 'Accepted',
  rejected: 'Rejected',
  waitlisted: 'Waitlisted',
  withdrawn: 'Withdrawn',
  pending: 'Under Review',
  admitted: 'Accepted',
};

export default async function ApplicationStatusPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/application');
  if (await isOfficialStudent(session.uid)) redirect('/dashboard');

  const [app, org, membership] = await Promise.all([
    getMyApplication(session.uid),
    getOrgConfig(),
    getStudentMembership(session.uid),
  ]);

  if (!app) {
    return (
      <div className="mx-auto max-w-[640px]">
        <h1 className="font-display text-[32px]">My application</h1>
        <p className="mt-3 text-[15px]" style={{ color: 'var(--ink-soft)' }}>
          You have not applied to become a student at {org.name} yet.
        </p>
        <Link
          href="/dashboard/apply"
          className="mt-6 inline-flex px-4 py-2.5 text-[13px] font-semibold text-white"
          style={{ background: 'var(--ink)' }}
        >
          Apply now
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[640px]">
      <div className="tab mb-2 inline-flex items-center gap-1.5">
        <GraduationCap size={11} /> My application
      </div>
      <h1 className="font-display text-[32px] leading-tight">{org.name}</h1>
      <p className="mt-2 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
        Same account. When you are accepted, your student identity is added here — no second login.
      </p>

      <dl className="mt-8 divide-y border" style={{ borderColor: 'var(--line)' }}>
        {[
          ['Application ID', app.applicationCode],
          ['Program', app.programName || '—'],
          ['Status', LABELS[app.status] || app.status],
          ['Submitted', app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Not submitted'],
          membership.matricule ? ['Matricule', membership.matricule] : null,
        ]
          .filter(Boolean)
          .map((row) => {
            const [k, v] = row as [string, string];
            return (
              <div key={k} className="flex items-baseline justify-between gap-4 px-4 py-3">
                <dt className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                  {k}
                </dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            );
          })}
      </dl>

      {app.status === 'draft' || app.status === 'documents_required' || app.status === 'withdrawn' ? (
        <Link
          href="/dashboard/apply"
          className="mt-6 inline-flex px-4 py-2.5 text-[13px] font-semibold text-white"
          style={{ background: 'var(--ink)' }}
        >
          Continue application
        </Link>
      ) : (
        <p className="mt-6 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          {org.name} will update this page as review continues.
        </p>
      )}
    </div>
  );
}
