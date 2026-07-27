import { v2 as cloudinary } from 'cloudinary';
import type { MentorUploadKind } from '@/lib/learn/mentorUploadKinds';

export type { MentorUploadKind };

/** Platform image uploads (avatars, campus brand, course art, book covers). */
export type MediaUploadKind = 'avatar' | 'logo' | 'cover' | 'course_image' | 'book_cover';

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

const MENTOR_FOLDERS: Record<MentorUploadKind, string> = {
  resume: 'intellex/mentor-applications/resumes',
  id_front: 'intellex/mentor-applications/ids',
  id_back: 'intellex/mentor-applications/ids',
  intro_video: 'intellex/mentor-applications/videos',
};

const MEDIA_FOLDERS: Record<MediaUploadKind, string> = {
  avatar: 'intellex/avatars',
  logo: 'intellex/institutions/logos',
  cover: 'intellex/institutions/covers',
  course_image: 'intellex/courses',
  book_cover: 'intellex/books/covers',
};

export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudName && apiKey && apiSecret);
}

/**
 * Signed upload params for direct browser → Cloudinary uploads.
 * Videos get an eager transform (720p, auto quality, capped bitrate) so
 * delivery stays sharp while storage stays lean.
 */
export function signMentorUpload(opts: {
  kind: MentorUploadKind;
  lbId: string;
}): {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  publicId: string;
  signature: string;
  resourceType: 'image' | 'raw' | 'video' | 'auto';
  eager?: string;
} {
  if (!isCloudinaryConfigured()) {
    throw new Error('cloudinary_not_configured');
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = `${MENTOR_FOLDERS[opts.kind]}/${opts.lbId}`;
  const publicId = `${opts.kind}_${timestamp}`;
  const resourceType: 'image' | 'raw' | 'video' | 'auto' =
    opts.kind === 'intro_video' ? 'video' : opts.kind === 'resume' ? 'auto' : 'image';

  const paramsToSign: Record<string, string | number> = {
    timestamp,
    folder,
    public_id: publicId,
  };

  let eager: string | undefined;
  if (opts.kind === 'intro_video') {
    eager = 'c_limit,w_1280,h_720,q_auto:good,br_800k,f_mp4';
    paramsToSign.eager = eager;
  } else if (opts.kind === 'id_front' || opts.kind === 'id_back') {
    paramsToSign.transformation = 'c_limit,w_1600,q_auto:good';
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
    eager,
  };
}

/** Signed image upload for avatars, logos, covers, and course art. */
export function signMediaUpload(opts: {
  kind: MediaUploadKind;
  ownerId: string;
}): {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  publicId: string;
  signature: string;
  resourceType: 'image';
  transformation: string;
} {
  if (!isCloudinaryConfigured()) {
    throw new Error('cloudinary_not_configured');
  }

  const timestamp = Math.round(Date.now() / 1000);
  const safeOwner = opts.ownerId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64) || 'anon';
  const folder = `${MEDIA_FOLDERS[opts.kind]}/${safeOwner}`;
  const publicId = `${opts.kind}_${timestamp}`;

  const transformation =
    opts.kind === 'avatar'
      ? // Face-aware crop, sharp but compact delivery format
        'c_fill,g_auto,w_512,h_512,q_auto:good,f_auto'
      : opts.kind === 'logo'
        ? // Keep logos crisp; cap edge so 10MB uploads land light
          'c_limit,w_1000,h_1000,q_auto:good,f_auto'
        : opts.kind === 'cover'
          ? // Wide banner — dimension limit does most of the size cut
            'c_fill,g_auto,w_1920,h_768,q_auto:good,f_auto'
          : // Course / book art
            'c_limit,w_1800,q_auto:good,f_auto';

  const paramsToSign: Record<string, string | number> = {
    timestamp,
    folder,
    public_id: publicId,
    transformation,
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    cloudName,
    apiKey,
    timestamp,
    folder,
    publicId,
    signature,
    resourceType: 'image',
    transformation,
  };
}

export { cloudinary };
