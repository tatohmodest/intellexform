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
    <section>
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="font-display text-[19px] leading-tight">Forms to fill</h2>
      </div>
      <ul className="space-y-3">
        {forms.map((form) => (
          <li key={form.id}>
            <div className="card flex flex-wrap items-center gap-3 p-4">
              <ClipboardList size={18} className="shrink-0" style={{ color: 'var(--green-deep)' }} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{form.name}</p>
                <p className="muted mt-0.5 truncate text-[13px]">
                  {form.ownerName || 'Staff'} · {submitAccessLabel(form.submitAccess as SubmitAccess)}
                </p>
              </div>
              <Link
                href={`/f/${encodeURIComponent(form.slug)}`}
                className="chip shrink-0"
              >
                Open
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
