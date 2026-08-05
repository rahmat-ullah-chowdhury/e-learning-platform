'use client';

import { useState } from 'react';
import { z } from 'zod';
import FormField from './FormField';
import { updateProfile } from '@/lib/api';

/**
 * SettingsProfileForm — Name + email edit form with Zod validation.
 * Uses the existing FormField component for consistency.
 */

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type FieldErrors = Partial<Record<'name' | 'email', string>>;

export default function SettingsProfileForm({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setGlobalError('');
    setSuccess(false);

    const result = profileSchema.safeParse({ name, email });
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FieldErrors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await updateProfile({ name, email });
      if (res.ok) {
        setSuccess(true);
      } else {
        setGlobalError(res.error);
      }
    } catch {
      setGlobalError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {globalError && (
        <div
          role="alert"
          style={{
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: 'rgba(220, 38, 38, 0.06)',
            border: '1px solid rgba(220, 38, 38, 0.2)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-error)',
            fontSize: '14px',
            marginBottom: 'var(--space-4)',
          }}
        >
          {globalError}
        </div>
      )}

      {success && (
        <div
          role="status"
          style={{
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: 'rgba(22, 163, 74, 0.06)',
            border: '1px solid rgba(22, 163, 74, 0.2)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-success)',
            fontSize: '14px',
            marginBottom: 'var(--space-4)',
          }}
        >
          Profile updated successfully.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <FormField
          id="settings-name"
          label="Name"
          type="text"
          value={name}
          onChange={setName}
          error={errors.name}
          disabled={loading}
        />
        <FormField
          id="settings-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        id="settings-save-profile"
        disabled={loading}
        style={{
          marginTop: 'var(--space-6)',
          backgroundColor: 'var(--color-primary)',
          color: '#fff',
          padding: '10px 24px',
          borderRadius: 'var(--radius-sm)',
          border: 'none',
          fontWeight: 500,
          fontSize: '14px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'background-color 0.15s ease, opacity 0.15s ease',
        }}
      >
        {loading ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  );
}
