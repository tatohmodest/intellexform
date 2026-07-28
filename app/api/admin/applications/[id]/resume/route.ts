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
  const base =
    (name || 'applicant')
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
      if (seg.startsWith('s--') || seg.includes(',') || /^(c_|w_|h_|q_|f_|fl_)/.test(seg)) {
        i += 1;
        continue;
      }
      break;
    }

    const publicPath = after.slice(i).join('/');
    if (!publicPath) return null;

    const formatMatch = publicPath.match(/\.([a-z0-9]+)$/i);
    const format =
      formatMatch?.[1]?.toLowerCase() || (resourceType === 'raw' ? 'pdf' : '');
    const publicId = formatMatch
      ? publicPath.slice(0, -formatMatch[0].length)
      : publicPath;

    return { resourceType, publicId, format };
  } catch {
    return null;
  }
}

type CloudResource = {
  public_id: string;
  format?: string;
  resource_type?: string;
  secure_url?: string;
  url?: string;
};

async function lookupResource(
  publicId: string,
  preferred?: string,
): Promise<CloudResource | null> {
  const types = [preferred, 'raw', 'image', 'auto'].filter(
    (v, i, a): v is string => Boolean(v) && a.indexOf(v) === i,
  );
  const idVariants = [publicId];
  // Some raw uploads keep the extension inside public_id.
  if (!/\.[a-z0-9]+$/i.test(publicId)) {
    for (const ext of ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'webp']) {
      idVariants.push(`${publicId}.${ext}`);
    }
  }

  for (const resourceType of types) {
    for (const id of idVariants) {
      try {
        const resource = (await cloudinary.api.resource(id, {
          resource_type: resourceType,
        })) as CloudResource;
        if (resource?.public_id) return { ...resource, resource_type: resourceType };
      } catch {
        /* try next */
      }
    }
  }
  return null;
}

function signedDownloadUrl(
  publicId: string,
  format: string,
  resourceType: string,
): string {
  return cloudinary.utils.private_download_url(publicId, format || 'pdf', {
    resource_type: resourceType || 'raw',
    type: 'upload',
    attachment: true,
    expires_at: Math.floor(Date.now() / 1000) + 600,
  });
}

/**
 * GET /api/admin/applications/[id]/resume
 * Redirects the admin browser to a short-lived Cloudinary download URL for the
 * original CV (PDF/DOC/image) — avoids proxying bytes and JSON error downloads.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!assertAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isCloudinaryConfigured()) {
    return NextResponse.json({ error: 'upload_unavailable' }, { status: 503 });
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
      {
        projection: {
          resumeUrl: 1,
          resumePublicId: 1,
          resumeResourceType: 1,
          resumeFormat: 1,
          name: 1,
        },
      },
    );

    const resumeUrl = typeof app?.resumeUrl === 'string' ? app.resumeUrl : '';
    if (!resumeUrl || !isCloudinaryUrl(resumeUrl)) {
      return NextResponse.json({ error: 'resume_missing' }, { status: 404 });
    }

    const parsed = parseCloudinaryAsset(resumeUrl);
    const storedPublicId =
      typeof app?.resumePublicId === 'string' && app.resumePublicId
        ? app.resumePublicId
        : parsed?.publicId;
    const storedType =
      typeof app?.resumeResourceType === 'string' && app.resumeResourceType
        ? app.resumeResourceType
        : parsed?.resourceType;
    const storedFormat =
      typeof app?.resumeFormat === 'string' && app.resumeFormat
        ? app.resumeFormat
        : parsed?.format || 'pdf';

    if (!storedPublicId) {
      return NextResponse.json({ error: 'resume_missing' }, { status: 404 });
    }

    const resource = await lookupResource(storedPublicId, storedType);
    const publicId = resource?.public_id || storedPublicId;
    const format = (resource?.format || storedFormat || 'pdf').replace(/^\./, '');
    const resourceType = resource?.resource_type || storedType || 'raw';

    const downloadUrl = signedDownloadUrl(publicId, format, resourceType);

    // Prefer a browser redirect so Cloudinary streams the real file as an attachment.
    // ?proxy=1 keeps the older byte-stream path for debugging.
    if (req.nextUrl.searchParams.get('proxy') !== '1') {
      return NextResponse.redirect(downloadUrl, 302);
    }

    const upstream = await fetch(downloadUrl, { cache: 'no-store', redirect: 'follow' });
    if (!upstream.ok) {
      // Last resort: original delivery URL (may open inline, but better than JSON).
      return NextResponse.redirect(resumeUrl, 302);
    }
    const bytes = await upstream.arrayBuffer();
    const filename = safeFilename(String(app?.name ?? 'applicant'), format);
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        'Content-Type':
          format === 'pdf'
            ? 'application/pdf'
            : upstream.headers.get('content-type') || 'application/octet-stream',
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
