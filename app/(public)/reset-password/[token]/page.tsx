import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import ResetPasswordForm from '@/components/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset password',
  description: 'Set a new password for your LearnHub account.',
};

/**
 * Reset password page.
 * In Next.js 16, params is a Promise — must be awaited.
 * The token is passed down as a prop to the client form component,
 * keeping this page a Server Component (so metadata works).
 */
export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <PageContainer narrow>
      <div
        style={{
          padding: 'var(--space-12) 0',
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Logo + heading */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <Link
            href="/"
            aria-label="LearnHub home"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: 'var(--space-4)',
              color: 'var(--color-text)',
              fontWeight: 700,
              fontSize: '20px',
            }}
          >
            <BookOpen size={24} style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
            LearnHub
          </Link>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: 'var(--space-2)',
            }}
          >
            Set a new password
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--color-text-muted)' }}>
            Your new password must be at least 8 characters.
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-card)',
            padding: 'var(--space-8)',
          }}
        >
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </PageContainer>
  );
}
