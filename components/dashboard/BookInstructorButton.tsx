'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock, Plus } from 'lucide-react';
import type { Mentor } from '@/lib/learn/mentors';

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

export default function BookInstructorButton({ mentor }: { mentor: Mentor }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [slotIdx, setSlotIdx] = useState(0);
  const [topic, setTopic] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isPaid = (mentor.priceXAF || 0) > 0;

  async function confirm() {
    if (!mentor.slots[slotIdx]) {
      setError('No open slots right now.');
      return;
    }
    setBusy(true);
    setError(null);
    const slot = mentor.slots[slotIdx];
    const scheduledAt = slotDate(slot.dayOffset, slot.time).toISOString();
    const topicText = topic || `Mentorship with ${mentor.name}`;
    try {
      if (isPaid) {
        const res = await fetch('/api/payments/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            kind: 'session_booking',
            mentorId: mentor.id,
            scheduledAt,
            topic: topicText,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.transactionUrl) {
          setError(data.error || 'Could not start payment');
          return;
        }
        window.location.href = data.transactionUrl;
        return;
      }

      const res = await fetch('/api/learn/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId: mentor.id,
          scheduledAt,
          topic: topicText,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Booking failed');
        return;
      }
      setOpen(false);
      router.refresh();
      router.push('/dashboard/mentorship');
    } catch {
      setError('Could not book. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-[13.5px] font-semibold text-white"
        style={{ background: 'rgba(255,255,255,0.18)' }}
      >
        <Plus size={15} /> Book session
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center"
          style={{ background: 'rgba(12,17,22,0.55)' }}
          onClick={() => !busy && setOpen(false)}
        >
          <div
            className="w-full max-w-md space-y-4 border p-6"
            style={{ borderColor: 'var(--line)', background: 'var(--paper)', color: 'var(--ink)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="font-display text-[22px]" style={{ color: 'var(--ink)' }}>
                Book {mentor.name}
              </h3>
              <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                {mentor.sessionMinutes}-minute live session
                {isPaid ? ` · ${mentor.priceXAF.toLocaleString()} XAF` : ' · Free'}
              </p>
            </div>
            {mentor.slots.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
                This instructor has no open slots right now.
              </p>
            ) : (
              <div className="space-y-2">
                <label className="block text-[13px] font-semibold" style={{ color: 'var(--ink)' }}>
                  Pick a time
                </label>
                {mentor.slots.map((s, i) => {
                  const active = slotIdx === i;
                  return (
                    <button
                      key={`${s.dayOffset}-${s.time}`}
                      type="button"
                      onClick={() => setSlotIdx(i)}
                      className="w-full border px-3 py-2.5 text-left text-sm font-medium"
                      style={{
                        borderColor: active ? 'var(--green-deep)' : 'var(--line)',
                        background: active ? 'rgba(0,179,105,0.1)' : 'var(--paper)',
                        color: 'var(--ink)',
                      }}
                    >
                      {fmtSlot(slotDate(s.dayOffset, s.time))}
                    </button>
                  );
                })}
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold" style={{ color: 'var(--ink)' }}>
                What do you want to work on?
              </label>
              <input
                className="form-input !rounded-none"
                style={{ color: 'var(--ink)', background: 'var(--paper)' }}
                placeholder="e.g. Review my project plan"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            {error ? (
              <p className="text-sm" style={{ color: '#b91c1c' }}>
                {error}
              </p>
            ) : null}
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-primary flex-1 !rounded-none"
                disabled={busy || mentor.slots.length === 0}
                onClick={confirm}
              >
                {busy ? <Loader2 size={14} className="animate-spin" /> : isPaid ? <Lock size={14} /> : null}
                {isPaid ? `Pay ${mentor.priceXAF.toLocaleString()} XAF` : 'Confirm'}
              </button>
              <button
                type="button"
                className="btn btn-ghost !rounded-none"
                disabled={busy}
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
            {isPaid && (
              <p className="text-center text-[11.5px]" style={{ color: 'var(--ink-soft)' }}>
                You pay first with PayUnit. The session is booked only after payment succeeds.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
