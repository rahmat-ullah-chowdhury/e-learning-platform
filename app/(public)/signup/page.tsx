import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import SignupForm from '@/components/SignupForm';

export const metadata: Metadata = {
  title: 'Sign up',
  description: 'Create your free LearnHub account and start learning today.',
};

export default function SignupPage() {
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
            Create your account
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--color-text-muted)' }}>
            Join thousands of learners — it&apos;s free to get started
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
          <SignupForm />
        </div>
      </div>
    </PageContainer>
  );
}
