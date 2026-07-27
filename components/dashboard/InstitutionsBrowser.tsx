'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Check, Loader2, Mail, MessageCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { InstitutionDoc } from '@/lib/learn/ecosystem';
import {
  PLATFORM_CONTACT,
  institutionMailto,
  institutionWhatsappLink,
} from '@/lib/contact';

export default function InstitutionsBrowser({
  institutions,
  memberOf,
}: {
  institutions: InstitutionDoc[];
  memberOf: string[];
}) {
  const router = useRouter();
  const memberSet = new Set(memberOf);
  const [joining, setJoining] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return institutions;
    return institutions.filter((i) =>
      `${i.name} ${i.tagline} ${i.about} ${i.country || ''}`.toLowerCase().includes(q),
    );
  }, [institutions, query]);

  async function join(slug: string) {
    setJoining(slug);
    try {
      const res = await fetch(`/api/learn/institutions/${slug}/affiliate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        router.push(data.redirectTo || `/dashboard/institutions/${slug}`);
        router.refresh();
      }
    } finally {
      setJoining(null);
    }
  }

  return (
    <div>
      <div className="mb-10 flex flex-col gap-6 border-b pb-8 sm:flex-row sm:items-end sm:justify-between" style={{ borderColor: 'var(--line)' }}>
        <div className="max-w-[520px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-soft)' }}>
            Partner campuses
          </p>
          <p className="mt-2 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            Enter a campus with your InTelleX identity. Schools are provisioned by the Platform
            Team - never spun up from a button here.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={institutionMailto()} className="inline-flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--ink)' }}>
            <Mail size={14} /> {PLATFORM_CONTACT.email}
          </a>
          <span style={{ color: 'var(--line)' }}>·</span>
          <a
            href={institutionWhatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[13px] font-semibold"
            style={{ color: 'var(--ink)' }}
          >
            <MessageCircle size={14} /> WhatsApp
          </a>
        </div>
      </div>

      <div className="mb-6">
        <label className="sr-only" htmlFor="campus-search">
          Search campuses
        </label>
        <input
          id="campus-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, country, or focus…"
          className="form-input w-full max-w-md !rounded-none border-0 border-b !px-0 !py-3 text-[16px] !shadow-none"
          style={{ borderColor: 'var(--line)', background: 'transparent' }}
        />
      </div>

      <ul className="divide-y" style={{ borderColor: 'var(--line)' }}>
        {filtered.map((inst, index) => {
          const isMember = memberSet.has(inst.slug);
          const initial = (inst.name || 'I').charAt(0).toUpperCase();
          return (
            <li key={inst.slug} className="group">
              <div className="grid gap-5 py-8 sm:grid-cols-[88px_1fr_auto] sm:items-center sm:gap-8">
                <div
                  className="relative flex h-[88px] w-[88px] items-end overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, ${inst.color} 0%, ${inst.color}88 45%, #0C1116 100%)`,
                  }}
                >
                  {inst.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={inst.logoUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
                  ) : (
                    <span className="relative z-[1] p-3 font-display text-[34px] leading-none text-white/95">
                      {initial}
                    </span>
                  )}
                  <span className="absolute right-2 top-2 font-mono text-[10px] text-white/55">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <Link
                      href={`/dashboard/institutions/${inst.slug}`}
                      className="font-display text-[22px] leading-tight transition-opacity group-hover:opacity-80 sm:text-[26px]"
                    >
                      {inst.name}
                    </Link>
                    {isMember && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: inst.color }}>
                        <Check size={11} /> Affiliated
                      </span>
                    )}
                  </div>
                  <p className="max-w-[540px] text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                    {inst.tagline || inst.about}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
                    <span>{inst.memberCount.toLocaleString()} members</span>
                    {inst.country ? <span>{inst.country}</span> : null}
                    <span>{inst.visibility === 'public' ? 'Public campus' : 'Private campus'}</span>
                    {inst.authMethod === 'matricule' ? <span>Matricule verify</span> : <span>Open join</span>}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-stretch lg:flex-row">
                  <Link
                    href={`/dashboard/institutions/${inst.slug}`}
                    className="inline-flex items-center justify-center gap-1.5 border px-4 py-2.5 text-[13px] font-semibold transition-colors"
                    style={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}
                  >
                    Enter campus <ArrowUpRight size={14} />
                  </Link>
                  {!isMember && (
                    <button
                      type="button"
                      onClick={() => join(inst.slug)}
                      disabled={joining === inst.slug}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
                      style={{ background: inst.color || 'var(--ink)' }}
                    >
                      {joining === inst.slug ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : inst.authMethod === 'matricule' ? (
                        'Verify & join'
                      ) : (
                        'Join'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 && (
        <div className="border-t py-16 text-center" style={{ borderColor: 'var(--line)' }}>
          <p className="font-display text-[22px]">No campuses match</p>
          <p className="mt-2 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            Try another search, or ask the Platform Team to provision your school.
          </p>
        </div>
      )}
    </div>
  );
}
