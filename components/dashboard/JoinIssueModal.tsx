'use client';

import { AlertCircle, Lock, X } from 'lucide-react';

export type JoinIssue = {
  title: string;
  message: string;
  hint?: string;
};

/** Map API error codes to human-readable join feedback. */
export function joinIssueFromError(code: string | undefined, status?: number): JoinIssue {
  switch (code) {
    case 'unauthorized':
      return {
        title: 'Sign in required',
        message: 'You need to be signed in with your InTelleX account before joining a campus.',
        hint: 'Open Login, then try Join again.',
      };
    case 'not_found':
      return {
        title: 'Campus not found',
        message: 'This institution is not available on the network, or it is no longer public.',
      };
    case 'invite_only':
      return {
        title: 'Invite-only campus',
        message:
          'This campus is private. You cannot join from the directory - an administrator must invite you or share an enrollment link.',
        hint: 'Ask your institution admin, or contact the Platform Team if you are the school.',
      };
    case 'invalid_credentials':
    case 'invalid_matricule':
      return {
        title: 'Could not verify student ID',
        message:
          'Your matricule or password did not match what this campus expects. Check with your registrar.',
      };
    case 'already_member':
      return {
        title: 'Already a member',
        message: 'You are already affiliated with this campus. Open it from Institutions.',
      };
    case 'banned':
      return {
        title: 'Access blocked',
        message: 'Your account cannot join campuses right now. Contact Platform support.',
      };
    case 'db_unavailable':
      return {
        title: 'Temporarily unavailable',
        message: 'We could not reach the campus service. Please try again in a moment.',
      };
    default:
      if (status === 403) {
        return {
          title: 'Not allowed to join',
          message: 'This campus restricted who can join. You may need an invite or enrollment code.',
        };
      }
      return {
        title: 'Could not join',
        message: 'Something went wrong while joining this campus. Please try again.',
        hint: code ? `Reference: ${code}` : undefined,
      };
  }
}

export default function JoinIssueModal({
  issue,
  onClose,
}: {
  issue: JoinIssue;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center"
      style={{ background: 'rgba(12,17,22,0.55)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-issue-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md border p-6 shadow-book"
        style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center"
            style={{ background: 'rgba(220,38,38,0.1)', color: '#b91c1c' }}
          >
            <AlertCircle size={20} />
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center"
            style={{ color: 'var(--ink-soft)' }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
          Cannot join
        </p>
        <h2 id="join-issue-title" className="mt-1 font-display text-[22px] leading-tight">
          {issue.title}
        </h2>
        <p className="mt-3 text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          {issue.message}
        </p>
        {issue.hint ? (
          <p
            className="mt-3 flex items-start gap-2 border-t pt-3 text-[13px]"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
          >
            <Lock size={14} className="mt-0.5 shrink-0" />
            {issue.hint}
          </p>
        ) : null}
        <button type="button" onClick={onClose} className="btn btn-primary mt-6 w-full !rounded-none">
          Got it
        </button>
      </div>
    </div>
  );
}
