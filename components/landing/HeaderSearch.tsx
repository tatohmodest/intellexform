'use client';

import { useEffect } from 'react';
import SiteSearch from '@/components/landing/SiteSearch';
import { useSearchIndex } from '@/lib/search/useSearchIndex';

export default function HeaderSearch() {
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
        placeholder="Search courses & tutorials..."
        className="w-full"
      />
    </div>
  );
}
