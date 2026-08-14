export type NotificationCategory = 'academic' | 'social' | 'institution' | 'system';

export type NotificationKind =
  | 'assignment'
  | 'exam'
  | 'system'
  | 'badge'
  | 'note'
  | 'message'
  | 'institution'
  | 'discussion';

export type NotificationView = {
  id: string;
  userId: string;
  title: string;
  body: string;
  href?: string | null;
  kind: NotificationKind;
  category: NotificationCategory;
  data?: Record<string, unknown>;
  readAt?: string | null;
  createdAt: string;
};

export const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  academic: 'Academic',
  social: 'Social',
  institution: 'Institution',
  system: 'System',
};

export function categoryForKind(kind: NotificationKind): NotificationCategory {
  switch (kind) {
    case 'assignment':
    case 'exam':
    case 'note':
      return 'academic';
    case 'message':
    case 'badge':
    case 'discussion':
      return 'social';
    case 'institution':
      return 'institution';
    default:
      return 'system';
  }
}
