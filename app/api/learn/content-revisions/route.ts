import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  listContentRevisions,
  restoreContentRevision,
  type ContentEntityType,
} from '@/lib/learn/contentRevisions';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const url = new URL(req.url);
  const entityType = url.searchParams.get('entityType') as ContentEntityType | null;
  const entityId = url.searchParams.get('entityId') || '';
  if (!entityType || !entityId) {
    return NextResponse.json({ error: 'entityType and entityId required' }, { status: 400 });
  }
  if (!['teacher_course', 'assessment', 'book'].includes(entityType)) {
    return NextResponse.json({ error: 'invalid_type' }, { status: 400 });
  }
  const revisions = await listContentRevisions(entityType, entityId);
  return NextResponse.json({ revisions });
}

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  if (body.action !== 'restore') {
    return NextResponse.json({ error: 'unknown_action' }, { status: 400 });
  }
  const revisionId = String(body.revisionId || '');
  if (!revisionId) return NextResponse.json({ error: 'revisionId required' }, { status: 400 });
  const result = await restoreContentRevision({
    revisionId,
    editorId: session.uid,
  });
  if (!result.ok) {
    const status = result.error === 'forbidden' ? 403 : 404;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json(result);
}
