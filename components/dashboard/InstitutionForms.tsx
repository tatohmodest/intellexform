import Link from 'next/link';
import { ClipboardList } from 'lucide-react';
import { submitAccessLabel, type SubmitAccess } from '@/lib/staff/dataTypes';

export default function InstitutionForms({
  forms,
}: {
  forms: Array<{
    id: string;
    name: string;
    description: string;
    slug: string;
    ownerName: string;
    submitAccess: string;
  }>;
}) {
  if (forms.length === 0) return null;
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-[22px]">Institution forms</h2>
          <p className="mt-1 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
            Datasets created for this school. You can fill them even if you did not create them.
          </p>
        </div>
      </div>
      <ul className="space-y-3">
        {forms.map((form) => (
          <li key={form.id}>
            <div className="flex flex-wrap items-center gap-3 border p-4" style={{ borderColor: 'var(--line)' }}>
              <ClipboardList size={18} className="shrink-0" style={{ color: 'var(--green-deep)' }} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{form.name}</p>
                <p className="mt-0.5 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                  Created by {form.ownerName || 'staff'}
                  {form.description ? ` · ${form.description}` : ''}
                </p>
                <p className="mt-1 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                  {submitAccessLabel(form.submitAccess as SubmitAccess)}
                </p>
              </div>
              <Link
                href={`/f/${encodeURIComponent(form.slug)}`}
                className="inline-flex shrink-0 items-center border px-3 py-1.5 text-[13px] font-semibold"
                style={{ borderColor: 'var(--line)', color: 'var(--green-deep)' }}
              >
                Open form
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
