import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getQuizForInstructor, getInstructorCourseById } from '@/lib/api';
import QuizBuilderForm from '@/components/QuizBuilderForm';
import StatusBadge from '@/components/StatusBadge';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Quiz Builder — Instructor',
  description: 'Build and edit your quiz questions and settings.',
};

/**
 * Instructor — Quiz Builder.
 *
 * Server component shell for the quiz builder. Fetches the FULL Quiz type
 * (including correctOptionIndex) server-side — this is the instructor's own
 * quiz, and the answers never pass through any student-facing API. The client
 * form persists edits via the saveQuizAction server action.
 */
export default async function QuizBuilderPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const quiz = await getQuizForInstructor(params.id);
  if (!quiz) notFound();

  // For a "back to course" link in the header
  const course = (await getInstructorCourseById(quiz.courseId))?.course ?? null;

  return (
    <div>
      {/* Back link */}
      <Link
        href={
          course
            ? `/instructor/courses/${course.id}/edit`
            : '/instructor/courses'
        }
        id="quiz-builder-back"
        className="flex items-center gap-1"
        style={{
          fontSize: '14px',
          color: 'var(--color-text-muted)',
          marginBottom: 'var(--space-4)',
        }}
      >
        <ArrowLeft size={14} aria-hidden="true" />
        {course ? `Back to ${course.title}` : 'Back to My Courses'}
      </Link>

      {/* Header */}
      <div
        className="flex flex-wrap items-center justify-between gap-4"
        style={{ marginBottom: 'var(--space-8)' }}
      >
        <div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 600,
              color: 'var(--color-text)',
              margin: '0 0 var(--space-1) 0',
            }}
          >
            {quiz.title}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', margin: 0 }}>
            {course ? `For ${course.title}` : 'Quiz'} · {quiz.questions.length} questions · {quiz.maxScore} points
          </p>
        </div>
        <StatusBadge status={quiz.status} />
      </div>

      {/* Builder */}
      <section
        style={{
          backgroundColor: 'var(--color-bg)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-card)',
          padding: 'var(--space-6)',
        }}
      >
        <QuizBuilderForm initialQuiz={quiz} />
      </section>
    </div>
  );
}
