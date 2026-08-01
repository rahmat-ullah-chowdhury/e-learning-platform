import Link from 'next/link';
import { Star, Users, BookOpen, Clock } from 'lucide-react';
import type { CourseListItem } from '@/types';
import { formatPrice, formatDuration } from '@/lib/api';

interface CourseCardProps {
  course: CourseListItem;
  /** Variant controls the CTA and any progress display */
  variant?: 'default' | 'enrolled' | 'completed';
  /** 0–100, shown when variant is 'enrolled' */
  progressPercent?: number;
}

/**
 * CourseCard — the dominant card UI pattern used across the platform.
 * Design.md: white bg, --shadow-card, --radius-md, hover lifts shadow.
 *
 * Variants:
 *  - default    → for browse/listing (unauthenticated or not enrolled)
 *  - enrolled   → shows progress bar (student dashboard)
 *  - completed  → shows "Completed" badge (student dashboard)
 */
export default function CourseCard({
  course,
  variant = 'default',
  progressPercent = 0,
}: CourseCardProps) {
  const isFree = course.pricePence === 0;

  return (
    <Link
      href={`/courses/${course.slug}`}
      id={`course-card-${course.id}`}
      className="group block"
      style={{ textDecoration: 'none' }}
    >
      <article
        style={{
          backgroundColor: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-card)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        }}
        className="group-hover:shadow-md group-hover:-translate-y-0.5"
      >
        {/* ── Thumbnail ──────────────────────────────────────── */}
        <CourseThumbnail
          thumbnailUrl={course.thumbnailUrl}
          category={course.category}
          isFree={isFree}
          variant={variant}
        />

        {/* ── Body ───────────────────────────────────────────── */}
        <div
          style={{
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            flex: 1,
          }}
        >
          {/* Category label */}
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

          {/* Title */}
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--color-text)',
              lineHeight: 1.35,
              /* clamp to 2 lines */
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {course.title}
          </h3>

          {/* Instructor */}
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            {course.instructorName}
          </p>

          {/* Rating row */}
          {course.averageRating !== null && (
            <div className="flex items-center gap-1">
              <Star
                size={13}
                style={{ color: '#f59e0b', fill: '#f59e0b' }}
                aria-hidden="true"
              />
              <span
                style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}
              >
                {course.averageRating.toFixed(1)}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                ({course.enrollmentCount.toLocaleString('en-GB')})
              </span>
            </div>
          )}

          {/* Meta row — lessons / duration */}
          <div
            className="flex items-center gap-3"
            style={{ marginTop: 'auto', paddingTop: 'var(--space-2)' }}
          >
            <MetaBadge icon={<BookOpen size={12} />}>
              {course.lessonCount} lessons
            </MetaBadge>
          </div>

          {/* Progress bar (enrolled variant) */}
          {variant === 'enrolled' && (
            <ProgressBar percent={progressPercent} />
          )}
        </div>

        {/* ── Footer — price / status ─────────────────────────── */}
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Price */}
          <span
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: isFree ? 'var(--color-success)' : 'var(--color-text)',
            }}
          >
            {formatPrice(course.pricePence)}
          </span>

          {/* Variant CTA badge */}
          {variant === 'completed' && (
            <StatusBadge color="success">Completed</StatusBadge>
          )}
          {variant === 'enrolled' && (
            <StatusBadge color="info">In progress</StatusBadge>
          )}
          {variant === 'default' && !isFree && (
            <span
              style={{
                fontSize: '12px',
                color: 'var(--color-text-muted)',
              }}
            >
              One-time purchase
            </span>
          )}
          {variant === 'default' && isFree && (
            <StatusBadge color="success">Free</StatusBadge>
          )}
        </div>
      </article>
    </Link>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function CourseThumbnail({
  thumbnailUrl,
  category,
  isFree,
  variant,
}: {
  thumbnailUrl?: string;
  category: string;
  isFree: boolean;
  variant: CourseCardProps['variant'];
}) {
  // Category → background colour mapping for placeholder thumbnails
  const categoryColors: Record<string, string> = {
    'Programming':     '#1e3a5f',
    'Web Development': '#1a3a2a',
    'Data Science':    '#2d1b5e',
    'Design':          '#5e1b1b',
    'Business':        '#1b3a5e',
    'Cloud':           '#1b4a5e',
    'Marketing':       '#5e3a1b',
  };
  const bgColor = categoryColors[category] ?? '#1e293b';

  return (
    <div
      style={{
        position: 'relative',
        aspectRatio: '16/9',
        backgroundColor: bgColor,
        overflow: 'hidden',
      }}
    >
      {thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnailUrl}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        /* Placeholder with category initial */
        <div
          className="flex items-center justify-center h-full"
          aria-hidden="true"
        >
          <span
            style={{
              fontSize: '36px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.15)',
              userSelect: 'none',
            }}
          >
            {category.charAt(0)}
          </span>
        </div>
      )}

      {/* Free badge overlay */}
      {isFree && variant === 'default' && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-success)',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.05em',
          }}
        >
          FREE
        </div>
      )}
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
      style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}
    >
      {icon}
      {children}
    </span>
  );
}

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div>
      <div
        style={{
          height: '4px',
          borderRadius: '2px',
          backgroundColor: 'var(--color-bg-subtle)',
          overflow: 'hidden',
          marginTop: 'var(--space-2)',
        }}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${percent}% complete`}
      >
        <div
          style={{
            height: '100%',
            width: `${percent}%`,
            backgroundColor: 'var(--color-primary)',
            borderRadius: '2px',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
        {percent}% complete
      </p>
    </div>
  );
}

function StatusBadge({
  color,
  children,
}: {
  color: 'success' | 'info' | 'warning';
  children: React.ReactNode;
}) {
  const colorMap = {
    success: { bg: '#f0fdf4', text: 'var(--color-success)' },
    info:    { bg: '#eff6ff', text: 'var(--color-primary)' },
    warning: { bg: '#fffbeb', text: 'var(--color-warning)' },
  };
  const { bg, text } = colorMap[color];

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: bg,
        color: text,
        fontSize: '12px',
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
}
