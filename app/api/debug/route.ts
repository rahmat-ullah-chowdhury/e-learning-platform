import { NextResponse } from 'next/server';
import {
  getInstructorCourseById,
  saveLessons,
  getInstructorCourses,
  createQuiz,
  getQuizForInstructor,
  saveQuiz,
  getQuizzesByCourseId,
  getQuizById,
} from '@/lib/api';

/**
 * TEMPORARY debug route (deleted after verification).
 *
 * Simulates exactly what the instructor UI server actions do, then proves the
 * mutations are visible to a SEPARATE request (i.e. the mock data lives in one
 * shared module-level store that every page/action reads from).
 *
 *   ?step=mutate  → adds a lesson to c1, creates a quiz on c1, publishes it
 *   ?step=verify  → reads everything back (separate request)
 *   ?step=cleanup → removes what mutate added
 */

// Remember what we added so cleanup can remove it
let addedLessonId: string | null = null;
let addedQuizId: string | null = null;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const step = url.searchParams.get('step') ?? 'verify';

  if (step === 'mutate') {
    // Add a lesson to c1 (same call the LessonEditor's Save button makes)
    const data = await getInstructorCourseById('c1');
    if (!data) return NextResponse.json({ error: 'c1 not found' }, { status: 404 });
    addedLessonId = `debug-l1-${Date.now()}`;
    const toInput = (l: (typeof data.lessons)[number]) => ({
      id: l.id,
      title: l.title,
      contentType: l.contentType,
      durationSeconds: l.durationSeconds ?? 0,
      isFreePreview: l.isFreePreview,
    });
    const lessons = [
      ...data.lessons.map(toInput),
      { id: addedLessonId, title: 'Debug Test Lesson', contentType: 'video' as const, durationSeconds: 300, isFreePreview: false },
    ];
    const saved = await saveLessons('c1', lessons);
    if (!saved.ok) return NextResponse.json({ error: saved.error }, { status: 500 });

    // Create + publish a quiz on c1 (same calls the quiz builder makes)
    const created = await createQuiz('c1');
    if (!created.ok) return NextResponse.json({ error: created.error }, { status: 500 });
    addedQuizId = created.quizId;
    const quiz = await getQuizForInstructor(addedQuizId);
    if (!quiz) return NextResponse.json({ error: 'quiz missing' }, { status: 500 });
    const published = await saveQuiz(addedQuizId, {
      title: 'Debug Test Quiz',
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
    if (!published.ok) return NextResponse.json({ error: published.error }, { status: 500 });

    return NextResponse.json({ ok: true, addedLessonId, addedQuizId });
  }

  if (step === 'cleanup') {
    const data = await getInstructorCourseById('c1');
    if (data && addedLessonId) {
      await saveLessons(
        'c1',
        data.lessons
          .filter((l) => l.id !== addedLessonId)
          .map((l) => ({
            id: l.id,
            title: l.title,
            contentType: l.contentType,
            durationSeconds: l.durationSeconds ?? 0,
            isFreePreview: l.isFreePreview,
          }))
      );
    }
    return NextResponse.json({ ok: true });
  }

  // verify — fresh read in this (separate) request
  const courses = await getInstructorCourses();
  const c1 = courses.find((c) => c.course.id === 'c1');
  const studentView = await getQuizzesByCourseId('c1');
  const debugQuiz = addedQuizId ? await getQuizById(addedQuizId) : null;
  return NextResponse.json({
    c1LessonCount: c1?.lessonCount ?? null,
    c1QuizCount: c1?.quizCount ?? null,
    studentVisibleQuizzes: studentView.map((q) => ({ id: q.id, title: q.title, status: q.status })),
    debugQuizVisibleToStudents: debugQuiz !== null,
    debugQuizId: addedQuizId,
  });
}
