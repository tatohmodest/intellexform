import { TUTORIALS } from './index';
import type { TutorialSearchItem } from './searchTypes';

export type { TutorialSearchItem };

/** Slim searchable index - call from server components, pass to clients. */
export function getTutorialSearchIndex(): TutorialSearchItem[] {
  const items: TutorialSearchItem[] = [];

  for (const course of TUTORIALS) {
    items.push({
      kind: 'tutorial',
      courseSlug: course.slug,
      courseTitle: course.title,
      title: course.title,
      description: course.description,
      href: `/tutorials/${course.slug}`,
      tag: course.tag,
    });

    for (const section of course.sections) {
      for (const lesson of section.lessons) {
        items.push({
          kind: 'lesson',
          courseSlug: course.slug,
          courseTitle: course.shortTitle,
          title: lesson.title,
          description: lesson.description,
          href: `/tutorials/${course.slug}/${lesson.slug}`,
          level: lesson.level,
        });
      }
    }
  }

  return items;
}
