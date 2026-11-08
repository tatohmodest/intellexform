import Link from 'next/link';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import {
  ArrowRight,
  Award,
  BookMarked,
  Check,
  GraduationCap,
  Minus,
  Sparkles,
} from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import MembershipCheckout from '@/components/membership/MembershipCheckout';
import { getSessionUser } from '@/lib/auth/getUser';
import { hasActiveCertSubscription } from '@/lib/learn/certSubscription';
import {
  STUDENT_BENEFITS,
  STUDENT_MEMBERSHIP,
  STUDENT_NOT_INCLUDED,
  STUDENT_MONTHLY_XAF,
  STUDENT_YEARLY_XAF,
} from '@/lib/learn/studentMembership';
import { buildShareMetadata } from '@/lib/seo/share';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildShareMetadata({
  title: 'Library membership · 1,999 XAF/month',
  description:
    'Learn on your own for 1,999 XAF/month: the self-paced course library, Intermediate→Pro tracks, the digital library and the AI tutor.',
  path: '/membership',
  image: '/way_selfpaced.webp',
  imageAlt: 'InTelleX Student membership Cameroon',
  keywords: [
    'InTelleX Student',
    'InTelleX membership',
    '1999 XAF',
    'online courses Cameroon subscription',
    'professional training Cameroon',
  ],
});

export default async function MembershipPage() {
  const session = getSessionUser();
  const isMember = session ? await hasActiveCertSubscription(session.uid) : false;
  if (session && isMember) {
    redirect('/dashboard/library?member=1');
  }

  const yearlySave = STUDENT_MONTHLY_XAF * 12 - STUDENT_YEARLY_XAF;

  return (
    <>
      <TopNav />
      <section
        className="relative overflow-hidden py-14 sm:py-20"
        style={{
          background:
            'radial-gradient(900px 420px at 8% -10%, rgba(0,179,105,0.16), transparent 55%), radial-gradient(700px 380px at 100% 0%, rgba(74,144,226,0.12), transparent 50%), var(--paper)',
        }}
      >
        <div className="wrap max-w-[980px]">
          <div className="tab mb-3 inline-flex items-center gap-1.5">
            <GraduationCap size={11} /> Library membership
          </div>
          <h1 className="max-w-[820px] font-display text-[30px] leading-[1.12] sm:text-[44px]">
            Learn on your own, for less than 2,000 XAF a month
          </h1>
          <p className="mt-4 max-w-[640px] text-[15.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            {STUDENT_MEMBERSHIP.tagline} Monthly membership is{' '}
            <strong style={{ color: 'var(--ink)' }}>
              {STUDENT_MONTHLY_XAF.toLocaleString('en-US')} XAF
            </strong>
            . Self-paced only: live classes and mentorship come with{' '}
            <Link href="/programmes" className="font-semibold underline-offset-4 hover:underline" style={{ color: 'var(--green-deep)' }}>
              programmes
            </Link>
            .
          </p>
          <div className="mt-8 flex flex-wrap items-end gap-6">
            <div>
              <div className="font-display text-[42px] leading-none" style={{ color: 'var(--green-deep)' }}>
                {STUDENT_MONTHLY_XAF.toLocaleString('en-US')}
                <span className="ml-1 text-[16px] font-semibold">XAF/mo</span>
              </div>
              <div className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                or {STUDENT_YEARLY_XAF.toLocaleString('en-US')} XAF/year (save{' '}
                {yearlySave.toLocaleString('en-US')} XAF)
              </div>
            </div>
            <Link href="#join" className="btn btn-g">
              Join now <ArrowRight size={15} />
            </Link>
            {!session && (
              <Link href="/signup?next=/membership" className="btn btn-ghost">
                Create free account first
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="py-14" style={{ background: 'var(--paper-dim)' }}>
        <div className="wrap max-w-[980px]">
          <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
            <Sparkles size={15} /> What you get
          </div>
          <h2 className="mb-8 font-display text-[26px] sm:text-[30px]">
            What your membership includes
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {STUDENT_BENEFITS.map((b) => (
              <div
                key={b.title}
                className="flex gap-3 rounded-2xl border p-5"
                style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
              >
                <span
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                  style={{ background: 'rgba(0,179,105,0.14)', color: 'var(--green-deep)' }}
                >
                  <Check size={14} />
                </span>
                <div>
                  <div className="text-[15px] font-semibold">{b.title}</div>
                  <p className="mt-1 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 rounded-2xl border p-5 sm:grid-cols-[1fr_auto] sm:items-center" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
            <div>
              <div className="text-[15px] font-semibold">Not included: someone checking your work</div>
              <ul className="mt-3 space-y-2">
                {STUDENT_NOT_INCLUDED.map((b) => (
                  <li key={b.title} className="flex gap-2.5 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                    <Minus size={15} className="mt-0.5 shrink-0" />
                    <span>
                      <strong style={{ color: 'var(--ink)' }}>{b.title}.</strong> {b.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/pricing" className="btn btn-ghost whitespace-nowrap">
              Compare with programmes <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section id="join" className="scroll-mt-24 py-14 sm:py-16">
        <div className="wrap grid max-w-[980px] gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <div className="tab mb-3 inline-flex items-center gap-1.5">
              <Award size={11} /> Checkout
            </div>
            <h2 className="font-display text-[26px]">Start your membership</h2>
            <p className="mt-2 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
              Pay on this page with MTN MoMo or Orange Money. A prompt is sent to your phone — you
              stay on InTelleX. Access unlocks as soon as payment confirms.
            </p>
            <ul className="mt-6 space-y-3 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              <li className="flex items-start gap-2">
                <BookMarked size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--green-deep)' }} />
                Library books marked with a price become free for you
              </li>
              <li className="flex items-start gap-2">
                <GraduationCap size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--green-deep)' }} />
                Intermediate → Pro on free courses + certification paths
              </li>
              <li className="flex items-start gap-2">
                <Award size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--green-deep)' }} />
                1,000+ InTelleX courses with certifications
              </li>
            </ul>
          </div>
          <MembershipCheckout signedIn={Boolean(session)} />
        </div>
      </section>

      <Footer />
    </>
  );
}
