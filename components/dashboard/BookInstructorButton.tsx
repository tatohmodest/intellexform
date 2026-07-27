'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus } from 'lucide-react';
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

  async function confirm() {
    if (!mentor.slots[slotIdx]) {
      setError('No open slots right now.');
      return;
    }
    setBusy(true);
    setError(null);
    const slot = mentor.slots[slotIdx];
    try {
      const res = await fetch('/api/learn/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId: mentor.id,
          scheduledAt: slotDate(slot.dayOffset, slot.time).toISOString(),
          topic: topic || `Mentorship with ${mentor.name}`,
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
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md space-y-4 border p-6"
            style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-[22px]">Book {mentor.name}</h3>
            {mentor.slots.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
                This instructor has no open slots right now.
              </p>
            ) : (
              <div className="space-y-2">
                {mentor.slots.map((s, i) => (
                  <button
                    key={`${s.dayOffset}-${s.time}`}
                    type="button"
                    onClick={() => setSlotIdx(i)}
                    className="w-full border px-3 py-2 text-left text-sm"
                    style={{
                      borderColor: slotIdx === i ? 'var(--green-deep)' : 'var(--line)',
                      background: slotIdx === i ? 'rgba(0,179,105,0.08)' : 'transparent',
                    }}
                  >
                    {fmtSlot(slotDate(s.dayOffset, s.time))}
                  </button>
                ))}
              </div>
            )}
            <input
              className="form-input !rounded-none"
              placeholder="What do you want to work on?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
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
                {busy ? <Loader2 size={14} className="animate-spin" /> : null}
                Confirm
              </button>
              <button type="button" className="btn btn-ghost !rounded-none" onClick={() => setOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
