'use server';

import { submitQuizAttempt } from '@/lib/api';
import type { SubmittedAnswer } from '@/types';

/**
 * Server Action to submit a quiz attempt.
 * This ensures the mock grading and attempt creation happens on the server,
 * so that the server-side MOCK_ATTEMPTS array is updated.
 * When the client navigates to the result page (a Server Component),
 * it will be able to find the newly created attempt.
 */
export async function submitAttemptAction(quizId: string, answers: SubmittedAnswer[]) {
  return submitQuizAttempt(quizId, answers);
}
