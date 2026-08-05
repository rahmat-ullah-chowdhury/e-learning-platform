import { getEnrollmentBySlug, getLessonById } from '@/lib/api';
import CourseSidebar from '@/components/CourseSidebar';
import LessonPlayer from '@/components/LessonPlayer';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export async function generateMetadata(props: { params: Promise<{ courseSlug: string; lessonId: string }> }) {
  const params = await props.params;
  return { title: `Lesson — ${params.lessonId}` };
}

/**
 * Lesson Player page.
 *
 * Renders the sidebar + the actual lesson content via the LessonPlayer client component.
 * Includes Prev/Next lesson navigation.
 */
export default async function LessonPage(props: {
  params: Promise<{ courseSlug: string; lessonId: string }>;
}) {
  const params = await props.params;
  const data = await getEnrollmentBySlug(params.courseSlug);
  const lessonDetail = await getLessonById(params.lessonId);

  if (!data || !lessonDetail) {
    notFound();
  }

  const { course, lessons, progress } = data;
  const isCompleted = progress.some((p) => p.lessonId === params.lessonId && p.completed);

  // Find prev/next lessons
  const currentIndex = lessons.findIndex((l) => l.id === params.lessonId);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <CourseSidebar
        courseTitle={course.title}
        courseSlug={course.slug}
        lessons={lessons}
        progress={progress}
        currentLessonId={params.lessonId}
      />

      <main
        className="md:ml-[320px]"
        style={{
          padding: 'var(--space-8) var(--space-4)',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        <LessonPlayer lesson={lessonDetail} isInitiallyCompleted={isCompleted} />

        {/* Prev/Next Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'var(--space-8)',
          }}
        >
          {prevLesson ? (
            <Link
              href={`/learn/${course.slug}/${prevLesson.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
              }}
              className="hover:bg-slate-100"
            >
              <ArrowLeft size={16} /> Previous Lesson
            </Link>
          ) : (
            <div /> // Spacer
          )}

          {nextLesson ? (
            <Link
              href={`/learn/${course.slug}/${nextLesson.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
              }}
              className="hover:bg-slate-100"
            >
              Next Lesson <ArrowRight size={16} />
            </Link>
          ) : (
            <Link
              href={`/dashboard`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: 'var(--color-primary)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Finish Course
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
