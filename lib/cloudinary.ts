import { v2 as cloudinary } from 'cloudinary';
import type { MentorUploadKind } from '@/lib/learn/mentorUploadKinds';

export type { MentorUploadKind };

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

const FOLDERS: Record<MentorUploadKind, string> = {
  resume: 'intellex/mentor-applications/resumes',
  id_front: 'intellex/mentor-applications/ids',
  id_back: 'intellex/mentor-applications/ids',
  intro_video: 'intellex/mentor-applications/videos',
};

export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudName && apiKey && apiSecret);
}

function resumeResourceType(
  mimeType?: string,
  filename?: string,
): 'image' | 'raw' {
  const mime = (mimeType || '').toLowerCase();
  const name = (filename || '').toLowerCase();
  if (mime.startsWith('image/') || /\.(png|jpe?g|webp|gif|heic)$/i.test(name)) {
    return 'image';
  }
  // PDF / DOC / DOCX and anything else — raw keeps the original file downloadable.
  return 'raw';
}

/**
 * Signed upload params for direct browser → Cloudinary uploads.
 */
export function signMentorUpload(opts: {
  kind: MentorUploadKind;
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
  transformation?: string;
} {
  if (!isCloudinaryConfigured()) {
    throw new Error('cloudinary_not_configured');
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = `${FOLDERS[opts.kind]}/${opts.lbId}`;
  const publicId = `${opts.kind}_${timestamp}`;

  let resourceType: 'image' | 'raw' | 'video' | 'auto';
  if (opts.kind === 'intro_video') {
    resourceType = 'video';
  } else if (opts.kind === 'resume') {
    resourceType = resumeResourceType(opts.mimeType, opts.filename);
  } else {
    resourceType = 'image';
  }

  const paramsToSign: Record<string, string | number> = {
    timestamp,
    folder,
    public_id: publicId,
  };

  // Keep upload transforms conservative — `f_auto` / bitrate eager often reject at upload time.
  let transformation: string | undefined;
  if (opts.kind === 'id_front' || opts.kind === 'id_back') {
    transformation = 'c_limit,w_1600,q_auto:good';
    paramsToSign.transformation = transformation;
  } else if (opts.kind === 'resume' && resourceType === 'image') {
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
    transformation,
  };
}

export { cloudinary };
