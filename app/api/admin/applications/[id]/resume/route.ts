import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { assertAdmin } from '@/lib/adminAuth';
import { cloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';
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

function safeFilename(name: string, format: string): string {
  const base = (name || 'applicant')
    .toLowerCase()
    .replace(/[^\w.-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'applicant';
  const ext = (format || 'pdf').toLowerCase().replace(/[^a-z0-9]/g, '') || 'pdf';
  return `cv-${base}.${ext === 'jpeg' ? 'jpg' : ext}`;
}

function parseCloudinaryAsset(url: string): {
  resourceType: 'raw' | 'image' | 'video';
  publicId: string;
  format: string;
} | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    // /{cloud}/{resource}/upload/...
    if (parts.length < 4) return null;
    const resourceType = parts[1];
    if (resourceType !== 'raw' && resourceType !== 'image' && resourceType !== 'video') {
      return null;
    }
    const uploadIdx = parts.indexOf('upload');
    if (uploadIdx < 0) return null;

    const after = parts.slice(uploadIdx + 1);
    let i = 0;
    while (i < after.length) {
      const seg = after[i];
      if (/^v\d+$/.test(seg)) {
        i += 1;
        break;
      }
      // Skip signatures / transformation segments before version or public_id.
      if (seg.startsWith('s--') || seg.includes(',') || /^(c_|w_|h_|q_|f_|fl_)/.test(seg)) {
        i += 1;
        continue;
      }
      break;
    }

    const publicPath = after.slice(i).join('/');
    if (!publicPath) return null;

    const formatMatch = publicPath.match(/\.([a-z0-9]+)$/i);
    const format = formatMatch?.[1]?.toLowerCase() || (resourceType === 'raw' ? 'pdf' : '');
    const publicId = formatMatch
      ? publicPath.slice(0, -(formatMatch[0].length))
      : publicPath;

    return { resourceType, publicId, format };
  } catch {
    return null;
  }
}

function looksLikeJson(bytes: ArrayBuffer): boolean {
  const view = new Uint8Array(bytes);
  let i = 0;
  while (i < view.length && (view[i] === 0x20 || view[i] === 0x0a || view[i] === 0x0d || view[i] === 0x09)) {
    i += 1;
  }
  return view[i] === 0x7b || view[i] === 0x5b; // { or [
}

function looksLikePdf(bytes: ArrayBuffer): boolean {
  const view = new Uint8Array(bytes);
  return view.length >= 4 && view[0] === 0x25 && view[1] === 0x50 && view[2] === 0x44 && view[3] === 0x46; // %PDF
}

async function fetchBytes(url: string): Promise<{ bytes: ArrayBuffer; contentType: string } | null> {
  const res = await fetch(url, { cache: 'no-store', redirect: 'follow' });
  if (!res.ok) return null;
  const bytes = await res.arrayBuffer();
  if (!bytes.byteLength || looksLikeJson(bytes)) return null;
  return {
    bytes,
    contentType: res.headers.get('content-type') || 'application/octet-stream',
  };
}

/**
 * GET /api/admin/applications/[id]/resume
 * Streams the original CV bytes (PDF/DOC/image) with Content-Disposition: attachment.
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

    const parsed = parseCloudinaryAsset(resumeUrl);
    const filename = safeFilename(
      String(app?.name ?? 'applicant'),
      parsed?.format || 'pdf',
    );

    // 1) Direct fetch of the stored delivery URL.
    let file = await fetchBytes(resumeUrl);

    // 2) Signed Cloudinary download API (works for raw PDFs / restricted delivery).
    if (!file && isCloudinaryConfigured() && parsed) {
      try {
        const resourceTypes: Array<'raw' | 'image' | 'video'> = [
          parsed.resourceType,
          'raw',
          'image',
        ].filter((v, idx, arr) => arr.indexOf(v) === idx) as Array<'raw' | 'image' | 'video'>;

        for (const resourceType of resourceTypes) {
          const format = parsed.format || (resourceType === 'raw' ? 'pdf' : '');
          const downloadUrl = cloudinary.utils.private_download_url(
            parsed.publicId,
            format,
            {
              resource_type: resourceType,
              type: 'upload',
              attachment: true,
              expires_at: Math.floor(Date.now() / 1000) + 300,
            },
          );
          file = await fetchBytes(downloadUrl);
          if (file) break;
        }
      } catch (err) {
        console.error('Cloudinary private_download_url failed:', err);
      }
    }

    if (!file) {
      return NextResponse.json({ error: 'resume_fetch_failed' }, { status: 502 });
    }

    const contentType =
      looksLikePdf(file.bytes)
        ? 'application/pdf'
        : file.contentType.includes('json')
          ? 'application/octet-stream'
          : file.contentType;

    return new NextResponse(file.bytes, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(file.bytes.byteLength),
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.error('resume download failed:', err);
    return NextResponse.json({ error: 'download_failed' }, { status: 500 });
  }
}
