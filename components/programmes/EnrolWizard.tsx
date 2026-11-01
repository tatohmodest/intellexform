'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, MessageCircle, PartyPopper } from 'lucide-react';
import { FieldLabel, PillOption, RadioOption, StepCard, StepHeading, StepNav, TextInput } from '@/components/forms/StepForm';
import { useT } from '@/components/i18n/I18nRoot';
import { buildWhatsappLink, contactMessage } from '@/lib/whatsapp';

export type EnrolProgramme = {
  id: string;
  title: string;
  duration: string;
  level: string;
  priceXAF: number;
  monthlyXAF?: number;
  registrationFee: number;
  logoUrl: string;
  categoryLabel: string;
};

const LEVELS = ['Complete beginner', 'I know some basics', 'I already build things'];
const STARTS = ['Next available cohort', 'Within a month', 'I am just exploring'];
const TOTAL = 5;

const money = (xaf: number) => new Intl.NumberFormat('en-US').format(xaf);

export default function EnrolWizard({ programme: p }: { programme: EnrolProgramme }) {
  const router = useRouter();
  const t = useT();
  const months = parseInt(p.duration, 10);
  const monthlyTotal = p.monthlyXAF && p.duration.includes('month') ? p.monthlyXAF * months : null;
  const saving = monthlyTotal && monthlyTotal > p.priceXAF ? monthlyTotal - p.priceXAF : 0;

  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<'full' | 'monthly'>('full');
  const [level, setLevel] = useState('');
  const [start, setStart] = useState('');
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ whatsappUrl: string; saved: boolean } | null>(null);

  const planLabel =
    plan === 'monthly' && p.monthlyXAF
      ? `Monthly: ${money(p.monthlyXAF)} XAF/month${monthlyTotal ? ` x ${months}` : ''}`
      : `Full payment: ${money(p.priceXAF)} XAF`;
  const digits = whatsapp.replace(/\D/g, '');
  const canNext =
    step === 0 ? true : step === 1 ? Boolean(level) : step === 2 ? Boolean(start) : step === 3 ? name.trim().length >= 2 && digits.length >= 8 : true;

  async function submit() {
    setSending(true);
    const payload = {
      contactType: 'learner' as const,
      fullName: name.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      field: `Enrol: ${p.title}`,
      plan: planLabel,
      message: `Level: ${level} · Start: ${start} · Registration fee: ${money(p.registrationFee)} XAF`,
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
      // Never dead-end an enrolment: WhatsApp carries the same details.
      setDone({ whatsappUrl: fallbackUrl, saved: false });
    } finally {
      setSending(false);
    }
  }

  const close = () => router.push(`/programmes/${p.id}`);
  const next = () => (step === TOTAL - 1 ? submit() : setStep((s) => s + 1));
  const back = step > 0 ? () => setStep((s) => s - 1) : undefined;
  const label = (n: number) => `${t('Step')} ${String(n + 1).padStart(2, '0')}`;

  if (done) {
    return (
      <StepCard step={TOTAL} total={TOTAL} onClose={close}>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--pastel-mint)] text-[var(--green-deep)]">
            <PartyPopper size={30} />
          </span>
          <h2 className="mt-6 text-[28px] font-bold text-[var(--navy)]">
            {t('You are almost in,')} {name.split(' ')[0]}!
          </h2>
          <p className="mt-3 max-w-[400px] text-[15px] leading-relaxed text-[#8a909a]">
            {done.saved
              ? t('We have your enrolment request. Send it on WhatsApp and we will confirm your cohort, schedule and payment.')
              : t('Send your enrolment on WhatsApp and we will confirm your cohort, schedule and payment.')}
          </p>
          <a
            href={done.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[var(--green)] px-7 py-3.5 text-[16px] font-semibold text-white hover:bg-[var(--green-deep)]"
          >
            <MessageCircle size={18} /> {t('Continue on WhatsApp')}
          </a>
          <Link href="/programmes" className="mt-4 text-[14px] font-medium text-[var(--navy)]/70 hover:text-[var(--navy)]">
            {t('Browse other programmes')}
          </Link>
        </div>
      </StepCard>
    );
  }

  return (
    <StepCard step={step} total={TOTAL} onClose={close}>
      {step === 0 && (
        <>
          <StepHeading label={label(0)} title={t('How would you like to pay?')} hint={t('Choose what suits you. You can talk it through with us before paying.')} />
          <div role="radiogroup" className="flex flex-col gap-1">
            <RadioOption
              label={t('Pay in full')}
              hint={saving ? `${t('Save')} ${money(saving)} XAF` : t('One payment, nothing more to think about')}
              aside={<span className="text-[15px] font-bold text-[var(--navy)]">{money(p.priceXAF)} XAF</span>}
              selected={plan === 'full'}
              onClick={() => setPlan('full')}
            />
            {p.monthlyXAF ? (
              <RadioOption
                label={t('Pay monthly')}
                hint={monthlyTotal ? `${months} ${t('monthly payments')}` : t('Spread the cost')}
                aside={
                  <span className="text-[15px] font-bold text-[var(--navy)]">
                    {money(p.monthlyXAF)} <span className="text-[12px] font-medium">XAF{t('/mo')}</span>
                  </span>
                }
                selected={plan === 'monthly'}
                onClick={() => setPlan('monthly')}
              />
            ) : null}
          </div>
          <p className="mt-5 text-[13.5px] text-[#8a909a]">
            {t('Registration fee')}: {money(p.registrationFee)} XAF · MTN MoMo · Orange Money · {t('Card')}
          </p>
        </>
      )}

      {step === 1 && (
        <>
          <StepHeading label={label(1)} title={t('Where are you starting from?')} hint={t('So your instructor knows how to pace the first weeks.')} />
          <div className="flex flex-wrap gap-2.5">
            {LEVELS.map((l) => (
              <PillOption key={l} label={t(l)} selected={level === l} onClick={() => setLevel(l)} />
            ))}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <StepHeading label={label(2)} title={t('When would you like to start?')} />
          <div className="flex flex-wrap gap-2.5">
            {STARTS.map((s) => (
              <PillOption key={s} label={t(s)} selected={start === s} onClick={() => setStart(s)} />
            ))}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <StepHeading label={label(3)} title={t('How can we reach you?')} hint={t('We confirm your place on WhatsApp.')} />
          <div className="flex flex-col gap-5">
            <div>
              <FieldLabel>{t('Full name')}</FieldLabel>
              <TextInput autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder={t('e.g. Marie Ngala')} autoComplete="name" />
            </div>
            <div>
              <FieldLabel>{t('WhatsApp number')}</FieldLabel>
              <TextInput type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="6XX XXX XXX" autoComplete="tel" />
            </div>
            <div>
              <FieldLabel>{t('Email (optional)')}</FieldLabel>
              <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
            </div>
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <StepHeading label={label(4)} title={t('Ready to send?')} hint={t('Check your enrolment details.')} />
          <div className="rounded-3xl bg-[#f6f7f9] p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.logoUrl} alt="" className="h-6 w-6 object-contain" />
              </span>
              <div>
                <div className="text-[16px] font-bold text-[var(--navy)]">{t(p.title)}</div>
                <div className="text-[13px] text-[#8a909a]">
                  {t(p.duration)} · {t(p.level)}
                </div>
              </div>
            </div>
            <dl className="mt-5 grid gap-3 text-[14.5px]">
              {[
                [t('Payment'), plan === 'monthly' && p.monthlyXAF ? `${money(p.monthlyXAF)} XAF${t('/mo')}` : `${money(p.priceXAF)} XAF`],
                [t('Level'), t(level)],
                [t('Start'), t(start)],
                [t('Name'), name],
                ['WhatsApp', whatsapp],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-[#8a909a]">{k}</dt>
                  <dd className="text-right font-semibold text-[var(--navy)]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="mt-4 flex items-center gap-2 text-[13px] text-[#8a909a]">
            <Check size={14} className="text-[var(--green-deep)]" /> {t('Nothing is charged now. We confirm everything with you first.')}
          </p>
        </>
      )}

      <StepNav
        onBack={back}
        onNext={next}
        disabled={!canNext}
        loading={sending}
        final={step === TOTAL - 1}
        nextLabel={step === TOTAL - 1 ? t('Send enrolment') : t('Next')}
        backLabel={t('Back')}
      />
    </StepCard>
  );
}
