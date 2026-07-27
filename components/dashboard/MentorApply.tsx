'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Loader2, Plus, Sparkles, X } from 'lucide-react';

const DAYS = ['Today', 'Tomorrow', 'In 2 days', 'In 3 days', 'In 4 days', 'In 5 days', 'In 6 days'];

export default function MentorApply() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [priceXAF, setPriceXAF] = useState(4000);
  const [sessionMinutes, setSessionMinutes] = useState(45);
  const [slots, setSlots] = useState<{ dayOffset: number; time: string }[]>([
    { dayOffset: 1, time: '18:00' },
  ]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function addSkill() {
    const s = skillInput.trim();
    if (s && !expertise.includes(s) && expertise.length < 6) {
      setExpertise([...expertise, s]);
    }
    setSkillInput('');
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/learn/mentor/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, bio, expertise, priceXAF, sessionMinutes, slots }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          data.error === 'missing_fields'
            ? 'Please fill in your title, bio, at least one skill and one availability slot.'
            : 'Could not create your mentor profile. Please try again.',
        );
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-[640px]">
      <div className="mb-8 text-center">
        <span
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl"
          style={{ background: 'rgba(0,179,105,0.12)', color: 'var(--green-deep)' }}
        >
          <GraduationCap size={30} />
        </span>
        <h1 className="font-display text-[28px] leading-tight">Teach on Intellex</h1>
        <p className="mx-auto mt-2 max-w-md text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Open your Mentor Studio: run paid 1-on-1 sessions over live video, publish and
          sell books in the library, and build your reputation across the ecosystem.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="space-y-5 rounded-3xl border p-6 sm:p-8"
        style={{ borderColor: 'var(--line)' }}
      >
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold">Professional title</label>
          <input
            className="form-input"
            placeholder="e.g. Senior Backend Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold">Bio</label>
          <textarea
            className="form-input"
            rows={3}
            placeholder="What have you built? What can you help students achieve?"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold">Skills (up to 6)</label>
          <div className="flex gap-2">
            <input
              className="form-input"
              placeholder="e.g. Node.js"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
            <button type="button" onClick={addSkill} className="btn btn-ghost !px-4 !py-2">
              <Plus size={15} />
            </button>
          </div>
          {expertise.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {expertise.map((s) => (
                <span
                  key={s}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium"
                  style={{ background: 'rgba(0,179,105,0.1)', color: 'var(--green-deep)' }}
                >
                  {s}
                  <button type="button" onClick={() => setExpertise(expertise.filter((x) => x !== s))}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold">Session price (XAF)</label>
            <input
              type="number"
              min={0}
              step={500}
              className="form-input"
              value={priceXAF}
              onChange={(e) => setPriceXAF(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold">Session length</label>
            <select
              className="form-input"
              value={sessionMinutes}
              onChange={(e) => setSessionMinutes(Number(e.target.value))}
            >
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-semibold">Weekly availability</label>
          <div className="space-y-2">
            {slots.map((slot, i) => (
              <div key={i} className="flex items-center gap-2">
                <select
                  className="form-input"
                  value={slot.dayOffset}
                  onChange={(e) => {
                    const copy = [...slots];
                    copy[i] = { ...copy[i], dayOffset: Number(e.target.value) };
                    setSlots(copy);
                  }}
                >
                  {DAYS.map((d, di) => (
                    <option key={d} value={di}>
                      {d}
                    </option>
                  ))}
                </select>
                <input
                  type="time"
                  className="form-input"
                  value={slot.time}
                  onChange={(e) => {
                    const copy = [...slots];
                    copy[i] = { ...copy[i], time: e.target.value };
                    setSlots(copy);
                  }}
                />
                {slots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setSlots(slots.filter((_, si) => si !== i))}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
                    style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {slots.length < 10 && (
            <button
              type="button"
              onClick={() => setSlots([...slots, { dayOffset: 2, time: '18:00' }])}
              className="mt-2 flex items-center gap-1.5 text-[13px] font-semibold"
              style={{ color: 'var(--green-deep)' }}
            >
              <Plus size={13} /> Add slot
            </button>
          )}
        </div>

        {error && (
          <p className="rounded-xl px-4 py-3 text-[13px]" style={{ background: 'rgba(196,98,42,0.08)', color: '#a14d18' }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={busy} className="btn btn-primary w-full !py-3.5 text-[14px]">
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          Open my Mentor Studio
        </button>
      </form>
    </div>
  );
}
