'use server';

import {
  saveCourseInfo,
  saveLessons,
  createQuiz,
  type CourseInfoInput,
  type LessonInput,
  type SaveResult,
} from '@/lib/api';
import { courseInfoSchema, lessonsSchema } from '@/lib/validation';
import { redirect } from 'next/navigation';

/**
 * Server Action — save basic course info.
 * Re-validates with Zod server-side (Rules.md §2) before persisting.
 * Phase 10: PUT /api/instructor/courses/:id
 */
export async function saveCourseInfoAction(
  courseId: string,
  data: CourseInfoInput
): Promise<SaveResult> {
  const parsed = courseInfoSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: 'Please fix the validation errors and try again.' };
  }
  return saveCourseInfo(courseId, parsed.data);
}

/**
 * Server Action — save the full lesson list.
 * Re-validates with Zod server-side before persisting.
 * Phase 10: PUT /api/instructor/courses/:id/lessons
 */
export async function saveLessonsAction(
  courseId: string,
  lessons: LessonInput[]
): Promise<SaveResult> {
  const parsed = lessonsSchema.safeParse(lessons);
  if (!parsed.success) {
    return { ok: false, error: 'Please fix the validation errors and try again.' };
  }
  return saveLessons(courseId, parsed.data);
}

/**
 * Server Action — create a draft quiz for a course, then open the quiz builder.
 * Phase 10: POST /api/instructor/quizzes
 */
export async function createQuizAction(courseId: string) {
  const result = await createQuiz(courseId);
  if (!result.ok) {
    console.error('createQuiz failed:', result.error);
    throw new Error('Could not create the quiz. Please try again.');
  }
  redirect(`/instructor/quizzes/${result.quizId}/edit`);
}
