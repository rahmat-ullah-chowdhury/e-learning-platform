import { getEnrollmentBySlug, getQuizzesByCourseId } from '@/lib/api';
import CourseSidebar from '@/components/CourseSidebar';
import ProgressBar from '@/components/ProgressBar';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata(props: { params: Promise<{ courseSlug: string }> }) {
  const params = await props.params;
  return { title: `Course Overview — ${params.courseSlug}` };
}

/**
 * Course Player — Overview page (root of /learn/[courseSlug]).
 *
 * Shows the sidebar and a curriculum overview indicating which lessons to do next.
 * Awaits params per Next.js 16.
 */
export default async function CoursePlayerOverview(props: {
  params: Promise<{ courseSlug: string }>;
}) {
  const params = await props.params;
  const [data, quizzes] = await Promise.all([
    getEnrollmentBySlug(params.courseSlug),
    Promise.resolve([]), // quizzes fetched below after we have course.id
  ]);

  if (!data) {
    notFound();
  }

  const { course, enrollment, lessons, progress } = data;
  const courseQuizzes = await getQuizzesByCourseId(course.id);

  const completedCount = lessons.filter((l) =>
    progress.some((p) => p.lessonId === l.id && p.completed)
  ).length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <CourseSidebar
        courseTitle={course.title}
        courseSlug={course.slug}
        lessons={lessons}
        progress={progress}
      />

      <main
        className="md:ml-[320px]"
        style={{
          padding: 'var(--space-8) var(--space-4)',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 600,
            color: 'var(--color-text)',
            margin: '0 0 var(--space-2) 0',
          }}
        >
          {course.title}
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: 'var(--color-text-muted)',
            margin: '0 0 var(--space-8) 0',
          }}
        >
          {course.description}
        </p>

        {/* Progress Summary */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-6)',
            marginBottom: 'var(--space-8)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-4)',
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Course Progress</h2>
            <span style={{ fontSize: '14px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              {completedCount} of {lessons.length} lessons completed
            </span>
          </div>
          <ProgressBar percent={enrollment.progressPercent} size="md" showLabel />
        </div>

        {/* Curriculum List */}
        <div>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--color-text)',
              margin: '0 0 var(--space-4) 0',
            }}
          >
            Curriculum
          </h2>
          <div
            style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
            }}
          >
            {lessons.map((lesson, index) => {
              const isCompleted = progress.some((p) => p.lessonId === lesson.id && p.completed);
              return (
                <Link
                  key={lesson.id}
                  href={`/learn/${course.slug}/${lesson.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-4)',
                    borderBottom: index < lessons.length - 1 ? '1px solid var(--color-border)' : 'none',
                    backgroundColor: 'var(--color-bg)',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                  className="hover:bg-slate-50"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: isCompleted ? 'var(--color-success)' : 'var(--color-bg-subtle)',
                        color: isCompleted ? '#fff' : 'var(--color-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </span>
                    <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text)' }}>
                      {lesson.title}
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--color-primary)' }}>
                    {isCompleted ? 'Review' : 'Start'}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Quizzes section */}
          {courseQuizzes.length > 0 && (
            <div style={{ marginTop: 'var(--space-8)' }}>
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  margin: '0 0 var(--space-4) 0',
                }}
              >
                Quizzes
              </h2>
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
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-4)',
                      borderBottom:
                        index < courseQuizzes.length - 1
                          ? '1px solid var(--color-border)'
                          : 'none',
                      backgroundColor: 'var(--color-bg)',
                    }}
                  >
                    <div>
                      <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text)', margin: '0 0 4px 0' }}>
                        {quiz.title}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>
                        {quiz.questions.length} questions · {quiz.durationMinutes} min · Pass at {quiz.passingPercent}%
                      </p>
                    </div>
                    <Link
                      href={`/exam/${quiz.id}/start`}
                      id={`quiz-start-${quiz.id}`}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'var(--color-primary)',
                        color: '#fff',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px',
                        fontWeight: 500,
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Take Quiz
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
