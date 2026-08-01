import type { Metadata } from 'next';
import { SlidersHorizontal } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import CourseCard from '@/components/CourseCard';
import { getCourses, getCategories } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Courses',
  description:
    'Browse all free and paid courses on LearnHub — learn at your own pace from expert instructors.',
};

/**
 * Course listing page.
 * searchParams: ?category=X&search=Y
 *
 * In Next.js 16, searchParams is a Promise — must be awaited.
 */
export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category, search } = await searchParams;

  const [courses, categories] = await Promise.all([
    getCourses({ category, search }),
    getCategories(),
  ]);

  return (
    <PageContainer>
      <div style={{ padding: 'var(--space-8) 0 var(--space-12)' }}>
        {/* ── Page header ────────────────────────────────────── */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: 'var(--space-2)',
            }}
          >
            {category ? `${category} courses` : 'All Courses'}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--color-text-muted)' }}>
            {search
              ? `Showing results for "${search}"`
              : `${courses.length} course${courses.length !== 1 ? 's' : ''} available`}
          </p>
        </div>

        {/* ── Filters bar ────────────────────────────────────── */}
        <div
          className="flex flex-col sm:flex-row gap-3"
          style={{ marginBottom: 'var(--space-8)' }}
        >
          {/* Category filter */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <CategoryPill href="/courses" label="All" active={!category} />
            {categories.map((cat) => (
              <CategoryPill
                key={cat}
                href={`/courses?category=${encodeURIComponent(cat)}`}
                label={cat}
                active={category === cat}
              />
            ))}
          </div>
        </div>

        {/* ── Course grid ────────────────────────────────────── */}
        {courses.length === 0 ? (
          <EmptyState
            message={
              search
                ? `No courses match "${search}". Try a different search term.`
                : category
                ? `No ${category} courses available yet.`
                : 'No courses available yet.'
            }
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

import Link from 'next/link';

function CategoryPill({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      id={`filter-${label.toLowerCase().replace(/\s+/g, '-')}`}
      style={{
        padding: '6px 16px',
        borderRadius: '999px',
        fontSize: '13px',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        border: active ? 'none' : '1px solid var(--color-border)',
        backgroundColor: active ? 'var(--color-primary)' : 'var(--color-bg)',
        color: active ? '#fff' : 'var(--color-text)',
        transition: 'background 0.15s, color 0.15s',
      }}
    >
      {label}
    </Link>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: 'var(--space-12) 0',
        color: 'var(--color-text-muted)',
        fontSize: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-3)',
      }}
      role="status"
    >
      <SlidersHorizontal
        size={32}
        style={{ color: 'var(--color-border)' }}
        aria-hidden="true"
      />
      {message}
    </div>
  );
}
