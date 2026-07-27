'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CalendarClock,
  Globe2,
  Loader2,
  Star,
  Video,
  X,
  XCircle,
} from 'lucide-react';
import type { Mentor } from '@/lib/learn/mentors';

export interface BookingView {
  id: string;
  mentorId: string;
  mentorName: string;
  topic: string;
  scheduledAt: string;
  durationMinutes: number;
  channel: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

function slotDate(dayOffset: number, time: string): Date {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(h, m, 0, 0);
  return d;
}

function fmtSlot(d: Date): string {
  return `${d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
}

export default function MentorDirectory({
  mentors,
  bookings,
}: {
  mentors: Mentor[];
  bookings: BookingView[];
}) {
  const router = useRouter();
  const [booking, setBooking] = useState<Mentor | null>(null);
  const [slotIdx, setSlotIdx] = useState(0);
  const [topic, setTopic] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upcoming = useMemo(
    () =>
      bookings.filter(
        (b) =>
          b.status === 'upcoming' &&
          new Date(b.scheduledAt).getTime() > Date.now() - 60 * 60 * 1000,
      ),
    [bookings],
  );

  async function confirmBooking() {
    if (!booking) return;
    setBusy(true);
    setError(null);
    const slot = booking.slots[slotIdx];
    try {
      const res = await fetch('/api/learn/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId: booking.id,
          scheduledAt: slotDate(slot.dayOffset, slot.time).toISOString(),
          topic: topic || `Mentorship with ${booking.name}`,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          data.error === 'db_unavailable'
            ? 'Could not save your booking - database unavailable. Try again shortly.'
            : 'Could not create the booking. Please try again.',
        );
        return;
      }
      setBooking(null);
      setTopic('');
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function cancel(id: string) {
    await fetch(`/api/learn/bookings/${id}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <>
      {/* My sessions */}
      {upcoming.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 font-display text-[21px]">My upcoming sessions</h2>
          <div className="space-y-3">
            {upcoming.map((b) => {
              const when = new Date(b.scheduledAt);
              const joinable = when.getTime() - Date.now() < 15 * 60 * 1000;
              return (
                <div
                  key={b.id}
                  className="flex flex-wrap items-center gap-4 rounded-2xl border p-4"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: 'rgba(0,179,105,0.1)', color: 'var(--green-deep)' }}
                  >
                    <CalendarClock size={19} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14.5px] font-semibold">{b.topic}</div>
                    <div className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                      with {b.mentorName} · {fmtSlot(when)} · {b.durationMinutes} min
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/sessions/${b.channel}`}
                      className="btn btn-primary !px-5 !py-2.5 text-[13px]"
                      title={joinable ? 'Join now' : 'Room opens 15 minutes before start'}
                    >
                      <Video size={15} /> Join room
                    </Link>
                    <button
                      onClick={() => cancel(b.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border"
                      style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
                      title="Cancel session"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Instructor directory - editorial rows */}
      <section>
        <div className="mb-4 border-b pb-3" style={{ borderColor: 'var(--line)' }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
            Directory
          </p>
          <h2 className="font-display text-[22px]">Meet your instructors</h2>
        </div>
        <ul className="divide-y" style={{ borderColor: 'var(--line)' }}>
          {mentors.map((m, index) => (
            <li key={m.id} className="group">
              <div className="grid gap-5 py-8 sm:grid-cols-[88px_1fr_auto] sm:items-center sm:gap-8">
                <Link
                  href={`/dashboard/mentorship/${m.id}`}
                  className="relative flex h-[88px] w-[88px] items-end overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, ${m.accent} 0%, ${m.accent}88 45%, #0C1116 100%)`,
                  }}
                >
                  {m.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.avatarUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <span className="relative z-[1] p-3 font-display text-[28px] leading-none text-white/95">
                      {m.initials}
                    </span>
                  )}
                  <span className="absolute right-2 top-2 font-mono text-[10px] text-white/55">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </Link>
                <div className="min-w-0">
                  <Link
                    href={`/dashboard/mentorship/${m.id}`}
                    className="font-display text-[22px] leading-tight transition-opacity group-hover:opacity-80 sm:text-[26px]"
                  >
                    {m.name}
                  </Link>
                  <p className="mt-1 max-w-[540px] text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                    {m.title}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
                    <span className="inline-flex items-center gap-1">
                      <Star size={11} /> {m.rating}
                    </span>
                    <span>{m.sessionsCompleted} sessions</span>
                    <span>{m.priceXAF.toLocaleString()} XAF / {m.sessionMinutes} min</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-stretch lg:flex-row">
                  <Link
                    href={`/dashboard/mentorship/${m.id}`}
                    className="inline-flex items-center justify-center gap-1.5 border px-4 py-2.5 text-[13px] font-semibold"
                    style={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}
                  >
                    View profile
                  </Link>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-white"
                    style={{ background: m.accent || 'var(--ink)' }}
                    onClick={() => {
                      setBooking(m);
                      setSlotIdx(0);
                      setError(null);
                    }}
                  >
                    Book session
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Booking modal */}
      <AnimatePresence>
        {booking && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !busy && setBooking(null)}
          >
            <motion.div
              className="w-full max-w-[460px] rounded-3xl bg-paper p-6"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-[21px]">Book {booking.name.split(' ')[0]}</h3>
                  <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                    {booking.sessionMinutes}-minute live video session ·{' '}
                    {booking.priceXAF.toLocaleString()} XAF
                  </p>
                </div>
                <button
                  onClick={() => setBooking(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: 'var(--paper-dim)' }}
                >
                  <X size={15} />
                </button>
              </div>

              <label className="mb-1.5 block text-[13px] font-semibold">Pick a time</label>
              <div className="mb-4 grid gap-2">
                {booking.slots.map((s, i) => {
                  const d = slotDate(s.dayOffset, s.time);
                  const active = i === slotIdx;
                  return (
                    <button
                      key={`${s.dayOffset}-${s.time}`}
                      onClick={() => setSlotIdx(i)}
                      className="flex items-center justify-between rounded-xl border px-4 py-3 text-left text-[13.5px]"
                      style={
                        active
                          ? { borderColor: 'var(--green)', background: 'rgba(0,179,105,0.07)', fontWeight: 600 }
                          : { borderColor: 'var(--line)' }
                      }
                    >
                      {fmtSlot(d)}
                      {active && <span style={{ color: 'var(--green-deep)' }}>✓</span>}
                    </button>
                  );
                })}
              </div>

              <label className="mb-1.5 block text-[13px] font-semibold">
                What do you want to work on?
              </label>
              <textarea
                className="form-input"
                rows={2}
                placeholder="e.g. Review my portfolio project and plan my next steps"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />

              {error && (
                <p className="mt-3 text-[13px]" style={{ color: '#a14d18' }}>
                  {error}
                </p>
              )}

              <button
                onClick={confirmBooking}
                disabled={busy}
                className="btn btn-primary mt-5 w-full !py-3.5 text-[14px]"
              >
                {busy ? <Loader2 size={16} className="animate-spin" /> : <Video size={16} />}
                Confirm booking
              </button>
              <p className="mt-3 text-center text-[11.5px]" style={{ color: 'var(--ink-soft)' }}>
                You&apos;ll join the session from your dashboard - live HD video powered by Agora.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
