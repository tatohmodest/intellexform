'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, BookOpen, Zap, CheckCircle, Download, ExternalLink, ArrowRight, Loader2, Video, GraduationCap, Search } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { PROGRAMS, LEARNING_MODES } from '@/lib/programs';
import { RegistrationFormData } from '@/lib/types';

// ── Dynamic PDF imports (SSR safe) ────────────────────────────────────
// Each wrapper co-locates PDFDownloadLink + its Document so both are
// guaranteed to be ready at the same time, preventing react-pdf from
// receiving a null document and throwing `undefined`.
const InvoicePDFDownload = dynamic(
  () => import('./InvoicePDFDownload'),
  { ssr: false, loading: () => null }
);
const CurriculumPDFDownload = dynamic(
  () => import('./CurriculumPDFDownload'),
  { ssr: false, loading: () => null }
);

// ── Lucide icon map for learning modes ───────────────────────────────
const MODE_ICONS: Record<string, LucideIcon> = {
  BookOpen,
  Video,
  GraduationCap,
  Zap,
};

// ── Zod schema ─────────────────────────────────────────────────────────
const schema = z.object({
  fullName: z.string().min(3, 'Please enter your full name (min 3 characters)'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(9, 'Please enter a valid phone number'),
  city: z.string().min(2, 'Please enter your city'),
  ageRange: z.string().min(1, 'Please select your age range'),
  program: z.string().min(1, 'Please select a program'),
  learningMode: z.string().min(1, 'Please select a learning mode'),
  startDate: z.string().min(1, 'Please select when you want to start'),
  experienceLevel: z.string().min(1, 'Please select your experience level'),
  occupation: z.string().min(2, 'Please enter your occupation'),
  motivation: z.string().min(20, 'Please tell us a bit more (min 20 characters)'),
  referralSource: z.string().min(1, 'Please tell us how you heard about us'),
});

// ── Animation variants ─────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.07 } },
};

// ── Field + Section components ─────────────────────────────────────────
const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <motion.div variants={fadeUp} className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-intellex-text/80">{label}</label>
    {children}
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs text-red-400"
      >
        {error}
      </motion.p>
    )}
  </motion.div>
);

const SectionHeader = ({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) => (
  <div className="flex items-start gap-3 mb-6">
    <div className="p-2.5 rounded-xl bg-gold-500/15 border border-gold-500/20 shrink-0 mt-0.5">
      <Icon size={18} className="text-gold-400" />
    </div>
    <div>
      <h2 className="font-display font-bold text-xl text-intellex-text">{title}</h2>
      <p className="text-sm text-intellex-muted mt-0.5">{desc}</p>
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────
export default function RegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<string>('');
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({ resolver: zodResolver(schema) });

  const watchedProgram = watch('program');
  const watchedMode = watch('learningMode');

  useEffect(() => {
    if (watchedProgram) setSelectedProgram(watchedProgram);
  }, [watchedProgram]);
  useEffect(() => {
    if (watchedMode) setSelectedMode(watchedMode);
  }, [watchedMode]);

  const onSubmit = async (data: RegistrationFormData) => {
    await new Promise((r) => setTimeout(r, 600));
    setFormData(data);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedProgramData = PROGRAMS.find((p) => p.id === selectedProgram);

  // ── POST-SUBMISSION SUCCESS VIEW ───────────────────────────────────
  if (submitted && formData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl mx-auto px-4 py-10"
      >
        {/* Celebration card */}
        <div className="glass-card p-8 text-center mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent pointer-events-none" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
            className="w-16 h-16 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center mx-auto mb-5"
          >
            <CheckCircle size={32} className="text-gold-400" />
          </motion.div>
          <h2 className="font-display text-3xl font-bold mb-3 gradient-text">
            You&apos;re registered!
          </h2>
          <p className="text-intellex-muted text-base leading-relaxed mb-1">
            Welcome, <span className="text-intellex-text font-semibold">{formData.fullName}</span>.
          </p>
          <p className="text-intellex-muted text-sm leading-relaxed">
            Your registration for <span className="text-gold-400 font-medium">{selectedProgramData?.title ?? formData.program}</span> is confirmed.
            Download your invoice below and complete payment to activate your account.
          </p>
        </div>

        {/* Invoice download */}
        <div className="glass-card p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gold-500/15 border border-gold-500/20">
              <Download size={16} className="text-gold-400" />
            </div>
            <div>
              <h3 className="font-semibold text-intellex-text text-sm">Your Invoice</h3>
              <p className="text-xs text-intellex-muted">Pre-filled with your details. Download and pay to register.</p>
            </div>
          </div>

          <InvoicePDFDownload formData={formData} />
        </div>

        {/* Curriculum download */}
        <div className="glass-card p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/15 border border-blue-500/20">
              <BookOpen size={16} className="text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-intellex-text text-sm">Program Guide & Curriculum</h3>
              <p className="text-xs text-intellex-muted">8-page guide: all programs, pricing, learning modes, and how to enroll.</p>
            </div>
          </div>
          <CurriculumPDFDownload variant="primary" />
        </div>

        {/* Payment instructions */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-intellex-text text-sm mb-4">How to complete payment</h3>
          <div className="space-y-3">
            {[
              { n: '1', text: 'Download your invoice above' },
              { n: '2', text: 'Transfer the registration fee via MTN MoMo (674 435 138) or Orange Money (686 705 607) - MODESTE TATOH' },
              { n: '3', text: 'Send your payment screenshot to WhatsApp: +237 650 318 856' },
              { n: '4', text: 'Your account will be activated within 24 hours ✓' },
            ].map((item) => (
              <div key={item.n} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-gold-400 font-bold text-xs">{item.n}</span>
                </div>
                <p className="text-sm text-intellex-muted leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <a
            href="https://wa.me/237650318856"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/15 transition-colors"
          >
            <ExternalLink size={14} />
            Open WhatsApp to send confirmation
          </a>
        </div>
      </motion.div>
    );
  }

  // ── REGISTRATION FORM VIEW ─────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl mx-auto px-4 py-8 space-y-6">

      {/* ── Section 1: Personal Info ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="glass-card p-6 md:p-8"
      >
        <SectionHeader
          icon={User}
          title="Personal Information"
          desc="Tell us a little about yourself so we can prepare your account."
        />
        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div variants={fadeUp} className="md:col-span-2">
            <Field label="Full Name *" error={errors.fullName?.message}>
              <input
                {...register('fullName')}
                placeholder="e.g. Modeste Tatoh"
                className="form-input"
              />
            </Field>
          </motion.div>
          <Field label="Email Address *" error={errors.email?.message}>
            <input
              {...register('email')}
              type="email"
              placeholder="your@email.com"
              className="form-input"
            />
          </Field>
          <Field label="Phone Number *" error={errors.phone?.message}>
            <input
              {...register('phone')}
              placeholder="+237 6XX XXX XXX"
              className="form-input"
            />
          </Field>
          <Field label="City / Town *" error={errors.city?.message}>
            <input
              {...register('city')}
              placeholder="e.g. Douala, Yaoundé…"
              className="form-input"
            />
          </Field>
          <Field label="Age Range *" error={errors.ageRange?.message}>
            <select {...register('ageRange')} className="form-input">
              <option value="">Select age range</option>
              <option value="under-18">Under 18</option>
              <option value="18-24">18 – 24</option>
              <option value="25-30">25 – 30</option>
              <option value="31-40">31 – 40</option>
              <option value="41+">41 and above</option>
            </select>
          </Field>
        </motion.div>
      </motion.div>

      {/* ── Section 2: Program Selection ── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
        className="glass-card p-6 md:p-8"
      >
        <SectionHeader
          icon={BookOpen}
          title="Choose Your Program"
          desc="Select the course you want to enroll in. You can change this after registration."
        />

        {/* Live mentorship badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-[11px] font-bold tracking-wider uppercase mb-4">
          <Video size={11} />
          Live Mentorship Programs
        </div>

        {/* Full programs */}
        <p className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-3">
          Full Programs (3–6 months)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {PROGRAMS.filter((p) => p.type === 'full').map((prog) => (
            <motion.button
              key={prog.id}
              type="button"
              variants={fadeUp}
              onClick={() => {
                setValue('program', prog.id, { shouldValidate: true });
                setSelectedProgram(prog.id);
              }}
              className={`text-left p-4 rounded-xl border transition-all duration-200 relative ${
                selectedProgram === prog.id
                  ? 'border-gold-500/60 bg-gold-500/10'
                  : 'border-white/8 bg-white/3 hover:border-gold-500/30 hover:bg-white/5'
              }`}
            >
              {prog.badge && (
                <span className="absolute top-2 right-2 text-[10px] font-bold text-gold-400 bg-gold-500/15 border border-gold-500/20 px-2 py-0.5 rounded-full">
                  {prog.badge}
                </span>
              )}
              <div className="flex items-center gap-2 mb-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={prog.logoUrl} alt={prog.shortTitle} width={22} height={22} className="rounded"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <span className="font-semibold text-sm text-intellex-text">{prog.shortTitle}</span>
              </div>
              <div className="text-xs text-intellex-muted">{prog.duration} · {prog.level}</div>
              {prog.monthlyXAF && (
                <div className="text-xs text-gold-400 font-medium mt-1">
                  {(prog.monthlyXAF / 1000).toFixed(0)}k XAF/month
                </div>
              )}
              {selectedProgram === prog.id && (
                <CheckCircle size={14} className="text-gold-400 absolute bottom-3 right-3" />
              )}
            </motion.button>
          ))}
        </div>

        {/* Module programs */}
        <p className="text-xs font-semibold text-intellex-muted uppercase tracking-widest mb-3">
          Module Programs (4–6 weeks)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {PROGRAMS.filter((p) => p.type === 'partial').map((prog) => (
            <motion.button
              key={prog.id}
              type="button"
              variants={fadeUp}
              onClick={() => {
                setValue('program', prog.id, { shouldValidate: true });
                setSelectedProgram(prog.id);
              }}
              className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                selectedProgram === prog.id
                  ? 'border-gold-500/60 bg-gold-500/10'
                  : 'border-white/8 bg-white/3 hover:border-gold-500/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={prog.logoUrl} alt={prog.shortTitle} width={18} height={18} className="rounded"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <span className="font-semibold text-xs text-intellex-text">{prog.shortTitle}</span>
              </div>
              <div className="text-[11px] text-intellex-muted">{prog.duration}</div>
              <div className="text-[11px] text-gold-400 font-medium mt-0.5">
                {(prog.priceXAF / 1000).toFixed(0)}k XAF
              </div>
            </motion.button>
          ))}
        </div>

        {/* 1000+ Self-Paced Strategic Banner */}
        <motion.div variants={fadeUp} className="mt-3 p-4 rounded-xl border border-white/8 bg-white/3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gold-500/15 border border-gold-500/20 shrink-0">
              <Search size={15} className="text-gold-400" />
            </div>
            <div>
              <p className="font-semibold text-sm text-intellex-text mb-1">
                Don&apos;t see your field? We have 1,000+ self-paced programs.
              </p>
              <p className="text-xs text-intellex-muted leading-relaxed mb-2">
                From law and medicine to business, design, finance, and beyond - Intellex&apos;s
                full self-paced catalog covers virtually every domain. The programs above are
                our premium Live Mentorship tracks with personal coaching.
              </p>
              <a
                href="https://wa.me/237650318856?text=Hi%2C+I+want+to+explore+self-paced+programs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-gold-400 text-xs font-semibold hover:underline"
              >
                <ExternalLink size={11} /> Explore full catalog on WhatsApp
              </a>
            </div>
          </div>
        </motion.div>

        {errors.program && (
          <p className="text-xs text-red-400 mt-3">{errors.program.message}</p>
        )}
        <input type="hidden" {...register('program')} />
      </motion.div>

      {/* ── Section 3: Learning Mode ── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
        className="glass-card p-6 md:p-8"
      >
        <SectionHeader
          icon={Zap}
          title="Learning Mode"
          desc="How do you prefer to learn? Pick the mode that fits your lifestyle."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {LEARNING_MODES.map((mode) => (
            <motion.button
              key={mode.id}
              type="button"
              variants={fadeUp}
              onClick={() => {
                setValue('learningMode', mode.id, { shouldValidate: true });
                setSelectedMode(mode.id);
              }}
              className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                selectedMode === mode.id
                  ? 'border-gold-500/60 bg-gold-500/10'
                  : 'border-white/8 bg-white/3 hover:border-gold-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {(() => { const ModeIcon = MODE_ICONS[mode.icon] ?? BookOpen; return <ModeIcon size={16} className="text-gold-400" />; })()}
                  <span className="font-semibold text-sm text-intellex-text">{mode.label}</span>
                </div>
                {selectedMode === mode.id && <CheckCircle size={14} className="text-gold-400" />}
              </div>
              <p className="text-xs text-intellex-muted leading-relaxed">{mode.description}</p>
            </motion.button>
          ))}
        </div>
        <input type="hidden" {...register('learningMode')} />
        {errors.learningMode && (
          <p className="text-xs text-red-400">{errors.learningMode.message}</p>
        )}

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="When do you want to start? *" error={errors.startDate?.message}>
            <select {...register('startDate')} className="form-input">
              <option value="">Select start date</option>
              <option value="immediately">As soon as possible</option>
              <option value="next-month">Next month</option>
              <option value="2-3-months">In 2–3 months</option>
              <option value="flexible">Flexible</option>
            </select>
          </Field>
          <Field label="Experience Level *" error={errors.experienceLevel?.message}>
            <select {...register('experienceLevel')} className="form-input">
              <option value="">Select your level</option>
              <option value="absolute-beginner">Absolute Beginner (no coding experience)</option>
              <option value="beginner">Beginner (basic familiarity)</option>
              <option value="intermediate">Intermediate (some projects done)</option>
              <option value="advanced">Advanced (professional experience)</option>
            </select>
          </Field>
        </motion.div>
      </motion.div>

      {/* ── Section 4: About You ── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
        className="glass-card p-6 md:p-8"
      >
        <SectionHeader
          icon={Mail}
          title="A Little About You"
          desc="Help us understand your background so we can support you better."
        />
        <motion.div variants={stagger} className="grid grid-cols-1 gap-5">
          <Field label="Occupation / What you currently do *" error={errors.occupation?.message}>
            <input
              {...register('occupation')}
              placeholder="e.g. Student, Teacher, Entrepreneur, Developer…"
              className="form-input"
            />
          </Field>
          <Field label="Why do you want to join Intellex? *" error={errors.motivation?.message}>
            <textarea
              {...register('motivation')}
              placeholder="Tell us your goal - what do you want to achieve? What brought you here?"
              className="form-input"
              rows={4}
            />
          </Field>
          <Field label="How did you hear about us? *" error={errors.referralSource?.message}>
            <select {...register('referralSource')} className="form-input">
              <option value="">Select an option</option>
              <option value="whatsapp">WhatsApp community</option>
              <option value="friend">Friend or family</option>
              <option value="social-media">Social media</option>
              <option value="search">Google / search</option>
              <option value="other">Other</option>
            </select>
          </Field>
        </motion.div>
      </motion.div>

      {/* ── Summary before submit ── */}
      <AnimatePresence>
        {selectedProgramData && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-card p-5 border-gold-500/25"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs text-intellex-muted mb-0.5">Selected program</p>
                <p className="font-semibold text-intellex-text">{selectedProgramData.title}</p>
                <p className="text-xs text-intellex-muted">{selectedProgramData.duration} · {selectedProgramData.level}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-intellex-muted mb-0.5">Registration fee</p>
                <p className="text-xl font-display font-bold text-gold-400">
                  XAF {selectedProgramData.registrationFee.toLocaleString()}
                </p>
                <p className="text-xs text-intellex-muted">one-time · activates your account</p>
                {selectedProgramData.monthlyXAF && (
                  <p className="text-xs text-gold-400/70 mt-1">
                    Program: {selectedProgramData.priceXAF.toLocaleString()} XAF total<br />
                    or {selectedProgramData.monthlyXAF.toLocaleString()} XAF/mo installments
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Curriculum download (pre-submit) ── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="glass-card p-5"
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="font-medium text-sm text-intellex-text">Want to review everything first?</p>
            <p className="text-xs text-intellex-muted mt-0.5">Download our full 8-page Program Guide - all programs, pricing, and learning modes.</p>
          </div>
          <CurriculumPDFDownload />
        </div>
      </motion.div>

      {/* ── Submit button ── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-semibold text-base transition-all duration-200 ${
            isSubmitting
              ? 'bg-gold-500/50 text-navy-900/70 cursor-wait'
              : 'bg-gold-500 text-navy-900 hover:bg-gold-300 hover:scale-[1.02] active:scale-[0.99] gold-glow'
          }`}
        >
          {isSubmitting ? (
            <><Loader2 size={20} className="animate-spin" /> Processing your registration…</>
          ) : (
            <>Register & Get My Invoice <ArrowRight size={18} /></>
          )}
        </button>
        <p className="text-xs text-intellex-muted text-center mt-3">
          After submitting, you&apos;ll be able to download your personalized invoice instantly.
          No spam, no commitments until you pay.
        </p>
      </motion.div>
    </form>
  );
}
