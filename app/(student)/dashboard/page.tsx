import { getEnrollments, getCurrentUser } from '@/lib/api';
import EnrolledCourseCard from '@/components/EnrolledCourseCard';
import ProgressBar from '@/components/ProgressBar';
import Link from 'next/link';
import { BookOpen, TrendingUp, Award } from 'lucide-react';

export const metadata = {
  title: 'Dashboard — LearnHub',
  description: 'Your learning dashboard. Track your enrolled courses, progress, and achievements.',
};

// Mock phase: re-query the shared mock source on every visit (see /instructor).
export const dynamic = 'force-dynamic';

/**
 * Student Dashboard — Overview page.
 *
 * Shows:
 * - Welcome greeting
 * - Stats row (enrolled, in progress, completed)
 * - Continue Learning section (active courses with progress)
 * - Recently enrolled section
 * - Empty state CTA if no enrollments
 */
export default async function DashboardPage() {
  const [user, enrollments] = await Promise.all([
    getCurrentUser(),
    getEnrollments(),
  ]);

  const totalEnrolled = enrollments.length;
  const inProgress = enrollments.filter(
    (e) => e.enrollment.status === 'active' && e.enrollment.progressPercent > 0
  );
  const completed = enrollments.filter(
    (e) => e.enrollment.status === 'completed'
  );
  const notStarted = enrollments.filter(
    (e) => e.enrollment.status === 'active' && e.enrollment.progressPercent === 0
  );

  const continueItems = inProgress.sort(
    (a, b) => b.enrollment.progressPercent - a.enrollment.progressPercent
  );

  const firstName = user?.name?.split(' ')[0] ?? 'Student';

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 600,
            color: 'var(--color-text)',
            margin: '0 0 var(--space-1) 0',
          }}
        >
          Welcome back, {firstName}
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', margin: 0 }}>
          Here&apos;s an overview of your learning journey.
        </p>
      </div>

      {/* Stats row */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        style={{ marginBottom: 'var(--space-8)' }}
      >
        <StatCard
          icon={<BookOpen size={20} style={{ color: 'var(--color-primary)' }} />}
          label="Enrolled"
          value={totalEnrolled}
          bgColor="rgba(37, 99, 235, 0.08)"
        />
        <StatCard
          icon={<TrendingUp size={20} style={{ color: 'var(--color-warning)' }} />}
          label="In Progress"
          value={inProgress.length}
          bgColor="rgba(217, 119, 6, 0.08)"
        />
        <StatCard
          icon={<Award size={20} style={{ color: 'var(--color-success)' }} />}
          label="Completed"
          value={completed.length}
          bgColor="rgba(22, 163, 74, 0.08)"
        />
      </div>

      {/* Empty state */}
      {totalEnrolled === 0 && (
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
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--color-text)',
              margin: '0 0 var(--space-2) 0',
            }}
          >
            No courses yet
          </h2>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--color-text-muted)',
              margin: '0 0 var(--space-6) 0',
            }}
          >
            Start learning by browsing our course catalogue.
          </p>
          <Link
            href="/courses"
            id="dashboard-browse-courses"
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              padding: '10px 24px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 500,
              fontSize: '14px',
              textDecoration: 'none',
              transition: 'background-color 0.15s ease',
            }}
          >
            Browse Courses
          </Link>
        </div>
      )}

      {/* Continue Learning */}
      {continueItems.length > 0 && (
        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--color-text)',
              margin: '0 0 var(--space-4) 0',
            }}
          >
            Continue Learning
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            {continueItems.map((item) => (
              <Link
                key={item.enrollment.id}
                href={`/learn/${item.course.slug}`}
                id={`continue-${item.course.slug}`}
                className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                  padding: 'var(--space-4)',
                  backgroundColor: 'var(--color-bg)',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'box-shadow 0.2s ease',
                }}
              >
                {/* Mini thumbnail */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <BookOpen size={24} style={{ color: 'rgba(255,255,255,0.6)' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      margin: '0 0 6px 0',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.course.title}
                  </p>
                  <ProgressBar percent={item.enrollment.progressPercent} size="sm" showLabel />
                </div>
                <span
                  className="hidden sm:inline"
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                    flexShrink: 0,
                  }}
                >
                  Continue →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recently Enrolled / All Courses Grid */}
      {totalEnrolled > 0 && (
        <section>
          <div
            className="flex items-center justify-between"
            style={{ marginBottom: 'var(--space-4)' }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 600,
                color: 'var(--color-text)',
                margin: 0,
              }}
            >
              Your Courses
            </h2>
            <Link
              href="/dashboard/courses"
              id="dashboard-view-all-courses"
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--color-primary)',
                textDecoration: 'none',
              }}
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.slice(0, 3).map((item) => (
              <EnrolledCourseCard key={item.enrollment.id} data={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ── Stat card sub-component ─────────────────────────────── */
function StatCard({
  icon,
  label,
  value,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  bgColor: string;
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-card)',
        padding: 'var(--space-4) var(--space-6)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--color-text)',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {value}
        </p>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            margin: 0,
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}
