import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { updateLearnerSettings } from '@/lib/learn/repo';

export const dynamic = 'force-dynamic';

const MAX_AVATAR_CHARS = 350_000; // ~data URL size guard

export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const patch: {
    name?: string;
    weeklyGoalMinutes?: number;
    avatar?: string;
    preferences?: {
      locale?: string;
      emailNotifications?: boolean;
      sessionReminders?: boolean;
      reducedMotion?: boolean;
      marketingEmails?: boolean;
    };
  } = {};

  if (typeof body.name === 'string' && body.name.trim()) {
    patch.name = body.name.trim().slice(0, 80);
  }
  if (typeof body.weeklyGoalMinutes === 'number' && body.weeklyGoalMinutes > 0) {
    patch.weeklyGoalMinutes = Math.min(Math.round(body.weeklyGoalMinutes), 7 * 24 * 60);
  }
  if (typeof body.avatar === 'string') {
    const avatar = body.avatar.trim();
    if (avatar === '') {
      patch.avatar = '';
    } else if (avatar.startsWith('https://') || avatar.startsWith('http://')) {
      patch.avatar = avatar.slice(0, 2000);
    } else if (avatar.startsWith('data:image/') && avatar.length <= MAX_AVATAR_CHARS) {
      // Legacy inline avatars — new uploads should be Cloudinary https URLs.
      patch.avatar = avatar;
    } else {
      return NextResponse.json({ error: 'invalid_avatar' }, { status: 400 });
    }
  }
  if (body.preferences && typeof body.preferences === 'object') {
    const p = body.preferences as Record<string, unknown>;
    patch.preferences = {};
    if (typeof p.locale === 'string') patch.preferences.locale = p.locale.slice(0, 12);
    if (typeof p.emailNotifications === 'boolean') {
      patch.preferences.emailNotifications = p.emailNotifications;
    }
    if (typeof p.sessionReminders === 'boolean') {
      patch.preferences.sessionReminders = p.sessionReminders;
    }
    if (typeof p.reducedMotion === 'boolean') {
      patch.preferences.reducedMotion = p.reducedMotion;
    }
    if (typeof p.marketingEmails === 'boolean') {
      patch.preferences.marketingEmails = p.marketingEmails;
    }
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'nothing_to_update' }, { status: 400 });
  }
  try {
    await updateLearnerSettings(user.uid, patch);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('settings update failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
