import type { Metadata } from 'next';
import PageContainer from '@/components/PageContainer';

export const metadata: Metadata = {
  title: 'Courses',
  description: 'Browse all free and paid courses on LearnHub.',
};

/**
 * Course listing page — placeholder for Phase 2 layout verification.
 * Will be fully built in Phase 3 with mock data from lib/api.ts,
 * CourseCard components, search, and filtering.
 */
export default function CoursesPage() {
  return (
    <PageContainer>
      <div style={{ padding: 'var(--space-8) 0' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 600,
            color: 'var(--color-text)',
            marginBottom: 'var(--space-2)',
          }}
        >
          Browse Courses
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '16px', marginBottom: 'var(--space-8)' }}>
          All free and paid courses — fully built in Phase 3.
        </p>

        {/* Placeholder course grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-6)',
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <PlaceholderCard key={i} index={i + 1} />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

function PlaceholderCard({ index }: { index: number }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
      }}
    >
      {/* Thumbnail placeholder */}
      <div
        style={{
          height: '160px',
          backgroundColor: 'var(--color-bg-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
          Thumbnail {index}
        </span>
      </div>
      {/* Card body */}
      <div style={{ padding: 'var(--space-4)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--space-2)' }}>
          Course title {index}
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
          Instructor name
        </p>
        <span
          style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: '#eff6ff',
            color: 'var(--color-primary)',
            fontSize: '12px',
            fontWeight: 500,
          }}
        >
          Phase 2 placeholder
        </span>
      </div>
    </div>
  );
}
