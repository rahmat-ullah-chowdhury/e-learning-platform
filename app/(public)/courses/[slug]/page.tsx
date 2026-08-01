import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  Users,
  BookOpen,
  Clock,
  CheckCircle,
  PlayCircle,
  FileText,
  Download,
  Radio,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import { getCourseBySlug, getLessonsByCourseId, formatPrice, formatDuration } from '@/lib/api';
import type { Lesson } from '@/types';

/**
 * In Next.js 16, params is a Promise — must be awaited.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: 'Course not found' };
  return {
    title: course.title,
    description: course.description.slice(0, 155),
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [course, lessons] = await Promise.all([
    getCourseBySlug(slug),
    getCourseBySlug(slug).then((c) => (c ? getLessonsByCourseId(c.id) : [])),
  ]);

  if (!course) notFound();

  const isFree = course.pricePence === 0;
  const freePreviewLessons = lessons.filter((l) => l.isFreePreview);

  return (
    <>
      {/* ── Course hero / header ─────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
          color: '#fff',
          padding: 'var(--space-8) 0',
        }}
      >
        <PageContainer>
          {/* Back link */}
          <Link
            href="/courses"
            className="flex items-center gap-1"
            style={{
              color: 'rgba(255,255,255,0.65)',
              fontSize: '14px',
              marginBottom: 'var(--space-4)',
            }}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to courses
          </Link>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: course info */}
            <div style={{ flex: 1 }}>
              {/* Category + rating */}
              <div className="flex items-center gap-3" style={{ marginBottom: 'var(--space-3)' }}>
                <span
                  style={{
                    padding: '2px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(124,58,237,0.35)',
                    color: '#c4b5fd',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  {course.category}
                </span>
                {course.averageRating !== null && (
                  <div className="flex items-center gap-1">
                    <Star size={14} style={{ color: '#fbbf24', fill: '#fbbf24' }} aria-hidden="true" />
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>
                      {course.averageRating.toFixed(1)}
                    </span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
                      ({course.enrollmentCount.toLocaleString('en-GB')} students)
                    </span>
                  </div>
                )}
              </div>

              <h1
                style={{
                  fontSize: 'clamp(24px, 4vw, 36px)',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  marginBottom: 'var(--space-3)',
                  color: '#fff',
                }}
              >
                {course.title}
              </h1>

              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.6,
                  maxWidth: '640px',
                  marginBottom: 'var(--space-4)',
                }}
              >
                {course.description}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4">
                <MetaBadge icon={<BookOpen size={14} />}>
                  {course.lessonCount} lessons
                </MetaBadge>
                <MetaBadge icon={<Clock size={14} />}>
                  {formatDuration(course.totalDurationSeconds)}
                </MetaBadge>
                <MetaBadge icon={<Users size={14} />}>
                  {course.enrollmentCount.toLocaleString('en-GB')} enrolled
                </MetaBadge>
              </div>

              <p
                style={{
                  marginTop: 'var(--space-4)',
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.55)',
                }}
              >
                By <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{course.instructorName}</span>
              </p>
            </div>

            {/* Right: enrol card */}
            <div style={{ flexShrink: 0, width: '320px', maxWidth: '100%' }}>
              <EnrolCard
                pricePence={course.pricePence}
                isFree={isFree}
                courseSlug={course.slug}
                freePreviewCount={freePreviewLessons.length}
              />
            </div>
          </div>
        </PageContainer>
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: 'var(--color-bg)',
          padding: 'var(--space-12) 0',
        }}
      >
        <PageContainer>
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left: curriculum + description */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* What you'll learn */}
              <section aria-labelledby="what-learn-heading" style={{ marginBottom: 'var(--space-8)' }}>
                <h2
                  id="what-learn-heading"
                  style={{
                    fontSize: '22px',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  What you&apos;ll learn
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-6)',
                    backgroundColor: 'var(--color-bg-subtle)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  {getWhatYouLearnPoints(course.category).map((point, i) => (
                    <LearnPoint key={i} text={point} />
                  ))}
                </div>
              </section>

              {/* Curriculum */}
              {lessons.length > 0 && (
                <section aria-labelledby="curriculum-heading">
                  <div
                    className="flex items-center justify-between"
                    style={{ marginBottom: 'var(--space-4)' }}
                  >
                    <h2
                      id="curriculum-heading"
                      style={{
                        fontSize: '22px',
                        fontWeight: 600,
                        color: 'var(--color-text)',
                      }}
                    >
                      Course curriculum
                    </h2>
                    <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                      {lessons.length} lessons
                    </span>
                  </div>
                  <div
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                    }}
                  >
                    {lessons.map((lesson, index) => (
                      <LessonRow
                        key={lesson.id}
                        lesson={lesson}
                        index={index}
                        isLast={index === lessons.length - 1}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right (desktop): sticky enrol card re-shown on large screens via CSS */}
            {/* (mobile enrol card is in the hero above) */}
          </div>
        </PageContainer>
      </div>
    </>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function EnrolCard({
  pricePence,
  isFree,
  courseSlug,
  freePreviewCount,
}: {
  pricePence: number;
  isFree: boolean;
  courseSlug: string;
  freePreviewCount: number;
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        overflow: 'hidden',
      }}
    >
      {/* Price */}
      <div style={{ padding: 'var(--space-6)' }}>
        <div
          style={{
            fontSize: '30px',
            fontWeight: 700,
            color: isFree ? 'var(--color-success)' : 'var(--color-text)',
            marginBottom: 'var(--space-4)',
          }}
        >
          {formatPrice(pricePence)}
        </div>

        {/* Primary CTA */}
        <Link
          href={isFree ? '/signup' : `/signup?next=/courses/${courseSlug}`}
          id="enrol-cta"
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '14px',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            fontSize: '16px',
            marginBottom: 'var(--space-3)',
            transition: 'background 0.15s',
          }}
        >
          {isFree ? 'Enrol for free' : 'Buy this course'}
        </Link>

        {/* Secondary CTA: log in if have account */}
        <Link
          href={`/login?next=/courses/${courseSlug}`}
          id="enrol-login"
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '10px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-text-muted)',
            fontSize: '14px',
          }}
        >
          Already have an account? Log in
        </Link>

        {/* Guarantees */}
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '0',
            marginTop: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
          }}
        >
          {[
            'Lifetime access',
            'Certificate on completion',
            freePreviewCount > 0 ? `${freePreviewCount} free preview lessons` : null,
          ]
            .filter(Boolean)
            .map((item) => (
              <li
                key={item as string}
                className="flex items-center gap-2"
                style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}
              >
                <CheckCircle
                  size={14}
                  style={{ color: 'var(--color-success)', flexShrink: 0 }}
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

function LessonRow({
  lesson,
  index,
  isLast,
}: {
  lesson: Lesson;
  index: number;
  isLast: boolean;
}) {
  const iconMap: Record<string, React.ReactNode> = {
    video:    <PlayCircle size={16} aria-hidden="true" />,
    pdf:      <FileText size={16} aria-hidden="true" />,
    download: <Download size={16} aria-hidden="true" />,
    live:     <Radio size={16} aria-hidden="true" />,
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-3) var(--space-4)',
        borderBottom: isLast ? 'none' : '1px solid var(--color-border)',
        backgroundColor: index % 2 === 0 ? 'var(--color-bg)' : 'var(--color-bg-subtle)',
      }}
    >
      {/* Lesson number */}
      <span
        style={{
          fontSize: '12px',
          color: 'var(--color-text-muted)',
          width: '20px',
          flexShrink: 0,
          textAlign: 'right',
        }}
      >
        {index + 1}
      </span>

      {/* Content type icon */}
      <span
        style={{
          color: lesson.isFreePreview ? 'var(--color-primary)' : 'var(--color-text-muted)',
          flexShrink: 0,
        }}
      >
        {lesson.isFreePreview ? iconMap[lesson.contentType] : <Lock size={16} aria-hidden="true" />}
      </span>

      {/* Title */}
      <span
        style={{
          fontSize: '14px',
          color: 'var(--color-text)',
          flex: 1,
        }}
      >
        {lesson.title}
      </span>

      {/* Free preview label / duration */}
      <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
        {lesson.isFreePreview && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--color-primary)',
              padding: '1px 6px',
              backgroundColor: '#eff6ff',
              borderRadius: '4px',
            }}
          >
            Preview
          </span>
        )}
        {lesson.durationSeconds && (
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            {formatDuration(lesson.durationSeconds)}
          </span>
        )}
      </div>
    </div>
  );
}

function MetaBadge({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span
      className="flex items-center gap-1"
      style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)' }}
    >
      {icon}
      {children}
    </span>
  );
}

function LearnPoint({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle
        size={16}
        style={{ color: 'var(--color-success)', marginTop: '2px', flexShrink: 0 }}
        aria-hidden="true"
      />
      <span style={{ fontSize: '14px', color: 'var(--color-text)' }}>{text}</span>
    </div>
  );
}

/** Generic learning outcomes per category — used until real course data has a `whatYouLearn` field */
function getWhatYouLearnPoints(category: string): string[] {
  const defaults: Record<string, string[]> = {
    Programming: [
      'Write clean, readable code from day one',
      'Understand core programming concepts',
      'Build and run your own projects',
      'Debug common errors confidently',
    ],
    'Web Development': [
      'Build responsive websites with HTML & CSS',
      'Add interactivity with JavaScript',
      'Work with modern frameworks',
      'Deploy your projects live',
    ],
    'Data Science': [
      'Analyse real datasets with Python',
      'Visualise data clearly and accurately',
      'Apply basic machine learning models',
      'Communicate insights effectively',
    ],
    Design: [
      'Apply UX research methods',
      'Create wireframes and prototypes',
      'Use industry-standard design tools',
      'Build a professional portfolio',
    ],
    Business: [
      'Apply core business principles',
      'Improve productivity and decision-making',
      'Use professional tools effectively',
      'Communicate clearly in a business context',
    ],
    Cloud: [
      'Understand core cloud concepts',
      'Navigate major cloud services',
      'Prepare for certification exams',
      'Apply cloud architecture best practices',
    ],
    Marketing: [
      'Build an end-to-end marketing strategy',
      'Run paid and organic campaigns',
      'Measure and improve performance',
      'Understand audience targeting',
    ],
  };
  return (
    defaults[category] ?? [
      'Gain practical, job-ready skills',
      'Learn from expert instructors',
      'Complete hands-on projects',
      'Earn a certificate of completion',
    ]
  );
}
