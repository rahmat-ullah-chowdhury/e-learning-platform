'use client';

import { useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { Loader2, MailCheck } from 'lucide-react';
import FormField from '@/components/FormField';
import { forgotPassword } from '@/lib/api';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
});

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = schema.safeParse({ email });
    if (!result.success) {
      setEmailError(result.error.issues[0].message);
      return;
    }

    setEmailError('');
    setGlobalError('');
    setSubmitting(true);

    try {
      const res = await forgotPassword({ email: result.data.email });
      if (!res.ok) {
        setGlobalError(res.error);
      } else {
        setSent(true);
      }
    } catch {
      setGlobalError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Sent confirmation state ───────────────────────────────────────────────
  if (sent) {
    return (
      <div
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
          padding: 'var(--space-4) 0',
        }}
        role="status"
        aria-live="polite"
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#f0fdf4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MailCheck size={28} style={{ color: 'var(--color-success)' }} aria-hidden="true" />
        </div>
        <div>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: 'var(--space-2)',
            }}
          >
            Check your email
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            If an account exists for <strong>{email}</strong>, we&apos;ve sent a
            password reset link. It may take a few minutes to arrive.
          </p>
        </div>
        <Link
          href="/login"
          id="forgot-back-to-login"
          style={{
            fontSize: '14px',
            color: 'var(--color-primary)',
            fontWeight: 500,
            marginTop: 'var(--space-2)',
          }}
        >
          Back to log in
        </Link>
      </div>
    );
  }

  // ── Form state ────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Forgot password form">
      {globalError && (
        <div
          role="alert"
          style={{
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-error)',
            fontSize: '14px',
            marginBottom: 'var(--space-4)',
          }}
        >
          {globalError}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <FormField
          id="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(val) => {
            setEmail(val);
            if (emailError) setEmailError('');
            if (globalError) setGlobalError('');
          }}
          error={emailError}
          required
          disabled={submitting}
        />

        <button
          id="forgot-submit"
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: submitting ? '#93c5fd' : 'var(--color-primary)',
            color: '#fff',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            fontSize: '15px',
            border: 'none',
            cursor: submitting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'background 0.15s',
          }}
        >
          {submitting && (
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true" />
          )}
          {submitting ? 'Sending…' : 'Send reset link'}
        </button>
      </div>

      <p
        style={{
          textAlign: 'center',
          fontSize: '14px',
          color: 'var(--color-text-muted)',
          marginTop: 'var(--space-6)',
        }}
      >
        Remembered it?{' '}
        <Link
          href="/login"
          id="forgot-login-link"
          style={{ color: 'var(--color-primary)', fontWeight: 500 }}
        >
          Back to log in
        </Link>
      </p>
    </form>
  );
}
