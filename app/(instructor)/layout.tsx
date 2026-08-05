import { getInstructorProfile } from '@/lib/api';
import InstructorSidebar from '@/components/InstructorSidebar';

/**
 * Layout for the (instructor) route group.
 *
 * Provides a dashboard shell (sidebar + content area) completely separate
 * from the public and student layouts — no Navbar/Footer.
 *
 * NOTE: No real access control exists yet. This layout is reachable by
 * direct URL with a hardcoded mock instructor user. Real protected-route
 * middleware and actual auth state come in Phase 9.
 */
export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getInstructorProfile();
  const userName = user?.name ?? 'Instructor';
  const userEmail = user?.email ?? '';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-subtle)' }}>
      <InstructorSidebar userName={userName} userEmail={userEmail} />

      {/* Main content — offset by sidebar width on desktop, padded for mobile bottom tabs */}
      <main
        style={{
          marginLeft: '0',
          paddingBottom: '72px', /* space for mobile bottom tabs */
        }}
        className="md:ml-[240px] md:pb-0"
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: 'var(--space-6) var(--space-4)',
          }}
          className="sm:px-6 lg:px-8"
        >
          {children}
        </div>
      </main>
    </div>
  );
}
