'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BookOpen, Menu, X } from 'lucide-react';

/**
 * Navbar — logged-out variant only.
 * Authenticated variants (with avatar/dashboard links) are added in Phase 9
 * when real auth is wired up.
 *
 * Plain English strings used intentionally — next-intl wiring is deferred
 * per Architecture.md §5 (i18n rollout decisions).
 */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
      <nav
        className="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8"
        style={{ maxWidth: '1280px', height: '64px' }}
        aria-label="Main navigation"
      >
        {/* ── Logo ─────────────────────────────────────────── */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold"
          style={{ color: 'var(--color-text)', fontSize: '18px' }}
          aria-label="LearnHub home"
        >
          <BookOpen
            size={24}
            style={{ color: 'var(--color-primary)' }}
            aria-hidden="true"
          />
          LearnHub
        </Link>

        {/* ── Desktop links ──────────────────────────────────── */}
        <div className="hidden sm:flex items-center gap-6">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/courses">Courses</NavLink>
        </div>

        {/* ── Desktop auth buttons ───────────────────────────── */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            id="nav-login"
            style={{
              color: 'var(--color-primary)',
              fontSize: '14px',
              fontWeight: 500,
              padding: '6px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-primary)',
              transition: 'background 0.15s, color 0.15s',
            }}
            className="hover:bg-blue-50"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            id="nav-signup"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 500,
              padding: '6px 16px',
              borderRadius: 'var(--radius-sm)',
              transition: 'background 0.15s',
            }}
            className="hover:bg-blue-700"
          >
            Sign up
          </Link>
        </div>

        {/* ── Mobile hamburger ───────────────────────────────── */}
        <button
          id="nav-mobile-toggle"
          className="sm:hidden flex items-center justify-center p-2"
          style={{
            color: 'var(--color-text-muted)',
            borderRadius: 'var(--radius-sm)',
          }}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* ── Mobile drawer ──────────────────────────────────── */}
      {mobileOpen && (
        <div
          id="nav-mobile-menu"
          className="sm:hidden"
          style={{
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)',
            padding: 'var(--space-4)',
          }}
        >
          <div className="flex flex-col gap-1">
            <MobileNavLink href="/" onClick={() => setMobileOpen(false)}>
              Home
            </MobileNavLink>
            <MobileNavLink href="/courses" onClick={() => setMobileOpen(false)}>
              Courses
            </MobileNavLink>
          </div>
          <div
            className="flex flex-col gap-2"
            style={{ marginTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}
          >
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="text-center font-medium"
              style={{
                color: 'var(--color-primary)',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-primary)',
                fontSize: '14px',
              }}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="text-center font-medium"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px',
              }}
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── Sub-components ──────────────────────────────────────── */

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{ color: 'var(--color-text-muted)', fontSize: '14px', fontWeight: 500 }}
      className="hover:text-blue-600 transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block font-medium"
      style={{
        color: 'var(--color-text)',
        padding: '10px var(--space-2)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '15px',
      }}
    >
      {children}
    </Link>
  );
}
