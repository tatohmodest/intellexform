'use client';

import { useEffect } from 'react';
import SiteSearch from '@/components/landing/SiteSearch';
import { useSearchIndex } from '@/lib/search/useSearchIndex';
import { useT } from '@/components/i18n/I18nRoot';

export default function HeaderSearch() {
  const t = useT();
  const { courses, tutorials, loading, ensureLoaded } = useSearchIndex();

  useEffect(() => {
    void ensureLoaded();
  }, [ensureLoaded]);

  return (
    <div className="relative min-w-0 flex-1 overflow-visible md:max-w-[18rem] lg:max-w-[22rem] xl:max-w-[28rem]">
      <SiteSearch
        variant="header"
        compact
        courses={courses}
        tutorialIndex={tutorials}
        loading={loading}
        onFocusSearch={() => {
          void ensureLoaded();
        }}
        placeholder={t('Search courses & tutorials...')}
        className="w-full"
      />
    </div>
  );
}
