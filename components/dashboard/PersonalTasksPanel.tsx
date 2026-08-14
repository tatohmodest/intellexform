'use client';

import { useEffect, useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';

type Task = {
  id: string;
  title: string;
  done: boolean;
  dueAt: string | null;
  source: 'personal';
};

export default function PersonalTasksPanel({ accent = '#00b369' }: { accent?: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/learn/tasks');
      const data = await res.json();
      setTasks(data.tasks || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load().catch(() => setLoading(false));
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    try {
      const res = await fetch('/api/learn/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      if (res.ok && data.task) {
        setTasks((t) => [data.task, ...t]);
        setTitle('');
      }
    } finally {
      setBusy(false);
    }
  }

  async function toggle(id: string, done: boolean) {
    const res = await fetch('/api/learn/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, done }),
    });
    const data = await res.json();
    if (res.ok && data.task) {
      setTasks((list) => list.map((t) => (t.id === id ? data.task : t)));
    }
  }

  async function remove(id: string) {
    await fetch(`/api/learn/tasks?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    setTasks((list) => list.filter((t) => t.id !== id));
  }

  return (
    <section className="space-y-4 border p-4" style={{ borderColor: 'var(--line)' }}>
      <h2 className="font-display text-[18px]">Personal tasks</h2>
      <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
        Study reminders and goals you add yourself — separate from institutional assignments.
      </p>
      <form onSubmit={add} className="flex flex-wrap gap-2">
        <input
          className="form-input !rounded-none min-w-[200px] flex-1"
          placeholder="Finish Module 5…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-1 px-3 py-2 text-[13px] font-semibold text-white"
          style={{ background: accent }}
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          Add
        </button>
      </form>
      {loading ? (
        <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          Loading…
        </p>
      ) : tasks.length === 0 ? (
        <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          No personal tasks yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((t) => (
            <li key={t.id} className="flex items-center gap-3 border px-3 py-2" style={{ borderColor: 'var(--line)' }}>
              <input
                type="checkbox"
                checked={t.done}
                onChange={(e) => toggle(t.id, e.target.checked)}
              />
              <span className={`flex-1 text-[14px] ${t.done ? 'line-through opacity-50' : ''}`}>
                {t.title}
              </span>
              <button type="button" onClick={() => remove(t.id)} aria-label="Delete">
                <Trash2 size={14} style={{ color: 'var(--ink-soft)' }} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
