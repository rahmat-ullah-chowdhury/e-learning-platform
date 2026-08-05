'use server';

import {
  getInstructorCourseById,
  saveLessons,
  createQuiz,
  getQuizForInstructor,
  saveQuiz,
} from '@/lib/api';

/**
 * TEMPORARY test action (deleted after use).
 * Adds one lesson to c1 — exactly what the real LessonEditor action does.
 */
export async function addDebugLessonAction() {
  const data = await getInstructorCourseById('c1');
  if (!data) return;
  await saveLessons('c1', [
    ...data.lessons.map((l) => ({
      id: l.id,
      title: l.title,
      contentType: l.contentType,
      durationSeconds: l.durationSeconds ?? 0,
      isFreePreview: l.isFreePreview,
    })),
    {
      id: `debug-sa-${Date.now()}`,
      title: 'Server Action Test Lesson',
      contentType: 'video' as const,
      durationSeconds: 300,
      isFreePreview: false,
    },
  ]);
}

/** Creates a quiz on c1 and immediately publishes it (same as the builder flow). */
export async function addDebugQuizAction() {
  const created = await createQuiz('c1');
  if (!created.ok) return;
  const quiz = await getQuizForInstructor(created.quizId);
  if (!quiz) return;
  await saveQuiz(created.quizId, {
    title: 'Server Action Test Quiz',
    description: 'temporary',
    status: 'open',
    durationMinutes: quiz.durationMinutes,
    passingPercent: quiz.passingPercent,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      type: q.type,
      text: q.text,
      options: q.options,
      correctOptionIndex: q.correctOptionIndex,
      points: q.points,
    })),
  });
}
