import { v2 as cloudinary } from 'cloudinary';
import type { MediaUploadKind, MentorUploadKind } from '@/lib/learn/mentorUploadKinds';
import { extFromFilenameOrMime } from '@/lib/cloudinaryFormats';

export type { MentorUploadKind, MediaUploadKind };

const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? '';
const apiKey = process.env.CLOUDINARY_API_KEY ?? '';
const apiSecret = process.env.CLOUDINARY_API_SECRET ?? '';

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

const FOLDERS: Record<MediaUploadKind, string> = {
  resume: 'intellex/mentor-applications/resumes',
  id_front: 'intellex/mentor-applications/ids',
  id_back: 'intellex/mentor-applications/ids',
  intro_video: 'intellex/mentor-applications/videos',
  assignment: 'intellex/assignments',
  course_cover: 'intellex/course-covers',
  avatar: 'intellex/avatars',
};

export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudName && apiKey && apiSecret);
}

function documentResourceType(
  mimeType?: string,
  filename?: string,
): 'image' | 'raw' {
  const mime = (mimeType || '').toLowerCase();
  const name = (filename || '').toLowerCase();
  if (mime.startsWith('image/') || /\.(png|jpe?g|webp|gif|heic)$/i.test(name)) {
    return 'image';
  }
  // PDF / DOC / DOCX — must be `raw` so Cloudinary keeps the original bytes.
  return 'raw';
}

/**
 * Signed upload params for direct browser → Cloudinary uploads.
 *
 * For raw PDF/DOC/DOCX we put the extension in `public_id` (e.g. resume_123.pdf).
 * Without that, Cloudinary delivery/download often fails or returns the wrong type.
 */
export function signMediaUpload(opts: {
  kind: MediaUploadKind;
  lbId: string;
  mimeType?: string;
  filename?: string;
}): {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  publicId: string;
  signature: string;
  resourceType: 'image' | 'raw' | 'video' | 'auto';
  format: string;
  transformation?: string;
} {
  if (!isCloudinaryConfigured()) {
    throw new Error('cloudinary_not_configured');
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = `${FOLDERS[opts.kind]}/${opts.lbId}`;
  const format = extFromFilenameOrMime(opts.filename, opts.mimeType);

  let resourceType: 'image' | 'raw' | 'video' | 'auto';
  if (opts.kind === 'intro_video') {
    resourceType = 'video';
  } else if (opts.kind === 'resume' || opts.kind === 'assignment') {
    resourceType = documentResourceType(opts.mimeType, opts.filename);
  } else {
    // course_cover, avatar, id_* are always images
    resourceType = 'image';
  }

  // Raw assets: include extension in public_id so delivery URLs end in .pdf/.docx.
  const publicId =
    resourceType === 'raw'
      ? `${opts.kind}_${timestamp}.${format}`
      : `${opts.kind}_${timestamp}`;

  const paramsToSign: Record<string, string | number> = {
    timestamp,
    folder,
    public_id: publicId,
  };

  let transformation: string | undefined;
  if (opts.kind === 'id_front' || opts.kind === 'id_back') {
    transformation = 'c_limit,w_1600,q_auto:good';
    paramsToSign.transformation = transformation;
  } else if (opts.kind === 'course_cover') {
    transformation = 'c_limit,w_1600,q_auto:good';
    paramsToSign.transformation = transformation;
  } else if (opts.kind === 'avatar') {
    transformation = 'c_limit,w_800,q_auto:good';
    paramsToSign.transformation = transformation;
  } else if (
    (opts.kind === 'resume' || opts.kind === 'assignment') &&
    resourceType === 'image'
  ) {
    transformation = 'c_limit,w_1800,q_auto:good';
    paramsToSign.transformation = transformation;
  }

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    cloudName,
    apiKey,
    timestamp,
    folder,
    publicId,
    signature,
    resourceType,
    format,
    transformation,
  };
}

/** @deprecated use signMediaUpload */
export function signMentorUpload(opts: {
  kind: MentorUploadKind;
  lbId: string;
  mimeType?: string;
  filename?: string;
}) {
  return signMediaUpload(opts);
}

export { cloudinary };
