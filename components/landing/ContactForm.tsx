'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, MessageCircle } from 'lucide-react';

const FIELDS = [
  'Full-Stack Web Development',
  'MERN Stack',
  'PERN Stack',
  'Web Dev Fundamentals',
  'Python',
  'JavaScript',
  'Java',
  'Data Analysis / Data Science',
  'Machine Learning',
  'Cybersecurity',
  'Digital Marketing',
  'Branding',
  'Not sure yet — help me choose',
  'Special Program — Full-Stack in 3 Weeks (AI-assisted)',
];

const PLANS = [
  'Monthly — 1,999 XAF',
  'Yearly — 22,560 XAF',
  'Single course — from 4,999 XAF',
  'Special Program — Full-Stack in 3 Weeks (150,000 XAF)',
  'Live tutoring — online',
  'Live tutoring — onsite',
  'AI Tutor — pay as you go',
  'AI Tutor — pay once',
];

export default function ContactForm() {
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [field, setField] = useState(FIELDS[0]);
  const [plan, setPlan] = useState(PLANS[0]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ whatsappUrl: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, whatsapp, field, plan, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setDone({ whatsappUrl: data.whatsappUrl });
      // Redirect the user to WhatsApp with the pre-written message.
      window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="rounded-[20px] border p-8"
      style={{ background: 'var(--paper-dim)', borderColor: 'var(--line)' }}
    >
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-6"
          >
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: 'rgba(0,179,105,0.15)' }}
            >
              <CheckCircle className="text-green-deep" size={28} />
            </div>
            <h3 className="font-display text-2xl mb-2">You&apos;re on the list!</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--ink-soft)' }}>
              We&apos;ve saved your request and opened WhatsApp with your choices. If it didn&apos;t
              open, tap below to message us.
            </p>
            <a href={done.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <MessageCircle size={18} /> Continue on WhatsApp
            </a>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                  Full name
                </label>
                <input
                  className="form-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                  WhatsApp number
                </label>
                <input
                  className="form-input"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="6XX XXX XXX"
                  type="tel"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                Which field?
              </label>
              <select className="form-input" value={field} onChange={(e) => setField(e.target.value)}>
                {FIELDS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                Which plan?
              </label>
              <select className="form-input" value={plan} onChange={(e) => setPlan(e.target.value)}>
                {PLANS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                Anything else? (optional)
              </label>
              <textarea
                className="form-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us your goal and we'll point you to the right course, mentor, or AI tutor track."
                rows={3}
              />
            </div>

            {error && (
              <p className="mt-4 rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(220,38,38,0.08)', color: '#b91c1c' }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary mt-5 w-full">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <MessageCircle size={18} />}
              {loading ? 'Sending…' : 'Register & continue on WhatsApp'}
            </button>
            <p className="mt-3 text-center text-xs" style={{ color: 'var(--ink-soft)' }}>
              We&apos;ll follow up on WhatsApp with payment details for MTN MoMo or Orange Money.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
