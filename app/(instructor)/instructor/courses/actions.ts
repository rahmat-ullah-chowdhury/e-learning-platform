'use server';

import { createCourse } from '@/lib/api';
import { redirect } from 'next/navigation';

/**
 * Server Action — create a new draft course owned by the mock instructor,
 * then redirect straight into its editor.
 * Phase 10: POST /api/instructor/courses
 */
export async function createCourseAction() {
  const result = await createCourse();
  if (!result.ok) {
    // Rules.md §4: generic user-facing error, full detail logged server-side
    console.error('createCourse failed:', result.error);
    throw new Error('Could not create the course. Please try again.');
  }
  redirect(`/instructor/courses/${result.courseId}/edit`);
}
