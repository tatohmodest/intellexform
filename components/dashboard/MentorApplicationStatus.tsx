'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import MentorRevisionPortal from '@/components/dashboard/MentorRevisionPortal';
import type { MentorApplicationDoc } from '@/lib/learn/mentorApplication';

/** Waiting-for-approval screen. Shows the revision portal when admins ask for docs. */
export default function MentorApplicationStatus({
  application,
}: {
  application: MentorApplicationDoc;
}) {
  const router = useRouter();
  const [app, setApp] = useState<MentorApplicationDoc | null>(application);

  const request = app?.documentRequest;
  const openRequest =
    request?.status === 'open' &&
    Array.isArray(request.items) &&
    request.items.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-[720px] border-t pt-10"
      style={{ borderColor: 'var(--line)' }}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-soft)' }}>
        Instructor application
      </p>
      <h1 className="mt-2 font-display text-[32px] leading-[0.95] tracking-tight">
        {openRequest ? 'Updates requested' : 'Under review'}
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        {openRequest
          ? 'Admins need specific documents again. Send only the items listed below — the rest of your application stays as it is.'
          : 'Your CV, ID, and intro video are with InTelleX admins. Mentor Studio unlocks only after approval.'}
      </p>

      {!openRequest && (
        <p
          className="mt-4 inline-flex items-center gap-2 border px-3 py-2 text-[13px]"
          style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
        >
          <Clock size={14} />
          Submitted {app?.createdAt ? new Date(app.createdAt).toLocaleString() : ''}
        </p>
      )}

      {openRequest && app && (
        <MentorRevisionPortal
          application={app}
          onDone={(next) => {
            setApp(next);
            router.refresh();
          }}
        />
      )}

      <button
        type="button"
        onClick={() => router.push('/dashboard')}
        className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 text-[13.5px] font-semibold text-white"
        style={{ background: 'var(--green)' }}
      >
        Back to dashboard
      </button>
    </motion.div>
  );
}
