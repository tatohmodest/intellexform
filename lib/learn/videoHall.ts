/**
 * Admin-curated Video Hall rows + YouTube search (server-only).
 */

import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';
import { ensureLearnCollections } from '@/lib/learn/ecosystem';
import {
  VIDEO_CATEGORIES,
  VIDEO_TUTORIALS,
  extractYoutubeId,
  isYoutubeId,
  type VideoLevel,
  type VideoTutorial,
} from '@/lib/learn/videos';

function toHallView(d: Record<string, unknown>): VideoTutorial {
  const id = String((d._id as ObjectId).toString());
  const levelRaw = String(d.level || 'Beginner');
  const level: VideoLevel =
    levelRaw === 'Intermediate' || levelRaw === 'Advanced' ? levelRaw : 'Beginner';
  return {
    id,
    youtubeId: String(d.youtubeId || ''),
    title: String(d.title || 'Video'),
    channel: String(d.channel || 'YouTube'),
    category: String(d.category || 'Career'),
    duration: String(d.duration || 'Video'),
    level,
    description: String(d.description || ''),
    source: 'admin',
  };
}

async function videoHallCol() {
  await ensureLearnCollections();
  const db = await getDb();
  await Promise.all([
    db.collection('video_hall').createIndex({ youtubeId: 1 }, { unique: true }),
    db.collection('video_hall').createIndex({ createdAt: -1 }),
  ]).catch(() => {});
  return db.collection('video_hall');
}

export async function listAdminVideos(): Promise<VideoTutorial[]> {
  try {
    const col = await videoHallCol();
    const docs = await col.find({}).sort({ createdAt: -1 }).limit(80).toArray();
    return docs
      .map((d) => toHallView(d as Record<string, unknown>))
      .filter((v) => isYoutubeId(v.youtubeId));
  } catch {
    return [];
  }
}

export async function listVideoHall(): Promise<VideoTutorial[]> {
  const admin = await listAdminVideos();
  const curated = VIDEO_TUTORIALS.map((v) => ({ ...v, source: 'curated' as const }));
  const seen = new Set(admin.map((v) => v.youtubeId));
  return [...admin, ...curated.filter((v) => !seen.has(v.youtubeId))];
}

export async function addAdminVideo(opts: {
  youtubeUrlOrId: string;
  title: string;
  channel?: string;
  category?: string;
  duration?: string;
  level?: VideoLevel;
  description?: string;
  addedBy: string;
}): Promise<VideoTutorial> {
  const youtubeId = extractYoutubeId(opts.youtubeUrlOrId);
  if (!youtubeId) throw new Error('invalid_youtube');
  const title = opts.title.trim().slice(0, 160);
  if (title.length < 2) throw new Error('title_required');
  const category =
    (VIDEO_CATEGORIES as readonly string[]).includes(String(opts.category || '')) &&
    opts.category !== 'All'
      ? String(opts.category)
      : 'Career';
  const now = new Date();
  const doc = {
    youtubeId,
    title,
    channel: (opts.channel || 'YouTube').trim().slice(0, 80) || 'YouTube',
    category,
    duration: (opts.duration || 'Video').trim().slice(0, 24) || 'Video',
    level: opts.level || 'Beginner',
    description: (opts.description || '').trim().slice(0, 600),
    addedBy: opts.addedBy,
    createdAt: now,
    updatedAt: now,
  };
  const col = await videoHallCol();
  try {
    const res = await col.insertOne(doc);
    return toHallView({ ...doc, _id: res.insertedId });
  } catch {
    const existing = await col.findOne({ youtubeId });
    if (existing) return toHallView(existing as Record<string, unknown>);
    throw new Error('save_failed');
  }
}

export async function removeAdminVideo(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const col = await videoHallCol();
  const res = await col.deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount > 0;
}

function matchLocal(query: string, videos: VideoTutorial[]): VideoTutorial[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return videos.filter((v) => {
    const hay = `${v.title} ${v.channel} ${v.category} ${v.description}`.toLowerCase();
    return hay.includes(q);
  });
}

function stubSearchVideo(youtubeId: string, title?: string, channel?: string): VideoTutorial {
  return {
    id: `yt-${youtubeId}`,
    youtubeId,
    title: (title || 'YouTube video').slice(0, 160),
    channel: (channel || 'YouTube').slice(0, 80),
    category: 'YouTube',
    duration: 'Video',
    level: 'Beginner',
    description: 'Playing inside InTelleX — you stay on campus.',
    source: 'search',
  };
}

async function oembedVideo(youtubeId: string): Promise<VideoTutorial | null> {
  try {
    const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${youtubeId}`)}&format=json`;
    const res = await fetch(url);
    if (!res.ok) return stubSearchVideo(youtubeId);
    const data = (await res.json()) as { title?: string; author_name?: string };
    return stubSearchVideo(youtubeId, data.title, data.author_name);
  } catch {
    return stubSearchVideo(youtubeId);
  }
}

async function youtubeDataSearch(query: string): Promise<VideoTutorial[]> {
  const key = process.env.YOUTUBE_API_KEY?.trim();
  if (!key) return [];
  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('type', 'video');
  url.searchParams.set('maxResults', '12');
  url.searchParams.set('q', query.slice(0, 120));
  url.searchParams.set('safeSearch', 'moderate');
  url.searchParams.set('key', key);
  const res = await fetch(url.toString());
  if (!res.ok) return [];
  const data = (await res.json()) as {
    items?: Array<{
      id?: { videoId?: string };
      snippet?: {
        title?: string;
        channelTitle?: string;
        description?: string;
      };
    }>;
  };
  return (data.items || [])
    .map((item) => {
      const youtubeId = String(item.id?.videoId || '');
      if (!isYoutubeId(youtubeId)) return null;
      const video = stubSearchVideo(
        youtubeId,
        item.snippet?.title,
        item.snippet?.channelTitle,
      );
      video.description = String(item.snippet?.description || video.description).slice(0, 400);
      return video;
    })
    .filter((v): v is VideoTutorial => Boolean(v));
}

export async function searchVideoHall(query: string): Promise<{
  videos: VideoTutorial[];
  source: 'youtube' | 'local';
}> {
  const q = query.trim().slice(0, 160);
  if (!q) return { videos: [], source: 'local' };

  const hall = await listVideoHall();
  const directId = extractYoutubeId(q);
  if (directId) {
    const local = hall.find((v) => v.youtubeId === directId);
    if (local) return { videos: [local], source: 'local' };
    const remote = await oembedVideo(directId);
    return { videos: remote ? [remote] : [], source: 'youtube' };
  }

  const localHits = matchLocal(q, hall);
  const remote = await youtubeDataSearch(q);
  if (remote.length) {
    const seen = new Set(remote.map((v) => v.youtubeId));
    const merged = [...remote, ...localHits.filter((v) => !seen.has(v.youtubeId))];
    return { videos: merged.slice(0, 18), source: 'youtube' };
  }
  return { videos: localHits.slice(0, 18), source: 'local' };
}
