import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import SubscribePanel from '@/components/content/SubscribePanel';
import type { ContentAccessConfig, LessonLevel } from '@/lib/contentAccess';

export default function ContentPaywall({
  title,
  shortTitle,
  config,
  level,
  returnPath,
  kind,
  slug,
}: {
  title: string;
  shortTitle: string;
  config: ContentAccessConfig;
  level: LessonLevel;
  returnPath: string;
  kind: 'tutorial' | 'course';
  slug: string;
}) {
  return (
    <>
      <TopNav />
      <main className="min-h-[calc(100vh-57px)] px-4 py-10 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(180deg, #F2F6FB 0%, #FFFFFF 45%)' }}>
        <div className="mx-auto max-w-[640px]">
          <p className="mono mb-3 text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
            Locked content · {shortTitle}
          </p>
          <h1 className="font-display text-[32px] leading-tight sm:text-[38px]">{title}</h1>
          <p className="mt-3 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            {config.mode === 'free'
              ? 'Beginner lessons are free. Intermediate through Pro unlock when you subscribe to get certified - 4,999 XAF/month, or yearly with 10% off.'
              : `This track is set to payable by the platform admin. Choose a plan below to unlock${
                  config.mode === 'per_level' ? ` the ${level} level` : ' the full curriculum'
                }${config.certificateGuarantee ? ' - with a certificate guarantee on completion.' : '.'}`}
          </p>
          <div className="mt-8">
            <SubscribePanel
              config={config}
              level={level}
              returnPath={returnPath}
              kind={kind}
              slug={slug}
              gateReason={config.mode === 'free' ? 'cert_required' : 'subscribe_required'}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
