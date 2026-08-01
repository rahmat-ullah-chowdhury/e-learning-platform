import type { Metadata } from 'next';
import PageContainer from '@/components/PageContainer';

export const metadata: Metadata = {
  title: 'LearnHub — Learn skills that matter',
  description:
    'Free and paid courses from expert instructors. Browse, enrol, and learn at your own pace.',
};

/**
 * Home page — placeholder for Phase 2 layout verification.
 * Will be fully built out in Phase 3 (Public Pages).
 */
export default function HomePage() {
  return (
    <PageContainer>
      <div
        style={{
          padding: 'var(--space-12) 0',
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-4)',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '40px',
            fontWeight: 700,
            color: 'var(--color-text)',
            lineHeight: 1.2,
          }}
        >
          Learn skills that matter
        </h1>
        <p
          style={{
            fontSize: '18px',
            color: 'var(--color-text-muted)',
            maxWidth: '520px',
          }}
        >
          Free and paid courses from expert instructors. This page will be fully
          built in Phase 3.
        </p>
        <span
          style={{
            display: 'inline-block',
            padding: '6px 14px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-bg-subtle)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
            fontSize: '13px',
          }}
        >
          Phase 2 placeholder — layout verified ✓
        </span>
      </div>
    </PageContainer>
  );
}
