import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { assertAdmin } from '@/lib/adminAuth';
import { getDb } from '@/lib/repo';

export const dynamic = 'force-dynamic';

function isCloudinaryUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && u.hostname.includes('cloudinary.com');
  } catch {
    return false;
  }
}

function safeFilename(name: string, url: string): string {
  const base = (name || 'applicant')
    .toLowerCase()
    .replace(/[^\w.-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'applicant';
  const path = (() => {
    try {
      return new URL(url).pathname.toLowerCase();
    } catch {
      return '';
    }
  })();
  const ext =
    path.match(/\.(pdf|docx?|png|jpe?g|webp)$/i)?.[1]?.toLowerCase() || 'pdf';
  return `cv-${base}.${ext === 'jpeg' ? 'jpg' : ext}`;
}

/**
 * GET /api/admin/applications/[id]/resume
 * Proxies the stored Cloudinary CV and forces a file download (no fl_attachment URL rewrite).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!assertAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let oid: ObjectId;
  try {
    oid = new ObjectId(params.id);
  } catch {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400 });
  }

  try {
    const db = await getDb();
    const app = await db.collection('mentor_applications').findOne(
      { _id: oid },
      { projection: { resumeUrl: 1, name: 1 } },
    );
    const resumeUrl = typeof app?.resumeUrl === 'string' ? app.resumeUrl : '';
    if (!resumeUrl || !isCloudinaryUrl(resumeUrl)) {
      return NextResponse.json({ error: 'resume_missing' }, { status: 404 });
    }

    const upstream = await fetch(resumeUrl, { cache: 'no-store' });
    if (!upstream.ok) {
      console.error('resume proxy upstream failed:', upstream.status, resumeUrl);
      return NextResponse.json(
        { error: 'resume_fetch_failed' },
        { status: 502 },
      );
    }

    const bytes = await upstream.arrayBuffer();
    const contentType =
      upstream.headers.get('content-type') || 'application/octet-stream';
    const filename = safeFilename(String(app?.name ?? 'applicant'), resumeUrl);

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(bytes.byteLength),
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (err) {
    console.error('resume download failed:', err);
    return NextResponse.json({ error: 'download_failed' }, { status: 500 });
  }
}
