'use client';

import { useCallback, useEffect, useState } from 'react';
import type { CourseSearchItem } from '@/lib/tutorials/searchFilter';
import type { TutorialSearchItem } from '@/lib/tutorials/searchTypes';

export type SearchIndexPayload = {
  courses: CourseSearchItem[];
  tutorials: TutorialSearchItem[];
};

let cached: SearchIndexPayload | null = null;
let inflight: Promise<SearchIndexPayload> | null = null;

async function fetchSearchIndex(): Promise<SearchIndexPayload> {
  if (cached) return cached;
  if (inflight) return inflight;

  inflight = fetch('/api/search-index')
    .then(async (res) => {
      if (!res.ok) throw new Error('Failed to load search index');
      const data = (await res.json()) as SearchIndexPayload;
      cached = {
        courses: data.courses || [],
        tutorials: data.tutorials || [],
      };
      return cached;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

/** Prefetch / load the wide search index for header + page search. */
export function useSearchIndex(seed?: Partial<SearchIndexPayload>) {
  const [index, setIndex] = useState<SearchIndexPayload>(() => {
    if (seed?.courses?.length || seed?.tutorials?.length) {
      return {
        courses: seed.courses || [],
        tutorials: seed.tutorials || [],
      };
    }
    return cached || { courses: [], tutorials: [] };
  });
  const [loading, setLoading] = useState(
    () => !cached && !(seed?.courses?.length || seed?.tutorials?.length),
  );

  const ensureLoaded = useCallback(async () => {
    if (cached) {
      setIndex(cached);
      setLoading(false);
      return cached;
    }
    setLoading(true);
    try {
      const data = await fetchSearchIndex();
      setIndex(data);
      return data;
    } catch {
      setLoading(false);
      return { courses: [], tutorials: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (seed?.courses?.length || seed?.tutorials?.length) {
      const next = {
        courses: seed.courses || [],
        tutorials: seed.tutorials || [],
      };
      cached = next;
      setIndex(next);
      setLoading(false);
      return;
    }
    void ensureLoaded();
  }, [seed, ensureLoaded]);

  return { courses: index.courses, tutorials: index.tutorials, loading, ensureLoaded };
}
