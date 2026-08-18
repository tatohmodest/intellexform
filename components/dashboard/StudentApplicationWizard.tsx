'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import type { StudentApplication } from '@/lib/learn/applications';

const STEPS = [
  'Personal',
  'Contact',
  'Program',
  'Background',
  'Documents',
  'Emergency',
  'Review',
] as const;

type OrgPayload = {
  name: string;
  requirePayment: boolean;
  feeXAF: number;
  programs: Array<{ id: string; name: string }>;
  terminology: { student: string; matricule: string; program: string };
};

export default function StudentApplicationWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [org, setOrg] = useState<OrgPayload | null>(null);
  const [app, setApp] = useState<StudentApplication | null>(null);

  useEffect(() => {
    fetch('/api/learn/apply')
      .then(async (res) => {
        const data = await res.json();
        setOrg(data.org);
        if (data.isStudent) {
          router.replace('/dashboard');
          return;
        }
        if (
          data.application &&
          !['draft', 'documents_required', 'withdrawn'].includes(data.application.status)
        ) {
          router.replace('/dashboard/application');
          return;
        }
        setApp(
          data.application || {
            id: '',
            applicationCode: '',
            userId: '',
            status: 'draft',
            personal: { firstName: '', lastName: '', dateOfBirth: '', gender: '', nationality: '' },
            contact: { email: '', phone: '', city: '', address: '' },
            programId: '',
            programName: '',
            academic: { lastSchool: '', qualification: '', yearCompleted: '' },
            emergency: { name: '', phone: '', relationship: '' },
            documents: [],
            paid: false,
            feeXAF: data.org?.feeXAF || 0,
            submittedAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        );
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function persist(patch: Record<string, unknown>) {
    const res = await fetch('/api/learn/apply', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Could not save');
    setApp(data.application);
    return data.application as StudentApplication;
  }

  async function next() {
    setBusy(true);
    setError('');
    try {
      await persist({
        personal: app?.personal,
        contact: app?.contact,
        programId: app?.programId,
        programName: app?.programName,
        academic: app?.academic,
        emergency: app?.emergency,
        documents: app?.documents,
      });
      setStep((s) => Math.min(STEPS.length - 1, s + 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save');
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    setBusy(true);
    setError('');
    try {
      await persist({
        personal: app?.personal,
        contact: app?.contact,
        programId: app?.programId,
        programName: app?.programName,
        academic: app?.academic,
        emergency: app?.emergency,
      });
      const res = await fetch('/api/learn/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not submit');
      router.replace('/dashboard/application');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit');
      setBusy(false);
    }
  }

  if (loading || !org) {
    return (
      <div className="flex justify-center py-20" style={{ color: 'var(--ink-soft)' }}>
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const personal = app?.personal || {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
  };
  const contact = app?.contact || { email: '', phone: '', city: '', address: '' };
  const academic = app?.academic || { lastSchool: '', qualification: '', yearCompleted: '' };
  const emergency = app?.emergency || { name: '', phone: '', relationship: '' };

  return (
    <div className="mx-auto max-w-[720px]">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-soft)' }}>
        Student registration
      </p>
      <h1 className="mt-2 font-display text-[32px] leading-tight">Apply to {org.name}</h1>
      <p className="mt-2 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
        This is an application, not a second account. If you are accepted, this profile becomes your
        official student identity.
      </p>

      <ol className="mt-6 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wide">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className="rounded-full border px-2.5 py-1"
            style={{
              borderColor: i === step ? 'var(--ink)' : 'var(--line)',
              background: i === step ? 'var(--ink)' : 'transparent',
              color: i === step ? '#fff' : 'var(--ink-soft)',
            }}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      <div className="mt-8 space-y-4">
        {step === 0 ? (
          <FieldGrid>
            <Field
              label="First name"
              value={personal.firstName}
              onChange={(v) => setApp((a) => ({ ...(a as StudentApplication), personal: { ...personal, firstName: v } }))}
            />
            <Field
              label="Last name"
              value={personal.lastName}
              onChange={(v) => setApp((a) => ({ ...(a as StudentApplication), personal: { ...personal, lastName: v } }))}
            />
            <Field
              label="Date of birth"
              type="date"
              value={personal.dateOfBirth}
              onChange={(v) => setApp((a) => ({ ...(a as StudentApplication), personal: { ...personal, dateOfBirth: v } }))}
            />
            <Field
              label="Gender"
              value={personal.gender}
              onChange={(v) => setApp((a) => ({ ...(a as StudentApplication), personal: { ...personal, gender: v } }))}
            />
            <Field
              label="Nationality"
              value={personal.nationality}
              onChange={(v) => setApp((a) => ({ ...(a as StudentApplication), personal: { ...personal, nationality: v } }))}
            />
          </FieldGrid>
        ) : null}

        {step === 1 ? (
          <FieldGrid>
            <Field
              label="Email"
              type="email"
              value={contact.email}
              onChange={(v) => setApp((a) => ({ ...(a as StudentApplication), contact: { ...contact, email: v } }))}
            />
            <Field
              label="Phone"
              value={contact.phone}
              onChange={(v) => setApp((a) => ({ ...(a as StudentApplication), contact: { ...contact, phone: v } }))}
            />
            <Field
              label="City"
              value={contact.city}
              onChange={(v) => setApp((a) => ({ ...(a as StudentApplication), contact: { ...contact, city: v } }))}
            />
            <Field
              label="Address"
              value={contact.address}
              onChange={(v) => setApp((a) => ({ ...(a as StudentApplication), contact: { ...contact, address: v } }))}
            />
          </FieldGrid>
        ) : null}

        {step === 2 ? (
          <div className="space-y-2">
            {org.programs.map((p) => {
              const on = app?.programId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    setApp((a) => ({
                      ...(a as StudentApplication),
                      programId: p.id,
                      programName: p.name,
                    }))
                  }
                  className="flex w-full items-center justify-between border px-4 py-3 text-left"
                  style={{
                    borderColor: on ? 'var(--ink)' : 'var(--line)',
                    background: on ? 'var(--ink)' : 'transparent',
                    color: on ? '#fff' : 'var(--ink)',
                  }}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        ) : null}

        {step === 3 ? (
          <FieldGrid>
            <Field
              label="Last school / institution"
              value={academic.lastSchool}
              onChange={(v) => setApp((a) => ({ ...(a as StudentApplication), academic: { ...academic, lastSchool: v } }))}
            />
            <Field
              label="Highest qualification"
              value={academic.qualification}
              onChange={(v) => setApp((a) => ({ ...(a as StudentApplication), academic: { ...academic, qualification: v } }))}
            />
            <Field
              label="Year completed"
              value={academic.yearCompleted}
              onChange={(v) => setApp((a) => ({ ...(a as StudentApplication), academic: { ...academic, yearCompleted: v } }))}
            />
          </FieldGrid>
        ) : null}

        {step === 4 ? (
          <p className="border border-dashed p-6 text-[14.5px]" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
            Document uploads can be added after review if {org.name} requests them. You can submit now
            and complete files later.
          </p>
        ) : null}

        {step === 5 ? (
          <FieldGrid>
            <Field
              label="Emergency contact name"
              value={emergency.name}
              onChange={(v) => setApp((a) => ({ ...(a as StudentApplication), emergency: { ...emergency, name: v } }))}
            />
            <Field
              label="Phone"
              value={emergency.phone}
              onChange={(v) => setApp((a) => ({ ...(a as StudentApplication), emergency: { ...emergency, phone: v } }))}
            />
            <Field
              label="Relationship"
              value={emergency.relationship}
              onChange={(v) => setApp((a) => ({ ...(a as StudentApplication), emergency: { ...emergency, relationship: v } }))}
            />
          </FieldGrid>
        ) : null}

        {step === 6 ? (
          <div className="space-y-3 border p-5 text-[14px]" style={{ borderColor: 'var(--line)' }}>
            <p>
              <strong>Program:</strong> {app?.programName || 'Not selected'}
            </p>
            <p>
              <strong>Name:</strong> {personal.firstName} {personal.lastName}
            </p>
            <p>
              <strong>Contact:</strong> {contact.email} · {contact.phone}
            </p>
            <p>
              <strong>Background:</strong> {academic.qualification || '—'} {academic.lastSchool ? `at ${academic.lastSchool}` : ''}
            </p>
            {org.requirePayment && org.feeXAF > 0 ? (
              <p>
                Application fee {org.feeXAF.toLocaleString()} XAF can be settled with the institution after
                you submit.
              </p>
            ) : (
              <p>{org.name} will review this application and contact you.</p>
            )}
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="mt-4 text-[13px]" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          disabled={step === 0 || busy}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="inline-flex items-center gap-1 text-[13px] font-semibold disabled:opacity-40"
        >
          <ArrowLeft size={14} /> Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            disabled={busy}
            onClick={next}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white"
            style={{ background: 'var(--ink)' }}
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : null}
            Next <ArrowRight size={14} />
          </button>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={submit}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white"
            style={{ background: 'var(--green-deep)' }}
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : null}
            Submit application
          </button>
        )}
      </div>
    </div>
  );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-[13px] font-semibold">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-input mt-1.5 font-normal"
      />
    </label>
  );
}
