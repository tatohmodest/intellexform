'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardList } from 'lucide-react';
import type { AssessmentView } from '@/lib/learn/assessments';

export default function CampusAssessmentsPanel({
  slug,
  accent,
  isStaff,
}: {
  slug: string;
  accent: string;
  isStaff: boolean;
}) {
  const [items, setItems] = useState<AssessmentView[]>([]);

  useEffect(() => {
    fetch(`/api/learn/assessments?campus=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) =>
        setItems(
          (d.assessments || []).filter(
            (a: AssessmentView) => a.published || isStaff,
          ),
        ),
      )
      .catch(() => setItems([]));
  }, [slug, isStaff]);

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-[24px]">Exams & assignments</h2>
          <p className="mt-1 max-w-lg text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            {isStaff
              ? 'Create locked exams and Drive-based assignments. Grade submissions with documents opened inside InTelleX.'
              : 'Submit Drive/Docs links for assignments. Exams are one question at a time — leaving the tab ends the attempt.'}
          </p>
        </div>
        {isStaff && (
          <Link
            href={`/dashboard/teach/assessments?campus=${encodeURIComponent(slug)}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white"
            style={{ background: accent }}
          >
            <ClipboardList size={15} /> Assessment Studio
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <div className="border border-dashed py-10 text-center text-[14px]" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
          Nothing published yet.
        </div>
      ) : (
        <ul className="divide-y" style={{ borderColor: 'var(--line)' }}>
          {items.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <div className="text-[16px] font-semibold">{a.title}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
                  {a.kind}
                  {!a.published ? ' · draft' : ''}
                  {a.dueAt ? ` · due ${new Date(a.dueAt).toLocaleDateString()}` : ''}
                </div>
              </div>
              {a.published && (
                <Link
                  href={
                    a.kind === 'exam'
                      ? `/dashboard/exams/${a.id}`
                      : `/dashboard/assignments/${a.id}`
                  }
                  className="text-[13px] font-semibold"
                  style={{ color: accent }}
                >
                  {a.kind === 'exam' ? 'Take exam →' : 'Open assignment →'}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
