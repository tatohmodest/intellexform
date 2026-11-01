import { getCatalogTrack } from '@/lib/learn/catalog';
import { getTutorial } from '@/lib/tutorials';
import { courseDurationHours, deliveryModeLabel, type TeacherCourseView } from '@/lib/learn/courseTypes';
import { getProgramme, priceLabel } from '@/lib/programmes';
import type { CurriculumDoc } from '@/lib/pdf/curriculumTypes';

function today() {
  return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function hoursLabel(minutes: number) {
  if (minutes <= 0) return '';
  return minutes < 60 ? `${minutes} min` : `~${Math.round(minutes / 60)} hours`;
}

export function buildTrackCurriculum(slug: string, preparedFor?: string): CurriculumDoc | null {
  const track = getCatalogTrack(slug);
  const course = getTutorial(slug);
  if (!track || !course) return null;
  const facts = [
    { label: 'Lessons', value: String(track.totalLessons) },
    { label: 'Duration', value: hoursLabel(track.totalMinutes) || 'Self-paced' },
    { label: 'Mode', value: 'Self-paced' },
    { label: 'Certificate', value: 'Included' },
  ];
  return {
    kind: track.tag || 'Course',
    title: track.title,
    subtitle: track.tagline,
    description: track.description,
    accent: track.color,
    facts,
    outcomes: course.highlights ?? [],
    requirements: course.audience ? [course.audience] : [],
    modules: course.sections.map((sec) => ({
      title: sec.title,
      summary: sec.summary,
      badge: sec.level,
      items: sec.lessons.map((l) => ({ title: l.title, minutes: l.minutes, note: l.description })),
    })),
    lessons: [],
    preparedFor,
    generatedAt: today(),
  };
}

export function buildTeacherCourseCurriculum(
  course: TeacherCourseView,
  preparedFor?: string,
): CurriculumDoc {
  const hours = courseDurationHours(course);
  const lessons = course.lessons ?? [];
  const modules = course.modules ?? [];
  const facts: CurriculumDoc['facts'] = [
    { label: 'Format', value: deliveryModeLabel(course.deliveryMode) },
  ];
  if (hours > 0) facts.push({ label: 'Duration', value: `${hours} hours` });
  const lessonCount = course.plannedLessonCount || lessons.length;
  if (lessonCount) facts.push({ label: 'Lessons', value: String(lessonCount) });
  if (modules.length || course.plannedModuleCount) {
    facts.push({ label: 'Modules', value: String(modules.length || course.plannedModuleCount) });
  }
  if (course.level && course.level !== 'all') {
    facts.push({ label: 'Level', value: course.level[0].toUpperCase() + course.level.slice(1) });
  }
  if (course.certificate) facts.push({ label: 'Certificate', value: 'Included' });

  return {
    kind: course.category || 'Course',
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    accent: course.accent || '#00a86b',
    facts,
    outcomes: course.outcomes ?? [],
    requirements: course.requirements ?? [],
    instructor: course.instructorName || course.authorName,
    modules: modules.map((m) => ({
      title: m.title,
      summary: m.description,
      badge: m.plannedSessions ? `${m.plannedSessions} sessions` : undefined,
      items: [],
    })),
    lessons: lessons.map((l) => ({
      title: l.title,
      minutes: l.durationMinutes ?? undefined,
    })),
    preparedFor,
    generatedAt: today(),
  };
}

export function buildProgrammeCurriculum(id: string): CurriculumDoc | null {
  const p = getProgramme(id);
  if (!p) return null;
  const facts: CurriculumDoc['facts'] = [
    { label: 'Duration', value: p.duration },
    { label: 'Level', value: p.level },
    { label: 'Format', value: p.short ? 'Live + self-paced' : 'Live + mentorship' },
    { label: 'Tools & topics', value: String(p.technologies.length) },
    { label: 'Tuition', value: priceLabel(p.priceXAF) },
  ];
  return {
    kind: p.categoryLabel,
    title: p.title,
    subtitle: p.badge || p.shortTitle,
    description: p.description,
    accent: p.accentColor,
    facts,
    outcomes: p.highlights,
    requirements: [p.prerequisites, ...p.equipment],
    modules: [
      {
        title: 'Tools and topics you will cover',
        summary: `${p.format}. Taught in cohorts with hands-on projects.`,
        badge: p.level,
        items: p.technologies.map((t) => ({ title: t })),
      },
    ],
    lessons: [],
    generatedAt: today(),
  };
}
