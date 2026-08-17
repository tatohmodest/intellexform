'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Globe, Loader2, Save } from 'lucide-react';

type WebsiteConfig = {
  platformName: string;
  tagline: string;
  about: string;
  ctaLabel: string;
  ctaHref: string;
  showCourses: boolean;
  showCapabilities: boolean;
  showPrograms?: boolean;
  showContact?: boolean;
  showJoin?: boolean;
  heroStyle: 'gradient' | 'cover';
  navLinks: { label: string; href: string }[];
  footerNote: string;
  published: boolean;
  contactBlurb?: string;
  admissionsNote?: string;
};

type Branding = {
  primaryColor: string | null;
  secondaryColor: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  name?: string;
};

export default function CampusWebsiteBuilder({
  slug,
  accent = '#00b369',
}: {
  slug: string;
  accent?: string;
}) {
  const [config, setConfig] = useState<WebsiteConfig | null>(null);
  const [branding, setBranding] = useState<Branding | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    fetch(`/api/org/${encodeURIComponent(slug)}/website`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || 'Failed');
        setConfig(d.config);
        setBranding(d.branding);
        setCanEdit(Boolean(d.canEdit));
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed'))
      .finally(() => setLoading(false));
  }, [slug]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!config) return;
    setBusy(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch(`/api/org/${encodeURIComponent(slug)}/website`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          primaryColor: branding?.primaryColor,
          secondaryColor: branding?.secondaryColor,
          logoUrl: branding?.logoUrl,
          coverUrl: branding?.coverUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save');
      if (data.config) setConfig(data.config);
      if (data.branding) {
        setBranding({
          primaryColor: data.branding.primaryColor ?? null,
          secondaryColor: data.branding.secondaryColor ?? null,
          logoUrl: data.branding.logoUrl ?? null,
          coverUrl: data.branding.coverUrl ?? null,
          name: branding?.name,
        });
      }
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
        Loading website builder…
      </p>
    );
  }

  if (!config) {
    return (
      <p className="text-[13px]" style={{ color: '#b91c1c' }}>
        {error || 'Website settings unavailable'}
      </p>
    );
  }

  if (!canEdit) {
    return (
      <p className="text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
        Only organization owners and admins can edit the public website.
      </p>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Globe size={17} style={{ color: accent }} />
          <h2 className="font-display text-[21px]">Website builder</h2>
        </div>
        <Link
          href={`/site/${slug}`}
          target="_blank"
          className="text-[13px] font-semibold"
          style={{ color: accent }}
        >
          Preview public site →
        </Link>
      </div>

      <form onSubmit={save} className="space-y-4 border p-4" style={{ borderColor: 'var(--line)' }}>
        <label className="block text-[13px]">
          <span className="font-semibold">Platform name</span>
          <input
            className="form-input !rounded-none mt-1"
            value={config.platformName}
            onChange={(e) => setConfig({ ...config, platformName: e.target.value })}
          />
        </label>
        <label className="block text-[13px]">
          <span className="font-semibold">Tagline</span>
          <input
            className="form-input !rounded-none mt-1"
            value={config.tagline}
            onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
          />
        </label>
        <label className="block text-[13px]">
          <span className="font-semibold">About</span>
          <textarea
            className="form-input !rounded-none mt-1"
            rows={4}
            value={config.about}
            onChange={(e) => setConfig({ ...config, about: e.target.value })}
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-[13px]">
            <span className="font-semibold">CTA label</span>
            <input
              className="form-input !rounded-none mt-1"
              value={config.ctaLabel}
              onChange={(e) => setConfig({ ...config, ctaLabel: e.target.value })}
            />
          </label>
          <label className="block text-[13px]">
            <span className="font-semibold">CTA link</span>
            <input
              className="form-input !rounded-none mt-1"
              placeholder={`/login?next=/dashboard/institutions/${slug}`}
              value={config.ctaHref}
              onChange={(e) => setConfig({ ...config, ctaHref: e.target.value })}
            />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-[13px]">
            <span className="font-semibold">Primary color</span>
            <input
              className="form-input !rounded-none mt-1"
              value={branding?.primaryColor || accent}
              onChange={(e) =>
                setBranding((b) => ({
                  primaryColor: e.target.value,
                  secondaryColor: b?.secondaryColor ?? null,
                  logoUrl: b?.logoUrl ?? null,
                  coverUrl: b?.coverUrl ?? null,
                  name: b?.name,
                }))
              }
            />
          </label>
          <label className="block text-[13px]">
            <span className="font-semibold">Cover image URL</span>
            <input
              className="form-input !rounded-none mt-1"
              value={branding?.coverUrl || ''}
              onChange={(e) =>
                setBranding((b) => ({
                  primaryColor: b?.primaryColor ?? null,
                  secondaryColor: b?.secondaryColor ?? null,
                  logoUrl: b?.logoUrl ?? null,
                  coverUrl: e.target.value || null,
                  name: b?.name,
                }))
              }
            />
          </label>
        </div>
        <label className="block text-[13px]">
          <span className="font-semibold">Logo URL</span>
          <input
            className="form-input !rounded-none mt-1"
            value={branding?.logoUrl || ''}
            onChange={(e) =>
              setBranding((b) => ({
                primaryColor: b?.primaryColor ?? null,
                secondaryColor: b?.secondaryColor ?? null,
                logoUrl: e.target.value || null,
                coverUrl: b?.coverUrl ?? null,
                name: b?.name,
              }))
            }
          />
        </label>
        <label className="block text-[13px]">
          <span className="font-semibold">Footer note</span>
          <input
            className="form-input !rounded-none mt-1"
            value={config.footerNote}
            onChange={(e) => setConfig({ ...config, footerNote: e.target.value })}
          />
        </label>

        <div className="flex flex-wrap gap-4 text-[13px]">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.showCourses}
              onChange={(e) => setConfig({ ...config, showCourses: e.target.checked })}
            />
            Show courses
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.showCapabilities}
              onChange={(e) => setConfig({ ...config, showCapabilities: e.target.checked })}
            />
            Show capabilities
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.showPrograms !== false}
              onChange={(e) => setConfig({ ...config, showPrograms: e.target.checked })}
            />
            Show programs
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.showJoin !== false}
              onChange={(e) => setConfig({ ...config, showJoin: e.target.checked })}
            />
            Show join section
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.showContact !== false}
              onChange={(e) => setConfig({ ...config, showContact: e.target.checked })}
            />
            Show contact
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.published}
              onChange={(e) => setConfig({ ...config, published: e.target.checked })}
            />
            Published
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-[13px]">
            <span className="font-semibold">Hero style</span>
            <select
              className="form-input !rounded-none mt-1"
              value={config.heroStyle}
              onChange={(e) =>
                setConfig({
                  ...config,
                  heroStyle: e.target.value === 'cover' ? 'cover' : 'gradient',
                })
              }
            >
              <option value="gradient">Brand gradient</option>
              <option value="cover">Cover image</option>
            </select>
          </label>
          <label className="block text-[13px]">
            <span className="font-semibold">Default CTA destination</span>
            <select
              className="form-input !rounded-none mt-1"
              value={
                config.ctaHref.includes('/signup')
                  ? 'signup'
                  : config.ctaHref.includes('/login')
                    ? 'login'
                    : 'custom'
              }
              onChange={(e) => {
                const v = e.target.value;
                if (v === 'signup') {
                  setConfig({
                    ...config,
                    ctaHref: `/site/${slug}/signup`,
                    ctaLabel: config.ctaLabel || 'Join campus',
                  });
                } else if (v === 'login') {
                  setConfig({
                    ...config,
                    ctaHref: `/site/${slug}/login`,
                    ctaLabel: config.ctaLabel || 'Sign in',
                  });
                }
              }}
            >
              <option value="signup">Student signup</option>
              <option value="login">Student login</option>
              <option value="custom">Custom (edit CTA link)</option>
            </select>
          </label>
        </div>

        <label className="block text-[13px]">
          <span className="font-semibold">Admissions / join note</span>
          <textarea
            className="form-input !rounded-none mt-1"
            rows={2}
            value={config.admissionsNote || ''}
            onChange={(e) => setConfig({ ...config, admissionsNote: e.target.value })}
          />
        </label>
        <label className="block text-[13px]">
          <span className="font-semibold">Contact blurb</span>
          <textarea
            className="form-input !rounded-none mt-1"
            rows={2}
            value={config.contactBlurb || ''}
            onChange={(e) => setConfig({ ...config, contactBlurb: e.target.value })}
          />
        </label>

        <label className="block text-[13px]">
          <span className="font-semibold">Nav links (label|href per line)</span>
          <textarea
            className="form-input !rounded-none mt-1 font-mono text-[12px]"
            rows={4}
            value={(config.navLinks || []).map((l) => `${l.label}|${l.href}`).join('\n')}
            onChange={(e) => {
              const navLinks = e.target.value
                .split('\n')
                .map((line) => {
                  const [label, ...rest] = line.split('|');
                  return {
                    label: (label || '').trim(),
                    href: rest.join('|').trim(),
                  };
                })
                .filter((l) => l.label && l.href);
              setConfig({ ...config, navLinks });
            }}
          />
        </label>

        {error ? (
          <p className="text-[13px]" style={{ color: '#b91c1c' }}>
            {error}
          </p>
        ) : null}
        {saved ? (
          <p className="text-[13px]" style={{ color: accent }}>
            Saved. Public site updated.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white"
          style={{ background: accent }}
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save website
        </button>
      </form>
    </section>
  );
}
