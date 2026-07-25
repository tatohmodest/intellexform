export type TutorialSearchItem = {
  kind: 'tutorial' | 'lesson';
  courseSlug: string;
  courseTitle: string;
  title: string;
  description: string;
  href: string;
  level?: string;
  tag?: string;
};
