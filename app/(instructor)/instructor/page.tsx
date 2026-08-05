import { getInstructorCourses, getInstructorQuizzes, getInstructorProfile, formatPrice } from '@/lib/api';
import { createCourseAction } from './courses/actions';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import { BookOpen, Users, ListChecks, BarChart3, Plus, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Instructor Overview',
  description: 'Your instructor dashboard: track courses, students, quizzes, and revenue.',
};

// Mock phase: re-query the shared mock source on every visit so counts and
// listings reflect edits made in the course/quiz editors immediately. Without
// this, Next static-optimizes the page (no dynamic APIs) and serves a frozen
// snapshot (5 min client cache in dev, build-time HTML in prod). Real caching
// strategy (ISR) arrives with the Phase 9+ data layer.
export const dynamic = 'force-dynamic';

/**
 * Instructor — Overview page.
 *
 * Shows headline stats (courses, students, quizzes, estimated revenue), a
 * quick actions bar, and the most recent courses with edit shortcuts.
 * Stats are computed from the mock instructor's courses/quizzes.
 */
export default async function InstructorOverviewPage() {
  const [user, courses, quizzes] = await Promise.all([
    getInstructorProfile(),
    getInstructorCourses(),
    getInstructorQuizzes(),
  ]);

  const totalStudents = courses.reduce((sum, c) => sum + c.course.enrollmentCount, 0);
  const revenuePence = courses.reduce(
    (sum, c) => sum + c.course.pricePence * c.course.enrollmentCount,
    0
  );
  const rated = courses
    .map((c) => c.course.averageRating)
    .filter((r): r is number => r !== null);
  const averageRating =
    rated.length > 0
      ? rated.reduce((sum, r) => sum + r, 0) / rated.length
      : null;

  const firstName = user?.name?.split(' ')[0] ?? 'Instructor';

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
          Here&apos;s how your courses are performing.
        </p>
      </div>

      {/* Stats row */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        style={{ marginBottom: 'var(--space-8)' }}
      >
        <StatCard
          icon={<BookOpen size={20} style={{ color: 'var(--color-primary)' }} />}
          label="Courses"
          value={String(courses.length)}
          bgColor="rgba(37, 99, 235, 0.08)"
        />
        <StatCard
          icon={<Users size={20} style={{ color: 'var(--color-success)' }} />}
          label="Students"
          value={totalStudents.toLocaleString('en-GB')}
          bgColor="rgba(22, 163, 74, 0.08)"
        />
        <StatCard
          icon={<ListChecks size={20} style={{ color: 'var(--color-info)' }} />}
          label="Quizzes"
          value={String(quizzes.length)}
          bgColor="rgba(8, 145, 178, 0.08)"
        />
        <StatCard
          icon={<BarChart3 size={20} style={{ color: 'var(--color-warning)' }} />}
          label="Est. revenue"
          value={formatPrice(revenuePence)}
          bgColor="rgba(217, 119, 6, 0.08)"
        />
      </div>

      {/* Quick actions */}
      <div
        className="flex flex-wrap items-center gap-3"
        style={{ marginBottom: 'var(--space-8)' }}
      >
        <form action={createCourseAction}>
          <button
            type="submit"
            id="instructor-quick-create-course"
            className="flex items-center gap-2"
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
          >
            <Plus size={16} aria-hidden="true" />
            New Course
          </button>
        </form>
        <Link
          href="/instructor/courses"
          id="instructor-quick-manage-courses"
          className="flex items-center gap-2"
          style={{
            padding: '10px 20px',
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-text)',
            fontSize: '14px',
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'background-color 0.15s ease',
          }}
        >
          Manage Courses
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>

      {/* Recent courses */}
      {courses.length > 0 && (
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
              href="/instructor/courses"
              id="instructor-view-all-courses"
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

          <div
            style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              backgroundColor: 'var(--color-bg)',
            }}
          >
            {courses.slice(0, 5).map((item, index) => (
              <div
                key={item.course.id}
                className="flex flex-wrap items-center justify-between gap-3"
                style={{
                  padding: 'var(--space-4)',
                  borderBottom:
                    index < Math.min(courses.length, 5) - 1
                      ? '1px solid var(--color-border)'
                      : 'none',
                  backgroundColor:
                    index % 2 === 0 ? 'var(--color-bg)' : 'var(--color-bg-subtle)',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div className="flex items-center gap-2">
                    <p
                      style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'var(--color-text)',
                        margin: 0,
                      }}
                    >
                      {item.course.title}
                    </p>
                    <StatusBadge status={item.course.status} />
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
                    {item.course.category} · {item.lessonCount} lessons · {item.quizCount} quizzes ·{' '}
                    {item.course.enrollmentCount.toLocaleString('en-GB')} students
                    {averageRating !== null && ` · ★ ${averageRating.toFixed(1)}`}
                  </p>
                </div>
                <Link
                  href={`/instructor/courses/${item.course.id}/edit`}
                  id={`overview-edit-${item.course.id}`}
                  className="flex items-center gap-1"
                  style={{
                    padding: '8px 14px',
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text)',
                    fontSize: '13px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Edit
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {courses.length === 0 && (
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
            Create your first course and start teaching.
          </p>
          <form action={createCourseAction} style={{ display: 'inline-block' }}>
            <button
              type="submit"
              id="instructor-empty-create-course"
              className="flex items-center gap-2"
              style={{
                padding: '10px 24px',
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 500,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <Plus size={16} aria-hidden="true" />
              Create Course
            </button>
          </form>
        </div>
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
  value: string;
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
            fontSize: '22px',
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
