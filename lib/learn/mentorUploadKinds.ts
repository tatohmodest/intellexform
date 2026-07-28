/** Upload kinds for mentor + assignment Cloudinary uploads. */
export type MentorUploadKind = 'resume' | 'id_front' | 'id_back' | 'intro_video';
export type MediaUploadKind = MentorUploadKind | 'assignment';

export const MEDIA_UPLOAD_KINDS: MediaUploadKind[] = [
  'resume',
  'id_front',
  'id_back',
  'intro_video',
  'assignment',
];
