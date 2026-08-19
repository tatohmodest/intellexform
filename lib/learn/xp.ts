import { getDb } from '@/lib/repo';

/**
 * XP amounts for learner and instructor activities.
 * Keep values modest so farming one action stays less rewarding than
 * sustained teaching or learning.
 */
export const XP = {
  /** Learner enrolls in a catalog track */
  ENROLL_TRACK: 10,
  /** Learner completes a lesson (first time only) */
  COMPLETE_LESSON: 20,
  /** Learner passes one book-tutor micro-lesson */
  COMPLETE_BOOK_LESSON: 10,
  /** Learner books a mentorship session */
  BOOK_MENTORSHIP: 5,

  /** Instructor creates a course draft */
  CREATE_COURSE: 10,
  /** Instructor publishes a course for the first time */
  PUBLISH_COURSE: 40,
  /** Instructor creates an assessment draft */
  CREATE_ASSESSMENT: 10,
  /** Instructor publishes an assessment for the first time */
  PUBLISH_ASSESSMENT: 25,
  /** Instructor starts a live class */
  START_CLASS: 15,
  /** Instructor ends a live class */
  END_CLASS: 20,
  /** Bonus when a class lasts at least 20 minutes */
  END_CLASS_LONG_BONUS: 5,
  /** Instructor enrolls a student (or student joins their course) - capped daily */
  ENROLL_STUDENT: 5,
  /** Max enroll-student XP awards per instructor per UTC day */
  ENROLL_STUDENT_DAILY_CAP: 10,
} as const;

export type InstructorTeachingStats = {
  classesStarted: number;
  classesEnded: number;
  coursesCreated: number;
  coursesPublished: number;
  assessmentsCreated: number;
  assessmentsPublished: number;
  studentsTaught: number;
};

/** Activity counts used for instructor achievement badges. */
export async function getInstructorTeachingStats(
  userId: string,
): Promise<InstructorTeachingStats> {
  const empty: InstructorTeachingStats = {
    classesStarted: 0,
    classesEnded: 0,
    coursesCreated: 0,
    coursesPublished: 0,
    assessmentsCreated: 0,
    assessmentsPublished: 0,
    studentsTaught: 0,
  };
  try {
    const db = await getDb();
    const courseOwned = { $or: [{ authorId: userId }, { instructorId: userId }] };
    const [
      classesStarted,
      classesEnded,
      coursesCreated,
      coursesPublished,
      assessmentsCreated,
      assessmentsPublished,
      studentsTaught,
    ] = await Promise.all([
      db.collection('course_class_sessions').countDocuments({ instructorId: userId }),
      db
        .collection('course_class_sessions')
        .countDocuments({ instructorId: userId, status: 'ended' }),
      db.collection('teacher_courses').countDocuments({ authorId: userId }),
      db.collection('teacher_courses').countDocuments({ ...courseOwned, published: true }),
      db.collection('assessments').countDocuments({ authorId: userId }),
      db.collection('assessments').countDocuments({ authorId: userId, published: true }),
      db.collection('course_enrollments').countDocuments({ instructorId: userId }),
    ]);
    return {
      classesStarted,
      classesEnded,
      coursesCreated,
      coursesPublished,
      assessmentsCreated,
      assessmentsPublished,
      studentsTaught,
    };
  } catch {
    return empty;
  }
}

/** How many students this instructor enrolled (or received) today UTC. */
export async function countInstructorEnrollsToday(instructorId: string): Promise<number> {
  try {
    const db = await getDb();
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    return db.collection('course_enrollments').countDocuments({
      instructorId,
      createdAt: { $gte: start },
    });
  } catch {
    return 0;
  }
}
