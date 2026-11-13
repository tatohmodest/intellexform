'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MessageCircle, PartyPopper } from 'lucide-react';
import type { ContactType } from '@/lib/types';
import { getProgramme } from '@/lib/programmes';
import { buildWhatsappLink, contactMessage } from '@/lib/whatsapp';
import { useT } from '@/components/i18n/I18nRoot';
import {
  FieldLabel,
  PillOption,
  RadioOption,
  StepCard,
  StepHeading,
  StepNav,
  TextArea,
  TextInput,
} from '@/components/forms/StepForm';

const LEARNER_TOPICS = [
  'Orientation — help me choose a path',
  'Full-Stack Web Development',
  'Data / AI',
  'Cybersecurity',
  'Digital Marketing',
  'Live mentorship',
  'Subscription plans',
  'Not sure yet - help me choose',
];

const INSTITUTION_INTERESTS = [
  'How the platform works',
  'How integration / onboarding works',
  'Partner our university / school',
  'Digital Learning (video courses)',
  'Live Teaching',
  'AI Learning for our campus',
  'Digital Library',
  'Career / Community modules',
  'Custom enterprise capabilities',
  'Demo / discovery call',
];

const MENTORSHIP_MODES = ['Live tutoring - online', 'Live tutoring - onsite', 'Not sure yet'];

const INTENTS: { type: ContactType; label: string; hint: string }[] = [
  { type: 'learner', label: "I'm a learner", hint: 'Courses, plans, AI tutor' },
  { type: 'institution', label: 'I represent an institution', hint: 'Campus partnership & capabilities' },
  { type: 'mentorship', label: 'Live mentorship quote', hint: 'Online or onsite tutoring' },
  { type: 'other', label: 'Something else', hint: 'General questions' },
];

function normalizeType(raw: string | null): ContactType | null {
  if (!raw) return null;
  if (raw === 'institution' || raw === 'campus' || raw === 'partner') return 'institution';
  if (raw === 'mentorship' || raw === 'mentor' || raw === 'quote') return 'mentorship';
  if (raw === 'learner' || raw === 'student') return 'learner';
  if (raw === 'other') return 'other';
  return null;
}

/** Contact / enquiry wizard on the shared step-form card. */
export default function ContactWizard() {
  const t = useT();
  const params = useSearchParams();
  const preset = normalizeType(params.get('type'));
  // Legacy enrolment links (/contact?programme=...) still arrive here pre-filled.
  const programme = getProgramme(params.get('programme') || '');
  const courseName = params.get('course') || '';
  const programmeTopic = programme
    ? `Enrol: ${programme.title}`
    : courseName
      ? `Enrol: ${courseName}`
      : '';

  const [step, setStep] = useState(preset ? 1 : 0);
  const [contactType, setContactType] = useState<ContactType>(preset || 'learner');
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [field, setField] = useState(programmeTopic);
  const [plan, setPlan] = useState(programme || courseName ? 'Programme enrolment' : '');
  const [message, setMessage] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [country, setCountry] = useState('');
  const [estimatedStudents, setEstimatedStudents] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ whatsappUrl: string; saved: boolean } | null>(null);

  const isInstitution = contactType === 'institution';
  const isMentorship = contactType === 'mentorship';
  const total = isInstitution ? 6 : 5;
  // Step layout: 0 intent · 1 name · 2 reach · [3 institution] · interest · message
  const interestStep = isInstitution ? 4 : 3;
  const messageStep = interestStep + 1;

  const canContinue = (() => {
    if (step === 0) return true;
    if (step === 1) return fullName.trim().length >= 2;
    if (step === 2) return whatsapp.replace(/\D/g, '').length >= 6;
    if (isInstitution && step === 3) return institutionName.trim().length >= 2;
    if (step === interestStep) return field.length > 0 || isMentorship;
    return true;
  })();

  async function submit() {
    setLoading(true);
    const payload = {
      contactType,
      fullName: fullName.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      field: field || (isMentorship ? plan || 'Live mentorship' : 'General'),
      plan: isMentorship ? plan || field : plan || (isInstitution ? 'Campus partnership' : '-'),
      message,
      institutionName,
      roleTitle,
      country,
      estimatedStudents,
    };
    const fallbackUrl = buildWhatsappLink(contactMessage(payload));
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      setDone({ whatsappUrl: res.ok && data.whatsappUrl ? data.whatsappUrl : fallbackUrl, saved: res.ok });
    } catch {
      // The message still reaches us on WhatsApp if saving fails.
      setDone({ whatsappUrl: fallbackUrl, saved: false });
    } finally {
      setLoading(false);
    }
  }

  const label = (n: number) => `${t('Step')} ${String(n + 1).padStart(2, '0')}`;
  const next = () => (step === messageStep ? submit() : setStep((s) => s + 1));
  const back = step > 0 && !(step === 1 && preset) ? () => setStep((s) => s - 1) : undefined;

  if (done) {
    return (
      <StepCard step={total} total={total}>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--pastel-mint)] text-[var(--green-deep)]">
            <PartyPopper size={30} />
          </span>
          <h2 className="mt-6 text-[28px] font-bold text-[var(--navy)]">
            {t('Thanks,')} {fullName.split(' ')[0]}!
          </h2>
          <p className="mt-3 max-w-[400px] text-[15px] leading-relaxed text-[#8a909a]">
            {done.saved
              ? isInstitution
                ? t('Your institution inquiry is saved. Continue on WhatsApp with the Platform Team, or we will follow up by email.')
                : t('Your message is saved. Continue on WhatsApp if you want a faster reply.')
              : t('Send your message on WhatsApp and we will reply there.')}
          </p>
          <a
            href={done.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[var(--green)] px-7 py-3.5 text-[16px] font-semibold text-white hover:bg-[var(--green-deep)]"
          >
            <MessageCircle size={18} /> {t('Continue on WhatsApp')}
          </a>
          {!isInstitution && (
            <Link href="/programmes" className="mt-4 text-[14px] font-medium text-[var(--navy)]/70 hover:text-[var(--navy)]">
              {t('Explore programmes')}
            </Link>
          )}
        </div>
      </StepCard>
    );
  }

  const topics = isInstitution
    ? INSTITUTION_INTERESTS
    : isMentorship
      ? MENTORSHIP_MODES
      : programmeTopic
        ? [programmeTopic, ...LEARNER_TOPICS]
        : LEARNER_TOPICS;

  return (
    <StepCard step={step} total={total}>
      {step === 0 && (
        <>
          <StepHeading label={label(0)} title={t('Who should we help?')} hint={t('Pick the one that fits best.')} />
          <div role="radiogroup" className="flex flex-col gap-1">
            {INTENTS.map((i) => (
              <RadioOption
                key={i.type}
                label={t(i.label)}
                hint={t(i.hint)}
                selected={contactType === i.type}
                onClick={() => {
                  if (i.type !== contactType) {
                    setField('');
                    setPlan('');
                  }
                  setContactType(i.type);
                }}
              />
            ))}
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <StepHeading label={label(1)} title={t('What should we call you?')} />
          <div className="flex flex-col gap-5">
            <div>
              <FieldLabel>{t('Full name')}</FieldLabel>
              <TextInput autoFocus value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t('Your name')} autoComplete="name" />
            </div>
            {isInstitution && (
              <div>
                <FieldLabel>{t('Your role')}</FieldLabel>
                <TextInput value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} placeholder={t('Dean, IT lead, founder…')} />
              </div>
            )}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <StepHeading label={label(2)} title={t('How can we reach you?')} hint={t('We usually reply on WhatsApp.')} />
          <div className="flex flex-col gap-5">
            <div>
              <FieldLabel>{t('WhatsApp number')}</FieldLabel>
              <TextInput autoFocus type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="6XX XXX XXX" autoComplete="tel" />
            </div>
            <div>
              <FieldLabel>{isInstitution ? t('Work email (recommended)') : t('Email (optional)')}</FieldLabel>
              <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
            </div>
          </div>
        </>
      )}

      {isInstitution && step === 3 && (
        <>
          <StepHeading label={label(3)} title={t('Tell us about your institution')} />
          <div className="flex flex-col gap-5">
            <div>
              <FieldLabel>{t('Institution name')}</FieldLabel>
              <TextInput autoFocus value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel>{t('Country')}</FieldLabel>
                <TextInput value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>
              <div>
                <FieldLabel>{t('Approx. students (optional)')}</FieldLabel>
                <TextInput value={estimatedStudents} onChange={(e) => setEstimatedStudents(e.target.value)} inputMode="numeric" />
              </div>
            </div>
          </div>
        </>
      )}

      {step === interestStep && (
        <>
          <StepHeading
            label={label(interestStep)}
            title={
              isInstitution ? t('What do you want to explore?') : isMentorship ? t('How do you want to learn?') : t('What brings you here?')
            }
          />
          <div className="flex flex-wrap gap-2.5">
            {topics.map((f) => (
              <PillOption
                key={f}
                label={t(f)}
                selected={field === f || (isMentorship && plan === f)}
                onClick={() => {
                  setField(f);
                  if (isMentorship) setPlan(f);
                }}
              />
            ))}
          </div>
        </>
      )}

      {step === messageStep && (
        <>
          <StepHeading label={label(messageStep)} title={t('Anything else we should know?')} hint={t('Optional, but it helps us reply with the right answer.')} />
          <TextArea
            autoFocus
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              isInstitution ? t('Systems you use, timeline, capabilities you need…') : t('Goals, questions, preferred schedule…')
            }
          />
        </>
      )}

      <StepNav
        onBack={back}
        onNext={next}
        disabled={!canContinue}
        loading={loading}
        final={step === messageStep}
        nextLabel={step === messageStep ? t('Send message') : t('Next')}
        backLabel={t('Back')}
      />
    </StepCard>
  );
}
