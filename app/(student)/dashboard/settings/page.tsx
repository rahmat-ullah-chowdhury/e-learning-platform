import { getCurrentUser } from '@/lib/api';
import SettingsProfileForm from '@/components/SettingsProfileForm';
import SettingsPasswordForm from '@/components/SettingsPasswordForm';

export const metadata = {
  title: 'Settings — LearnHub',
  description: 'Manage your profile and account settings.',
};

// Mock phase: re-query the shared mock source on every visit (see /instructor).
export const dynamic = 'force-dynamic';

/**
 * Settings page — server component shell wrapping client form components.
 *
 * Same pattern as Phase 4 auth pages: server component provides metadata,
 * client components handle form state/validation.
 */
export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1
        style={{
          fontSize: '28px',
          fontWeight: 600,
          color: 'var(--color-text)',
          margin: '0 0 var(--space-2) 0',
        }}
      >
        Settings
      </h1>
      <p
        style={{
          fontSize: '15px',
          color: 'var(--color-text-muted)',
          margin: '0 0 var(--space-8) 0',
        }}
      >
        Manage your profile information and account security.
      </p>

      {/* Profile section */}
      <section
        style={{
          backgroundColor: 'var(--color-bg)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-card)',
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-6)',
        }}
      >
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--color-text)',
            margin: '0 0 var(--space-4) 0',
          }}
        >
          Profile Information
        </h2>
        <SettingsProfileForm
          initialName={user?.name ?? ''}
          initialEmail={user?.email ?? ''}
        />
      </section>

      {/* Password section */}
      <section
        style={{
          backgroundColor: 'var(--color-bg)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-card)',
          padding: 'var(--space-6)',
        }}
      >
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--color-text)',
            margin: '0 0 var(--space-4) 0',
          }}
        >
          Change Password
        </h2>
        <SettingsPasswordForm />
      </section>
    </div>
  );
}
