'use server';

import { saveQuiz, type QuizInput, type SaveResult } from '@/lib/api';
import { quizInputSchema } from '@/lib/validation';

/**
 * Server Action — save the quiz built in the instructor quiz builder.
 * Re-validates with Zod server-side (Rules.md §2) before persisting.
 *
 * SECURITY: this action persists correctOptionIndex server-side. It is only
 * reachable from the instructor's own builder UI; students never receive
 * these answers (student-facing views use QuizForStudent, answers stripped).
 * Phase 10: PUT /api/instructor/quizzes/:id
 */
export async function saveQuizAction(
  quizId: string,
  data: QuizInput
): Promise<SaveResult> {
  const parsed = quizInputSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: 'Please fix the validation errors and try again.' };
  }
  return saveQuiz(quizId, parsed.data);
}
