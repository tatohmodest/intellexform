export type ContentBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'code'; code: string; title?: string; language?: string }
  | { type: 'note'; text: string }
  | { type: 'tip'; text: string }
  | { type: 'warning'; text: string }
  | { type: 'try'; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'keypoints'; items: string[] };

export type LessonLevel = 'beginner' | 'intermediate' | 'advanced';

export interface TutorialLesson {
  slug: string;
  title: string;
  description: string;
  level: LessonLevel;
  section: string;
  order: number;
  minutes: number;
  content: ContentBlock[];
}

export interface TutorialSection {
  id: string;
  title: string;
  level: LessonLevel;
  summary: string;
  lessons: TutorialLesson[];
}

export interface TutorialCourse {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  tagline: string;
  audience: string;
  totalLessons: number;
  sections: TutorialSection[];
}
