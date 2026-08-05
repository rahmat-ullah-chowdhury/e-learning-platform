'use client';

import { useState } from 'react';
import { z } from 'zod';
import FormField from './FormField';
import { changePassword } from '@/lib/api';

/**
 * SettingsPasswordForm — Current + new + confirm password form with Zod.
 *
 * Same password strength rules as SignupForm (Phase 4):
 * min 8 chars, one uppercase, one lowercase, one digit.
 */

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must include an uppercase letter')
      .regex(/[a-z]/, 'Password must include a lowercase letter')
      .regex(/[0-9]/, 'Password must include a number'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FieldErrors = Partial<
  Record<'currentPassword' | 'newPassword' | 'confirmPassword', string>
>;

export default function SettingsPasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setGlobalError('');
    setSuccess(false);

    const result = passwordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });
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
      const res = await changePassword({ currentPassword, newPassword });
      if (res.ok) {
        setSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
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
          Password changed successfully.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <FormField
          id="settings-current-password"
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={setCurrentPassword}
          error={errors.currentPassword}
          disabled={loading}
        />
        <FormField
          id="settings-new-password"
          label="New Password"
          type="password"
          value={newPassword}
          onChange={setNewPassword}
          error={errors.newPassword}
          disabled={loading}
        />
        <FormField
          id="settings-confirm-password"
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={errors.confirmPassword}
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        id="settings-change-password"
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
        {loading ? 'Changing…' : 'Change Password'}
      </button>
    </form>
  );
}
