import Link from 'next/link';
import ProgressBar from './ProgressBar';
import StatusBadge from './StatusBadge';
import type { EnrolledCourse } from '@/lib/api';

/**
 * EnrolledCourseCard — Dashboard card showing an enrolled course with progress.
 *
 * Different from the public CourseCard: shows progress bar, status badge,
 * and a contextual CTA ("Continue" / "Review" / "Start").
 * Uses Design.md card styling: --shadow-card, --radius-md, hover lift.
 */

interface EnrolledCourseCardProps {
  data: EnrolledCourse;
}

/** Generate a deterministic colour for the thumbnail placeholder */
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Programming: '#3b82f6',
    'Web Development': '#8b5cf6',
    'Data Science': '#06b6d4',
    Design: '#ec4899',
    Business: '#f59e0b',
    Cloud: '#10b981',
    Marketing: '#f97316',
  };
  return colors[category] ?? '#64748b';
}

function getCtaLabel(status: string, progress: number): string {
  if (status === 'completed') return 'Review';
  if (progress > 0) return 'Continue';
  return 'Start';
}

export default function EnrolledCourseCard({ data }: EnrolledCourseCardProps) {
  const { enrollment, course } = data;
  const ctaLabel = getCtaLabel(enrollment.status, enrollment.progressPercent);

  return (
    <Link
      href={`/learn/${course.slug}`}
      id={`enrolled-course-${course.slug}`}
      className="block shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5"
      style={{
        backgroundColor: 'var(--color-bg)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      {/* Thumbnail placeholder */}
      <div
        style={{
          height: '140px',
          backgroundColor: getCategoryColor(course.category),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <span
          style={{
            color: 'rgba(255,255,255,0.3)',
            fontSize: '48px',
            fontWeight: 700,
          }}
        >
          {course.category.slice(0, 2).toUpperCase()}
        </span>
        {/* Status badge overlay */}
        <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
          <StatusBadge status={enrollment.status} />
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: 'var(--space-4)' }}>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--color-text)',
            margin: '0 0 4px 0',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {course.title}
        </h3>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            margin: '0 0 var(--space-3) 0',
          }}
        >
          {course.instructorName}
        </p>

        {/* Progress bar */}
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <ProgressBar
            percent={enrollment.progressPercent}
            size="sm"
            showLabel
          />
        </div>

        {/* CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: '12px',
              color: 'var(--color-text-muted)',
            }}
          >
            {course.lessonCount} lessons
          </span>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-primary)',
            }}
          >
            {ctaLabel} →
          </span>
        </div>
      </div>
    </Link>
  );
}
