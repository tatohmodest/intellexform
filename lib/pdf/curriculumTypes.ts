export type CurriculumItem = { title: string; minutes?: number; note?: string };

export type CurriculumModule = {
  title: string;
  summary?: string;
  badge?: string;
  items: CurriculumItem[];
};

export type CurriculumDoc = {
  kind: string;
  title: string;
  subtitle?: string;
  description?: string;
  accent: string;
  facts: Array<{ label: string; value: string }>;
  outcomes: string[];
  requirements: string[];
  instructor?: string;
  modules: CurriculumModule[];
  /** Shown under the modules when an instructor course has loose lessons. */
  lessons: CurriculumItem[];
  preparedFor?: string;
  generatedAt: string;
};
