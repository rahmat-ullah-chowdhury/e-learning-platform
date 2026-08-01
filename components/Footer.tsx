import Link from 'next/link';
import { BookOpen } from 'lucide-react';

/**
 * Footer — minimal, platform-wide.
 * Contains logo, brief tagline, key nav links, and legal notices.
 * Plain English strings used — next-intl wiring deferred per Architecture.md §5.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-subtle)',
        marginTop: 'auto',
      }}
    >
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8"
        style={{ maxWidth: '1280px', padding: 'var(--space-12) var(--space-6)' }}
      >
        {/* ── Top row ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          {/* Brand */}
          <div style={{ maxWidth: '280px' }}>
            <Link
              href="/"
              className="flex items-center gap-2"
              style={{ color: 'var(--color-text)', fontWeight: 600, fontSize: '16px' }}
              aria-label="LearnHub home"
            >
              <BookOpen size={20} style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
              LearnHub
            </Link>
            <p
              style={{
                color: 'var(--color-text-muted)',
                fontSize: '14px',
                lineHeight: '1.6',
                marginTop: 'var(--space-3)',
              }}
            >
              Free and paid courses from expert instructors. Learn at your own pace.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12">
            <FooterLinkGroup
              heading="Platform"
              links={[
                { label: 'Browse courses', href: '/courses' },
                { label: 'Sign up free', href: '/signup' },
                { label: 'Log in', href: '/login' },
              ]}
            />
            <FooterLinkGroup
              heading="Company"
              links={[
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ]}
            />
            <FooterLinkGroup
              heading="Legal"
              links={[
                { label: 'Terms of service', href: '/terms' },
                { label: 'Privacy policy', href: '/privacy' },
              ]}
            />
          </div>
        </div>

        {/* ── Bottom row ───────────────────────────────────── */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{
            borderTop: '1px solid var(--color-border)',
            marginTop: 'var(--space-8)',
            paddingTop: 'var(--space-6)',
          }}
        >
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
            © {currentYear} LearnHub. All rights reserved.
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
            UK-based · Prices in GBP
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ── Sub-components ──────────────────────────────────────── */

function FooterLinkGroup({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3
        style={{
          fontSize: '12px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--color-text)',
          marginBottom: 'var(--space-3)',
        }}
      >
        {heading}
      </h3>
      <ul className="flex flex-col gap-2">
        {links.map(({ label, href }) => (
          <li key={href}>
            <Link
              href={href}
              style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}
              className="hover:text-blue-600 transition-colors"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
