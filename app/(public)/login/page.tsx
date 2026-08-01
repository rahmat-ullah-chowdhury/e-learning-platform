import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Log in to your LearnHub account.',
};

/**
 * Login page — server component shell wrapping the 'use client' LoginForm.
 * Splitting shell / form keeps metadata available (metadata only works in
 * Server Components) while allowing form interactivity.
 */
export default function LoginPage() {
  return (
    <PageContainer narrow>
      <div
        style={{
          padding: 'var(--space-12) 0 var(--space-12)',
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
            Welcome back
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--color-text-muted)' }}>
            Log in to continue learning
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
          <LoginForm />
        </div>
      </div>
    </PageContainer>
  );
}
