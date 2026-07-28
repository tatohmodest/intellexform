/** Upload kinds for mentor, course, and assignment Cloudinary uploads. */
export type MentorUploadKind = 'resume' | 'id_front' | 'id_back' | 'intro_video';
export type MediaUploadKind =
  | MentorUploadKind
  | 'assignment'
  | 'course_cover'
  | 'avatar';

export const MEDIA_UPLOAD_KINDS: MediaUploadKind[] = [
  'resume',
  'id_front',
  'id_back',
  'intro_video',
  'assignment',
  'course_cover',
  'avatar',
];
