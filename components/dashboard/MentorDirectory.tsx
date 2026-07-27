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

      {/* Mentor grid */}
      <section>
        <h2 className="mb-4 font-display text-[21px]">Meet your mentors</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {mentors.map((m) => (
            <div
              key={m.id}
              className="flex flex-col rounded-2xl border p-5 transition-shadow hover:shadow-card"
              style={{ borderColor: 'var(--line)' }}
            >
              <div className="mb-3 flex items-start gap-3.5">
                <span
                  className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl p-3 text-[16px] font-bold text-white"
                  style={{ background: m.accent, height: 52, width: 52 }}
                >
                  {m.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[15.5px] font-semibold">{m.name}</div>
                  <div className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                    {m.title}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                    <span className="flex items-center gap-1 font-semibold" style={{ color: '#b7791f' }}>
                      <Star size={12} fill="currentColor" /> {m.rating}
                    </span>
                    <span>{m.sessionsCompleted} sessions</span>
                    <span className="flex items-center gap-1">
                      <Globe2 size={11} /> {m.languages.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
              <p className="mb-3 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                {m.bio}
              </p>
              <div className="mb-4 flex flex-wrap gap-1.5">
                {m.expertise.map((e) => (
                  <span
                    key={e}
                    className="rounded-full px-2.5 py-1 text-[11.5px] font-medium"
                    style={{ background: 'var(--paper-dim)', color: 'var(--ink-soft)' }}
                  >
                    {e}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between">
                <div>
                  <span className="font-display text-[18px]">{m.priceXAF.toLocaleString()} XAF</span>
                  <span className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                    {' '}/ {m.sessionMinutes} min
                  </span>
                </div>
                <button
                  className="btn btn-primary !px-5 !py-2.5 text-[13px]"
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
          ))}
        </div>
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
