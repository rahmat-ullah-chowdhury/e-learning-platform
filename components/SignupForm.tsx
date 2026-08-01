'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import FormField from '@/components/FormField';
import { signup } from '@/lib/api';

// ─── Zod schema ───────────────────────────────────────────────────────────────

const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(80, 'Name must be 80 characters or fewer'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFields = { name: string; email: string; password: string; confirmPassword: string };
type FieldErrors = Partial<Record<keyof SignupFields, string>>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function SignupForm() {
  const router = useRouter();

  const [values, setValues] = useState<SignupFields>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (field: keyof SignupFields) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    if (globalError) setGlobalError('');
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = signupSchema.safeParse(values);
    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof SignupFields;
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    setGlobalError('');

    try {
      const res = await signup({
        name: result.data.name,
        email: result.data.email,
        password: result.data.password,
      });
      if (!res.ok) {
        setGlobalError(res.error);
      } else {
        router.push(res.redirectTo);
      }
    } catch {
      setGlobalError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Sign up form">
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
          id="name"
          label="Full name"
          type="text"
          placeholder="Jane Smith"
          autoComplete="name"
          value={values.name}
          onChange={set('name')}
          error={fieldErrors.name}
          required
          disabled={submitting}
        />

        <FormField
          id="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={values.email}
          onChange={set('email')}
          error={fieldErrors.email}
          required
          disabled={submitting}
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          placeholder="Min 8 chars, 1 uppercase, 1 number"
          autoComplete="new-password"
          value={values.password}
          onChange={set('password')}
          error={fieldErrors.password}
          required
          disabled={submitting}
        />

        <FormField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={set('confirmPassword')}
          error={fieldErrors.confirmPassword}
          required
          disabled={submitting}
        />

        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>
          By signing up, you agree to our{' '}
          <Link href="/terms" style={{ color: 'var(--color-primary)' }}>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" style={{ color: 'var(--color-primary)' }}>
            Privacy Policy
          </Link>
          .
        </p>

        <button
          id="signup-submit"
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
          {submitting ? 'Creating account…' : 'Create account'}
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
        Already have an account?{' '}
        <Link
          href="/login"
          id="signup-login-link"
          style={{ color: 'var(--color-primary)', fontWeight: 500 }}
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
