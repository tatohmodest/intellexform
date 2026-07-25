import type { TutorialSearchItem } from './searchTypes';

export type { TutorialSearchItem };

export function filterTutorialSearchIndex(items: TutorialSearchItem[], query: string, limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored = items
    .map((item) => {
      const title = item.title.toLowerCase();
      const desc = item.description.toLowerCase();
      const course = item.courseTitle.toLowerCase();
      let score = 0;
      if (title === q) score += 100;
      else if (title.startsWith(q)) score += 60;
      else if (title.includes(q)) score += 40;
      if (course.includes(q)) score += 20;
      if (desc.includes(q)) score += 10;
      if (item.tag?.toLowerCase().includes(q)) score += 15;
      return { item, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((row) => row.item);
}
