import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot password',
  description: 'Reset your LearnHub account password.',
};

export default function ForgotPasswordPage() {
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
            Forgot your password?
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', maxWidth: '340px', margin: '0 auto' }}>
            Enter your email and we&apos;ll send a link to reset it.
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
          <ForgotPasswordForm />
        </div>
      </div>
    </PageContainer>
  );
}
