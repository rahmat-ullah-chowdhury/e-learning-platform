import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

/**
 * Layout for all public (unauthenticated) pages.
 *
 * Wraps content with the shared Navbar + Footer.
 * The `flex-col` + `flex-grow` combination makes the footer
 * always sit at the bottom even on short pages.
 *
 * Route group `(public)` — the parentheses mean this folder does NOT
 * add a URL segment; routes inside behave as if they're at the app root.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
