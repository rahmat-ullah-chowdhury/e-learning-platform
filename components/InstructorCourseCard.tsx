import Link from 'next/link';
import StatusBadge from './StatusBadge';
import type { InstructorCourseSummary } from '@/lib/api';
import { formatPrice } from '@/lib/api';
import { Star, Users, BookOpen, ListChecks, Pencil } from 'lucide-react';

/**
 * InstructorCourseCard — Card for the instructor "My Courses" list.
 *
 * Shows management data rather than student-facing data: status, student
 * count, lesson/quiz counts, rating and an Edit action.
 * Uses the platform card pattern: --shadow-card, --radius-md, hover lift.
 */

interface InstructorCourseCardProps {
  data: InstructorCourseSummary;
}

/** Deterministic colour for the thumbnail placeholder */
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Programming: '#1e3a5f',
    'Web Development': '#1a3a2a',
    'Data Science': '#2d1b5e',
    Design: '#5e1b1b',
    Business: '#1b3a5e',
    Cloud: '#1b4a5e',
    Marketing: '#5e3a1b',
  };
  return colors[category] ?? '#1e293b';
}

export default function InstructorCourseCard({ data }: InstructorCourseCardProps) {
  const { course, lessonCount, quizCount } = data;
  const isFree = course.pricePence === 0;

  return (
    <article
      className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5"
      style={{
        backgroundColor: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      }}
    >
      {/* Thumbnail placeholder */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '16/9',
          backgroundColor: getCategoryColor(course.category),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            fontSize: '36px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.15)',
            userSelect: 'none',
          }}
        >
          {course.category.charAt(0)}
        </span>
        {/* Status badge overlay */}
        <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
          <StatusBadge status={course.status} />
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          padding: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          flex: 1,
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            color: 'var(--color-secondary)',
          }}
        >
          {course.category}
        </span>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--color-text)',
            lineHeight: 1.35,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {course.title}
        </h3>

        {/* Meta stats */}
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-1"
          style={{ marginTop: 'auto', paddingTop: 'var(--space-2)' }}
        >
          <MetaItem icon={<Users size={12} />}>
            {course.enrollmentCount.toLocaleString('en-GB')}
          </MetaItem>
          <MetaItem icon={<BookOpen size={12} />}>{lessonCount} lessons</MetaItem>
          <MetaItem icon={<ListChecks size={12} />}>{quizCount} quizzes</MetaItem>
        </div>
      </div>

      {/* Footer — price / rating / edit */}
      <div
        style={{
          padding: 'var(--space-3) var(--space-4)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-3)',
        }}
      >
        <div className="flex items-center gap-3">
          <span
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: isFree ? 'var(--color-success)' : 'var(--color-text)',
            }}
          >
            {formatPrice(course.pricePence)}
          </span>
          {course.averageRating !== null && (
            <span className="flex items-center gap-1" style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              <Star size={12} style={{ color: '#f59e0b', fill: '#f59e0b' }} aria-hidden="true" />
              {course.averageRating.toFixed(1)}
            </span>
          )}
        </div>
        <Link
          href={`/instructor/courses/${course.id}/edit`}
          id={`edit-course-${course.id}`}
          className="flex items-center gap-1"
          style={{
            padding: '8px 14px',
            backgroundColor: 'var(--color-bg-subtle)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-text)',
            fontSize: '13px',
            fontWeight: 500,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'background-color 0.15s ease, border-color 0.15s ease',
          }}
        >
          <Pencil size={13} aria-hidden="true" />
          Edit
        </Link>
      </div>
    </article>
  );
}

function MetaItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span
      className="flex items-center gap-1"
      style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}
    >
      {icon}
      {children}
    </span>
  );
}
