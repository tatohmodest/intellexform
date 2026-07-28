/** Shared countdown formatting for assignment deadlines. */

export type CountdownState = {
  expired: boolean;
  label: string | null;
  msLeft: number | null;
};

export function formatCountdown(dueAt: string | Date | null | undefined, now = Date.now()): CountdownState {
  if (!dueAt) return { expired: false, label: null, msLeft: null };
  const target = new Date(dueAt).getTime();
  if (!Number.isFinite(target)) return { expired: false, label: null, msLeft: null };
  const msLeft = target - now;
  if (msLeft <= 0) return { expired: true, label: 'Deadline passed', msLeft: 0 };
  const totalSec = Math.floor(msLeft / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  const label =
    d > 0 ? `${d}d ${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(h)}:${pad(m)}:${pad(s)}`;
  return { expired: false, label, msLeft };
}

/** datetime-local value from ISO / Date (local timezone). */
export function toDatetimeLocalValue(value: string | Date | null | undefined): string {
  if (!value) return '';
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
