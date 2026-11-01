'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CalendarClock,
  Loader2,
  Star,
  Video,
  X,
  XCircle,
} from 'lucide-react';
import type { Mentor } from '@/lib/learn/mentors';
import DirectPayForm from '@/components/payments/DirectPayForm';

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
    const scheduledAt = slotDate(slot.dayOffset, slot.time).toISOString();
    const topicText = topic || `Mentorship with ${booking.name}`;
    try {
      const res = await fetch('/api/learn/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId: booking.id,
          scheduledAt,
          topic: topicText,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          data.error === 'db_unavailable'
            ? 'Could not save your booking - database unavailable. Try again shortly.'
            : data.error === 'payment_required'
              ? 'Pay for this session first.'
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
          <h2 className="mb-4 text-[22px] font-bold text-[var(--navy)]">My upcoming sessions</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {upcoming.map((b, i) => {
              const when = new Date(b.scheduledAt);
              const joinable = when.getTime() - Date.now() < 15 * 60 * 1000;
              return (
                <div
                  key={b.id}
                  className="flex flex-wrap items-center gap-4 rounded-3xl p-4"
                  style={{ background: ['var(--pastel-mint)', 'var(--pastel-sky)', 'var(--pastel-butter)', 'var(--pastel-lilac)'][i % 4] }}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[var(--green-deep)]">
                    <CalendarClock size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[15px] font-bold text-[var(--navy)]">{b.topic}</div>
                    <div className="text-[13px] text-[var(--navy)]/70">
                      with {b.mentorName} · {fmtSlot(when)} · {b.durationMinutes} min
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/sessions/${b.channel}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--navy)] px-4 py-2.5 text-[13px] font-semibold text-white"
                      title={joinable ? 'Join now' : 'Room opens 15 minutes before start'}
                    >
                      <Video size={15} /> Join room
                    </Link>
                    <button
                      onClick={() => cancel(b.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 text-[var(--navy)]/70 hover:bg-white"
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

      {/* Instructor directory */}
      <section>
        <div className="mb-5">
          <div className="text-[13px] font-semibold text-[var(--green-deep)]">Directory</div>
          <h2 className="mt-1 text-[24px] font-bold text-[var(--navy)]">Meet your instructors</h2>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {mentors.map((m) => (
            <li key={m.id} className="group flex flex-col rounded-3xl bg-white p-3 transition-shadow hover:shadow-[0_18px_40px_-26px_rgba(18,50,79,0.5)]">
              <Link
                href={`/dashboard/mentorship/${m.id}`}
                className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl"
                style={{ background: `${m.accent || '#00b369'}22` }}
              >
                {m.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.avatarUrl}
                    alt={m.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <span
                    className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-[28px] font-extrabold shadow-[0_12px_28px_-16px_rgba(18,50,79,0.5)]"
                    style={{ color: m.accent || 'var(--navy)' }}
                  >
                    {m.initials}
                  </span>
                )}
                {m.introVideoUrl && (
                  <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11.5px] font-semibold text-[var(--navy)]">
                    <Video size={12} /> Intro video
                  </span>
                )}
              </Link>
              <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-4">
                <Link href={`/dashboard/mentorship/${m.id}`} className="text-[18px] font-bold leading-tight text-[var(--navy)] hover:text-[var(--green-deep)]">
                  {m.name}
                </Link>
                <p className="mt-1 line-clamp-2 text-[14px] leading-relaxed text-[var(--ink-soft)]">{m.title}</p>
                {m.instructorBadge && (
                  <span className="mt-2.5 inline-flex w-fit items-center gap-1 rounded-full bg-[var(--pastel-mint)] px-2.5 py-1 text-[12px] font-semibold text-[var(--green-deep)]">
                    {m.instructorBadge}
                  </span>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5 text-[12px] text-[var(--navy)]/75">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--paper-dim)] px-2.5 py-1">
                    <Star size={12} className="text-[#f5a524]" /> {m.rating}
                  </span>
                  <span className="rounded-full bg-[var(--paper-dim)] px-2.5 py-1">{m.sessionsCompleted} sessions</span>
                  <span className="rounded-full bg-[var(--paper-dim)] px-2.5 py-1">
                    {m.priceXAF.toLocaleString()} XAF / {m.sessionMinutes} min
                  </span>
                </div>
                <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
                  <Link
                    href={`/dashboard/mentorship/${m.id}`}
                    className="inline-flex items-center justify-center rounded-xl bg-[var(--paper-dim)] px-3 py-2.5 text-[13px] font-semibold text-[var(--navy)] hover:bg-[var(--pastel-sky)]"
                  >
                    View profile
                  </Link>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl bg-[var(--green)] px-3 py-2.5 text-[13px] font-semibold text-white hover:bg-[var(--green-deep)]"
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
              className="w-full max-w-[460px] rounded-3xl p-6"
              style={{ background: 'var(--paper)', color: 'var(--ink)' }}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-[21px]" style={{ color: 'var(--ink)' }}>
                    Book {booking.name.split(' ')[0]}
                  </h3>
                  <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                    {booking.sessionMinutes}-minute live video session ·{' '}
                    {booking.priceXAF > 0
                      ? `${booking.priceXAF.toLocaleString()} XAF`
                      : 'Free'}
                  </p>
                </div>
                <button
                  onClick={() => setBooking(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: 'var(--paper-dim)', color: 'var(--ink)' }}
                >
                  <X size={15} />
                </button>
              </div>

              <label className="mb-1.5 block text-[13px] font-semibold" style={{ color: 'var(--ink)' }}>
                Pick a time
              </label>
              <div className="mb-4 grid gap-2">
                {booking.slots.map((s, i) => {
                  const d = slotDate(s.dayOffset, s.time);
                  const active = i === slotIdx;
                  return (
                    <button
                      key={`${s.dayOffset}-${s.time}`}
                      onClick={() => setSlotIdx(i)}
                      className="flex items-center justify-between rounded-xl border px-4 py-3 text-left text-[13.5px] font-medium"
                      style={{
                        borderColor: active ? 'var(--green-deep)' : 'var(--line)',
                        background: active ? 'rgba(0,179,105,0.1)' : 'var(--paper)',
                        color: 'var(--ink)',
                        fontWeight: active ? 600 : 500,
                      }}
                    >
                      <span style={{ color: 'var(--ink)' }}>{fmtSlot(d)}</span>
                      {active && <span style={{ color: 'var(--green-deep)' }}>✓</span>}
                    </button>
                  );
                })}
              </div>

              <label className="mb-1.5 block text-[13px] font-semibold" style={{ color: 'var(--ink)' }}>
                What do you want to work on?
              </label>
              <textarea
                className="form-input"
                style={{ color: 'var(--ink)', background: 'var(--paper)' }}
                rows={2}
                placeholder="e.g. Review my portfolio project and plan my next steps"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />

              {error && (
                <p className="mt-3 text-[13px]" style={{ color: '#b91c1c' }}>
                  {error}
                </p>
              )}

              {booking.priceXAF > 0 && booking.slots[slotIdx] ? (
                <div className="mt-5">
                  <DirectPayForm
                    key={`${booking.id}-${slotIdx}`}
                    amountXAF={booking.priceXAF}
                    label="Pay & book"
                    extraBody={{
                      kind: 'session_booking',
                      mentorId: booking.id,
                      scheduledAt: slotDate(booking.slots[slotIdx].dayOffset, booking.slots[slotIdx].time).toISOString(),
                      topic: topic || `Mentorship with ${booking.name}`,
                    }}
                    onPaid={() => {
                      setBooking(null);
                      setTopic('');
                      router.refresh();
                    }}
                  />
                  <p className="mt-3 text-center text-[11.5px]" style={{ color: 'var(--ink-soft)' }}>
                    Approve MTN MoMo or Orange Money on your phone. Your session is booked only after payment succeeds.
                  </p>
                </div>
              ) : (
                <>
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
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
