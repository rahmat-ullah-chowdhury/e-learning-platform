'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { BookOpen, Loader2 } from 'lucide-react';
import FormField from '@/components/FormField';
import { login } from '@/lib/api';

// ─── Zod schema ───────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

type LoginFields = z.infer<typeof loginSchema>;
type FieldErrors = Partial<Record<keyof LoginFields, string>>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoginForm() {
  const router = useRouter();

  const [values, setValues] = useState<LoginFields>({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (field: keyof LoginFields) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    if (globalError) setGlobalError('');
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Client-side Zod validation
    const result = loginSchema.safeParse(values);
    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof LoginFields;
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    setGlobalError('');

    try {
      const res = await login(result.data);
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
    <form onSubmit={handleSubmit} noValidate aria-label="Log in form">
      {/* Global error */}
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
          value={values.email}
          onChange={set('email')}
          error={fieldErrors.email}
          required
          disabled={submitting}
        />

        <div>
          <FormField
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={values.password}
            onChange={set('password')}
            error={fieldErrors.password}
            required
            disabled={submitting}
          />
          <div style={{ textAlign: 'right', marginTop: 'var(--space-2)' }}>
            <Link
              href="/forgot-password"
              id="login-forgot-link"
              style={{ fontSize: '13px', color: 'var(--color-primary)' }}
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <button
          id="login-submit"
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
          {submitting ? 'Logging in…' : 'Log in'}
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
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          id="login-signup-link"
          style={{ color: 'var(--color-primary)', fontWeight: 500 }}
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
