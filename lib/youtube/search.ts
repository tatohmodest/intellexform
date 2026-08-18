/**
 * YouTube Data API v3 search.list
 * GET https://www.googleapis.com/youtube/v3/search
 *
 * Video Hall uses this so learners search YouTube and watch inside InTelleX.
 * Quota: search.list is expensive (Search Queries bucket). Results are cached.
 */

import { getDb } from '@/lib/repo';
import { isYoutubeId, type VideoTutorial } from '@/lib/learn/videos';

const SEARCH_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;
const MAX_Q = 120;

export type YoutubeSearchError = 'unconfigured' | 'quota' | 'failed';

export type YoutubeSearchPage = {
  videos: VideoTutorial[];
  nextPageToken: string | null;
  error?: YoutubeSearchError;
};

function youtubeKey(): string {
  return process.env.YOUTUBE_API_KEY?.trim() || '';
}

export function hasYoutubeApiKey(): boolean {
  return Boolean(youtubeKey());
}

function decodeHtml(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function cacheKey(q: string, lang: string, pageToken: string): string {
  return `${lang}:${q.toLowerCase()}:${pageToken}`;
}

async function cacheCol() {
  const db = await getDb();
  await db
    .collection('youtube_search_cache')
    .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
    .catch(() => {});
  await db
    .collection('youtube_search_cache')
    .createIndex({ cacheKey: 1 }, { unique: true })
    .catch(() => {});
  return db.collection('youtube_search_cache');
}

async function readCache(key: string): Promise<YoutubeSearchPage | null> {
  try {
    const col = await cacheCol();
    const doc = await col.findOne({ cacheKey: key, expiresAt: { $gt: new Date() } });
    if (!doc) return null;
    return {
      videos: (doc.videos || []) as VideoTutorial[],
      nextPageToken: typeof doc.nextPageToken === 'string' ? doc.nextPageToken : null,
    };
  } catch {
    return null;
  }
}

async function writeCache(key: string, page: YoutubeSearchPage) {
  try {
    const col = await cacheCol();
    await col.updateOne(
      { cacheKey: key },
      {
        $set: {
          cacheKey: key,
          videos: page.videos,
          nextPageToken: page.nextPageToken,
          expiresAt: new Date(Date.now() + CACHE_TTL_MS),
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );
  } catch {
    /* cache is optional */
  }
}

function toVideo(item: {
  id?: { kind?: string; videoId?: string };
  snippet?: {
    title?: string;
    channelTitle?: string;
    description?: string;
    liveBroadcastContent?: string;
  };
}): VideoTutorial | null {
  if (item.id?.kind && item.id.kind !== 'youtube#video') return null;
  const youtubeId = String(item.id?.videoId || '');
  if (!isYoutubeId(youtubeId)) return null;
  const live = item.snippet?.liveBroadcastContent;
  return {
    id: `yt-${youtubeId}`,
    youtubeId,
    title: decodeHtml(String(item.snippet?.title || 'YouTube video')).slice(0, 160),
    channel: decodeHtml(String(item.snippet?.channelTitle || 'YouTube')).slice(0, 80),
    category: 'YouTube',
    duration: live === 'live' ? 'Live' : 'Video',
    level: 'Beginner',
    description: decodeHtml(String(item.snippet?.description || '')).slice(0, 400),
    source: 'search',
  };
}

/**
 * search.list — videos only, embeddable, Cameroon region, language-aware.
 * https://developers.google.com/youtube/v3/docs/search/list
 */
export async function youtubeSearchList(opts: {
  q: string;
  pageToken?: string;
  relevanceLanguage?: 'en' | 'fr';
  maxResults?: number;
}): Promise<YoutubeSearchPage> {
  const q = opts.q.trim().slice(0, MAX_Q);
  if (!q) return { videos: [], nextPageToken: null };

  const key = youtubeKey();
  if (!key) return { videos: [], nextPageToken: null, error: 'unconfigured' };

  const lang = opts.relevanceLanguage === 'fr' ? 'fr' : 'en';
  const pageToken = String(opts.pageToken || '').trim();
  const cached = await readCache(cacheKey(q, lang, pageToken));
  if (cached) return cached;

  const url = new URL(SEARCH_ENDPOINT);
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('type', 'video');
  url.searchParams.set('q', q);
  url.searchParams.set('maxResults', String(Math.min(50, Math.max(1, opts.maxResults ?? 24))));
  url.searchParams.set('order', 'relevance');
  url.searchParams.set('safeSearch', 'moderate');
  url.searchParams.set('videoEmbeddable', 'true');
  url.searchParams.set('regionCode', 'CM');
  url.searchParams.set('relevanceLanguage', lang);
  url.searchParams.set('key', key);
  if (pageToken) url.searchParams.set('pageToken', pageToken);

  let res: Response;
  try {
    res = await fetch(url.toString(), { cache: 'no-store' });
  } catch {
    return { videos: [], nextPageToken: null, error: 'failed' };
  }

  if (res.status === 403 || res.status === 429) {
    return { videos: [], nextPageToken: null, error: 'quota' };
  }
  if (!res.ok) {
    return { videos: [], nextPageToken: null, error: 'failed' };
  }

  const data = (await res.json()) as {
    nextPageToken?: string;
    items?: Array<{
      id?: { kind?: string; videoId?: string };
      snippet?: {
        title?: string;
        channelTitle?: string;
        description?: string;
        liveBroadcastContent?: string;
      };
    }>;
  };

  const videos = (data.items || []).map(toVideo).filter((v): v is VideoTutorial => Boolean(v));
  const page: YoutubeSearchPage = {
    videos,
    nextPageToken: data.nextPageToken || null,
  };
  await writeCache(cacheKey(q, lang, pageToken), page);
  return page;
}
