'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, Save } from 'lucide-react';

export default function PortfolioEditor({
  initialBio,
  initialSkills,
  initialGoals,
  initialPublic,
  initialSlug,
  publicUrl,
}: {
  initialBio: string;
  initialSkills: string[];
  initialGoals: string[];
  initialPublic: boolean;
  initialSlug: string;
  publicUrl: string | null;
}) {
  const router = useRouter();
  const [bio, setBio] = useState(initialBio);
  const [skills, setSkills] = useState(initialSkills.join(', '));
  const [goals, setGoals] = useState(initialGoals.join('\n'));
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [slug, setSlug] = useState(initialSlug);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [shareUrl, setShareUrl] = useState(publicUrl);

  async function save() {
    setBusy(true);
    setSaved(false);
    setError('');
    try {
      const res = await fetch('/api/learn/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio,
          skills: skills
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          goals: goals
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean),
          portfolioPublic: isPublic,
          portfolioSlug: slug,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error === 'slug_taken' ? 'That public URL is taken.' : 'Could not save.');
        return;
      }
      setShareUrl(data.portfolio?.publicUrl || null);
      setSaved(true);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mb-8 border p-4" style={{ borderColor: 'var(--line)' }}>
      <h2 className="mb-3 font-display text-[20px]">Skills & goals</h2>
      <label className="mb-1.5 block text-[13px] font-semibold">Bio</label>
      <textarea
        className="form-input mb-4 !rounded-none min-h-[80px]"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Short professional summary…"
      />
      <label className="mb-1.5 block text-[13px] font-semibold">Skills (comma-separated)</label>
      <input
        className="form-input mb-4 !rounded-none"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        placeholder="Python, Research, Public speaking"
      />
      <label className="mb-1.5 block text-[13px] font-semibold">Learning goals (one per line)</label>
      <textarea
        className="form-input mb-4 !rounded-none min-h-[80px]"
        value={goals}
        onChange={(e) => setGoals(e.target.value)}
        placeholder="Finish data science track&#10;Publish portfolio project"
      />
      <label className="mb-1.5 block text-[13px] font-semibold">Public slug</label>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          /p/
        </span>
        <input
          className="form-input !rounded-none max-w-xs"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
      </div>
      <label className="mb-4 flex items-start gap-3 text-[14px]">
        <input
          type="checkbox"
          className="mt-1"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        <span>Make portfolio public (shareable link)</span>
      </label>
      {shareUrl ? (
        <p className="mb-3 text-[13px]">
          Public link:{' '}
          <a href={shareUrl} className="font-semibold" style={{ color: 'var(--green-deep)' }}>
            {shareUrl}
          </a>
        </p>
      ) : null}
      {error ? (
        <p className="mb-2 text-[13px]" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      ) : null}
      <button
        type="button"
        disabled={busy}
        onClick={save}
        className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white"
        style={{ background: 'var(--green)' }}
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
        {saved ? 'Saved' : 'Save career profile'}
      </button>
    </div>
  );
}
