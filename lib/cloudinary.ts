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
  const folder = `${FOLDERS[opts.kind]}/${opts.lbId}`;
  const publicId = `${opts.kind}_${timestamp}`;
  const resourceType: 'image' | 'raw' | 'video' | 'auto' =
    opts.kind === 'intro_video' ? 'video' : opts.kind === 'resume' ? 'auto' : 'image';

  const paramsToSign: Record<string, string | number> = {
    timestamp,
    folder,
    public_id: publicId,
  };

  // Cap stored video: 1280×720, auto quality, ~800kbps - keeps intro clips small.
  let eager: string | undefined;
  if (opts.kind === 'intro_video') {
    eager = 'c_limit,w_1280,h_720,q_auto:good,br_800k,f_mp4';
    paramsToSign.eager = eager;
  } else if (opts.kind === 'id_front' || opts.kind === 'id_back') {
    // Incoming image transform to shrink ID photos without looking soft.
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

export { cloudinary };
