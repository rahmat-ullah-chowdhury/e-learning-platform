import { getInstructorCourses } from '@/lib/api';
import InstructorCourseCard from '@/components/InstructorCourseCard';
import { createCourseAction } from './actions';
import Link from 'next/link';
import { BookOpen, Plus } from 'lucide-react';

export const metadata = {
  title: 'My Courses — Instructor',
  description: 'Manage your courses: create, edit, and publish your content.',
};

/**
 * Instructor — My Courses page.
 *
 * Lists all courses owned by the mock instructor with status filter tabs
 * (All / Draft / Published / Archived) via searchParams, plus a New Course
 * action that creates a draft and redirects into the editor.
 */
export default async function InstructorCoursesPage(props: {
  searchParams: Promise<{ status?: string }>;
}) {
  const searchParams = await props.searchParams;
  const status = searchParams.status ?? 'all';
  const courses = await getInstructorCourses();

  let filtered = courses;
  if (status === 'draft' || status === 'published' || status === 'archived') {
    filtered = courses.filter((c) => c.course.status === status);
  }

  const tabs = [
    { key: 'all', label: 'All', count: courses.length },
    {
      key: 'draft',
      label: 'Drafts',
      count: courses.filter((c) => c.course.status === 'draft').length,
    },
    {
      key: 'published',
      label: 'Published',
      count: courses.filter((c) => c.course.status === 'published').length,
    },
    {
      key: 'archived',
      label: 'Archived',
      count: courses.filter((c) => c.course.status === 'archived').length,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div
        className="flex flex-wrap items-center justify-between gap-4"
        style={{ marginBottom: 'var(--space-6)' }}
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
            My Courses
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', margin: 0 }}>
            Create, edit, and publish your courses.
          </p>
        </div>

        {/* New Course — form action (server component friendly) */}
        <form action={createCourseAction}>
          <button
            type="submit"
            id="instructor-new-course"
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
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2" style={{ marginBottom: 'var(--space-6)' }}>
        {tabs.map((tab) => {
          const active = status === tab.key;
          return (
            <Link
              key={tab.key}
              href={
                tab.key === 'all'
                  ? '/instructor/courses'
                  : `/instructor/courses?status=${tab.key}`
              }
              id={`instructor-courses-filter-${tab.key}`}
              className="flex items-center gap-2"
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: active ? 600 : 400,
                color: active ? '#fff' : 'var(--color-text-muted)',
                backgroundColor: active
                  ? 'var(--color-primary)'
                  : 'var(--color-bg)',
                border: active ? 'none' : '1px solid var(--color-border)',
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

      {/* Course grid / empty state */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <InstructorCourseCard key={item.course.id} data={item} />
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
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--color-text)',
              margin: '0 0 var(--space-2) 0',
            }}
          >
            {status === 'all' ? 'No courses yet' : `No ${tabs.find((t) => t.key === status)?.label.toLowerCase() ?? ''} courses`}
          </h2>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--color-text-muted)',
              margin: '0 0 var(--space-6) 0',
            }}
          >
            {status === 'all'
              ? 'Create your first course to start teaching.'
              : 'Try a different filter or create a new course.'}
          </p>
          {status === 'all' && (
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
          )}
        </div>
      )}
    </div>
  );
}
