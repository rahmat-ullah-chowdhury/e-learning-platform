import { getEnrollments } from '@/lib/api';
import EnrolledCourseCard from '@/components/EnrolledCourseCard';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'My Courses — LearnHub',
  description: 'View and manage all your enrolled courses.',
};

/**
 * My Courses page — full listing of enrolled courses with filter tabs.
 *
 * Filters: All / In Progress / Completed
 * Uses searchParams for tab state (server component).
 */
export default async function MyCoursesPage(props: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const searchParams = await props.searchParams;
  const filter = searchParams.filter ?? 'all';
  const enrollments = await getEnrollments();

  let filtered = enrollments;
  if (filter === 'in-progress') {
    filtered = enrollments.filter(
      (e) => e.enrollment.status === 'active' && e.enrollment.progressPercent > 0
    );
  } else if (filter === 'completed') {
    filtered = enrollments.filter((e) => e.enrollment.status === 'completed');
  } else if (filter === 'not-started') {
    filtered = enrollments.filter(
      (e) => e.enrollment.status === 'active' && e.enrollment.progressPercent === 0
    );
  }

  const tabs = [
    { key: 'all', label: 'All', count: enrollments.length },
    {
      key: 'in-progress',
      label: 'In Progress',
      count: enrollments.filter(
        (e) => e.enrollment.status === 'active' && e.enrollment.progressPercent > 0
      ).length,
    },
    {
      key: 'completed',
      label: 'Completed',
      count: enrollments.filter((e) => e.enrollment.status === 'completed').length,
    },
    {
      key: 'not-started',
      label: 'Not Started',
      count: enrollments.filter(
        (e) => e.enrollment.status === 'active' && e.enrollment.progressPercent === 0
      ).length,
    },
  ];

  return (
    <div>
      <h1
        style={{
          fontSize: '28px',
          fontWeight: 600,
          color: 'var(--color-text)',
          margin: '0 0 var(--space-6) 0',
        }}
      >
        My Courses
      </h1>

      {/* Filter tabs */}
      <div
        className="flex flex-wrap gap-2"
        style={{ marginBottom: 'var(--space-6)' }}
      >
        {tabs.map((tab) => {
          const active = filter === tab.key;
          return (
            <Link
              key={tab.key}
              href={tab.key === 'all' ? '/dashboard/courses' : `/dashboard/courses?filter=${tab.key}`}
              id={`courses-filter-${tab.key}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: active ? 600 : 400,
                color: active ? '#fff' : 'var(--color-text-muted)',
                backgroundColor: active
                  ? 'var(--color-primary)'
                  : 'var(--color-bg)',
                border: active
                  ? 'none'
                  : '1px solid var(--color-border)',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: active
                    ? 'rgba(255,255,255,0.2)'
                    : 'var(--color-bg-subtle)',
                  borderRadius: '9999px',
                  padding: '1px 8px',
                  color: active ? '#fff' : 'var(--color-text-muted)',
                }}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Course grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <EnrolledCourseCard key={item.enrollment.id} data={item} />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--space-12) var(--space-4)',
            backgroundColor: 'var(--color-bg)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <BookOpen
            size={48}
            style={{ color: 'var(--color-text-muted)', margin: '0 auto var(--space-4)' }}
          />
          <p
            style={{
              fontSize: '15px',
              color: 'var(--color-text-muted)',
              margin: '0 0 var(--space-4) 0',
            }}
          >
            {filter === 'all'
              ? 'You haven\'t enrolled in any courses yet.'
              : `No ${tabs.find((t) => t.key === filter)?.label.toLowerCase() ?? ''} courses.`}
          </p>
          {filter === 'all' && (
            <Link
              href="/courses"
              id="my-courses-browse"
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                padding: '10px 24px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 500,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              Browse Courses
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
