'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Check, Loader2, Mail, MessageCircle, Plus, Users } from 'lucide-react';
import { useState } from 'react';
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
    <>
      <div
        className="mb-8 rounded-3xl border p-6 sm:p-7"
        style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
      >
        <h2 className="font-display text-[20px]">Bring your institution to InTelleX</h2>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          Campuses are never created from this dashboard. The InTelleX Platform Team reviews,
          provisions, and connects each partner — branding, authentication, and dedicated
          environment included.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={institutionMailto()} className="btn btn-primary !py-2.5 text-[13.5px]">
            <Mail size={15} /> {PLATFORM_CONTACT.email}
          </a>
          <a
            href={institutionWhatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost !py-2.5 text-[13.5px]"
          >
            <MessageCircle size={15} /> WhatsApp {PLATFORM_CONTACT.phoneDisplay}
          </a>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {institutions.map((inst) => {
          const isMember = memberSet.has(inst.slug);
          return (
            <div
              key={inst.slug}
              className="overflow-hidden rounded-2xl border transition-shadow hover:shadow-card"
              style={{ borderColor: 'var(--line)' }}
            >
              <div className="h-2" style={{ background: inst.color }} />
              <div className="p-5">
                <div className="mb-3 flex items-center gap-3.5">
                  <span
                    className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl font-display text-[18px] font-semibold"
                    style={{ background: `${inst.color}18`, color: inst.color }}
                  >
                    {inst.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={inst.logoUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      (inst.name || 'I').charAt(0).toUpperCase()
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link href={`/dashboard/institutions/${inst.slug}`}>
                      <div className="truncate text-[15.5px] font-semibold">{inst.name}</div>
                    </Link>
                    <div className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                      <Users size={11} /> {inst.memberCount.toLocaleString()} member
                      {inst.memberCount === 1 ? '' : 's'}
                    </div>
                  </div>
                </div>
                <p className="mb-4 line-clamp-2 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                  {inst.tagline || inst.about}
                </p>
                <div className="flex items-center gap-2.5">
                  <Link
                    href={`/dashboard/institutions/${inst.slug}`}
                    className="btn btn-ghost !px-4 !py-2 text-[12.5px]"
                  >
                    Visit campus
                  </Link>
                  {isMember ? (
                    <span className="flex items-center gap-1.5 text-[12.5px] font-semibold" style={{ color: inst.color || 'var(--green-deep)' }}>
                      <Check size={13} /> Affiliated
                    </span>
                  ) : (
                    <button
                      onClick={() => join(inst.slug)}
                      disabled={joining === inst.slug}
                      className="btn btn-primary !px-4 !py-2 text-[12.5px]"
                      style={{ background: inst.color }}
                    >
                      {joining === inst.slug ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Plus size={13} />
                      )}
                      {inst.authMethod === 'matricule' ? 'Verify & join' : 'Join campus'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {institutions.length === 0 && (
        <div className="rounded-2xl border border-dashed px-5 py-10 text-center text-sm" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
          <Building2 className="mx-auto mb-3 opacity-50" size={28} />
          No public campuses listed yet. Institutions join through the Platform Team.
        </div>
      )}
    </>
  );
}
