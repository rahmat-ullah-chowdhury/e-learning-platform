/**
 * PageContainer — the standard max-width wrapper used by all public pages.
 *
 * Provides:
 * - A consistent max-width (1280px, matching the Navbar/Footer)
 * - Horizontal padding that scales with breakpoints (mobile-first)
 * - An optional `narrow` variant for single-column content (auth forms, etc.)
 *
 * Usage:
 *   <PageContainer>…</PageContainer>
 *   <PageContainer narrow>…</PageContainer>
 */
export default function PageContainer({
  children,
  narrow = false,
  className = '',
}: {
  children: React.ReactNode;
  /** Constrains width to ~680px for single-column pages (auth forms, article text) */
  narrow?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${className}`}
      style={{
        maxWidth: narrow ? '680px' : '1280px',
      }}
    >
      {children}
    </div>
  );
}
