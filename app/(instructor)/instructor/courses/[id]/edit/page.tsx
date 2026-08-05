import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getInstructorCourseById,
  getInstructorQuizzes,
  getCategories,
} from '@/lib/api';
import CourseInfoForm from '@/components/CourseInfoForm';
import LessonEditor from '@/components/LessonEditor';
import StatusBadge from '@/components/StatusBadge';
import { createQuizAction } from './actions';
import { ArrowLeft, Plus, ListChecks, Pencil } from 'lucide-react';

export const metadata = {
  title: 'Edit Course — Instructor',
  description: 'Edit your course details, curriculum, and quizzes.',
};

/**
 * Instructor — Course Editor.
 *
 * Server component shell composing three management surfaces:
 *  1. CourseInfoForm — basic info (title, description, category, price, status, tags)
 *  2. LessonEditor   — curriculum (add/remove/reorder lessons)
 *  3. Quizzes section — list the course's quizzes with edit links + create action
 *
 * Data is fetched server-side (server-only mock API) and forms persist via
 * server actions, keeping mock mutations on the server.
 */
export default async function CourseEditorPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const [data, allQuizzes, categories] = await Promise.all([
    getInstructorCourseById(params.id),
    getInstructorQuizzes(),
    getCategories(),
  ]);

  if (!data) notFound();

  const { course, lessons } = data;
  const courseQuizzes = allQuizzes.filter((q) => q.courseId === course.id);

  return (
    <div>
      {/* Back link */}
      <Link
        href="/instructor/courses"
        id="course-editor-back"
        className="flex items-center gap-1"
        style={{
          fontSize: '14px',
          color: 'var(--color-text-muted)',
          marginBottom: 'var(--space-4)',
        }}
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to My Courses
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
            {course.title}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', margin: 0 }}>
            {course.category} · {course.slug}
          </p>
        </div>
        <StatusBadge status={course.status} />
      </div>

      {/* ── Course info ─────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: 'var(--color-bg)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-card)',
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-6)',
        }}
      >
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--color-text)',
            margin: '0 0 var(--space-4) 0',
          }}
        >
          Course Details
        </h2>
        <CourseInfoForm
          courseId={course.id}
          initialCourse={course}
          categories={categories}
        />
      </section>

      {/* ── Curriculum ──────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: 'var(--color-bg)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-card)',
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-6)',
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{ marginBottom: 'var(--space-4)' }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--color-text)',
              margin: 0,
            }}
          >
            Curriculum
          </h2>
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            {lessons.length} lessons
          </span>
        </div>
        <LessonEditor courseId={course.id} initialLessons={lessons} />
      </section>

      {/* ── Quizzes ─────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: 'var(--color-bg)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-card)',
          padding: 'var(--space-6)',
        }}
      >
        <div
          className="flex flex-wrap items-center justify-between gap-4"
          style={{ marginBottom: 'var(--space-4)' }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--color-text)',
              margin: 0,
            }}
          >
            Quizzes
          </h2>
          <form action={createQuizAction.bind(null, course.id)}>
            <button
              type="submit"
              id="course-create-quiz"
              className="flex items-center gap-1"
              style={{
                padding: '9px 16px',
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
            >
              <Plus size={14} aria-hidden="true" />
              Create Quiz
            </button>
          </form>
        </div>

        {courseQuizzes.length > 0 ? (
          <div
            style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
            }}
          >
            {courseQuizzes.map((quiz, index) => (
              <div
                key={quiz.id}
                className="flex flex-wrap items-center justify-between gap-3"
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  borderBottom:
                    index < courseQuizzes.length - 1
                      ? '1px solid var(--color-border)'
                      : 'none',
                  backgroundColor: 'var(--color-bg)',
                }}
              >
                <div className="flex items-center gap-3" style={{ minWidth: 0 }}>
                  <ListChecks size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'var(--color-text)',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {quiz.title}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
                      {quiz.questions.length} questions · {quiz.durationMinutes} min · Pass at {quiz.passingPercent}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={quiz.status} />
                  <Link
                    href={`/instructor/quizzes/${quiz.id}/edit`}
                    id={`edit-quiz-${quiz.id}`}
                    className="flex items-center gap-1"
                    style={{
                      padding: '7px 12px',
                      backgroundColor: 'var(--color-bg-subtle)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text)',
                      fontSize: '13px',
                      fontWeight: 500,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Pencil size={13} aria-hidden="true" />
                    Build
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', margin: 0 }}>
            No quizzes yet — create one to test your students.
          </p>
        )}
      </section>
    </div>
  );
}
