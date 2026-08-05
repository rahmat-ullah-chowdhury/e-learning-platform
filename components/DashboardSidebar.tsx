'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  CreditCard,
  Settings,
  ArrowLeft,
  User,
} from 'lucide-react';

/**
 * DashboardSidebar — Navigation sidebar for the student dashboard.
 *
 * Uses usePathname() for active-link detection.
 * Desktop: fixed left sidebar (240px).
 * Mobile: horizontal bottom tab bar with icons only.
 *
 * NOTE: No real auth — displays hardcoded mock user info.
 * Real user data comes from JWT/session in Phase 9.
 */

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
  },
  {
    href: '/dashboard/courses',
    label: 'My Courses',
    icon: <BookOpen size={20} />,
  },
  {
    href: '/dashboard/certificates',
    label: 'Certificates',
    icon: <Award size={20} />,
  },
  {
    href: '/dashboard/payments',
    label: 'Payments',
    icon: <CreditCard size={20} />,
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: <Settings size={20} />,
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard';
  return pathname.startsWith(href);
}

export default function DashboardSidebar({ userName, userEmail }: {
  userName: string;
  userEmail: string;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────────── */}
      <aside
        id="dashboard-sidebar"
        className="hidden md:flex flex-col"
        style={{
          width: '240px',
          minHeight: '100vh',
          backgroundColor: 'var(--color-bg)',
          borderRight: '1px solid var(--color-border)',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 40,
        }}
      >
        {/* User info */}
        <div
          style={{
            padding: 'var(--space-6) var(--space-4)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <User size={20} style={{ color: '#fff' }} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {userName}
              </p>
              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-muted)',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {userEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav
          style={{ padding: 'var(--space-4) var(--space-2)', flex: 1 }}
          aria-label="Dashboard navigation"
        >
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    id={`sidebar-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center gap-3"
                    style={{
                      padding: '10px var(--space-3)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '14px',
                      fontWeight: active ? 600 : 400,
                      color: active
                        ? 'var(--color-primary)'
                        : 'var(--color-text-muted)',
                      backgroundColor: active
                        ? 'rgba(37, 99, 235, 0.08)'
                        : 'transparent',
                      textDecoration: 'none',
                      transition:
                        'background-color 0.15s ease, color 0.15s ease',
                      marginBottom: '2px',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor =
                          'var(--color-bg-subtle)';
                        e.currentTarget.style.color = 'var(--color-text)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--color-text-muted)';
                      }
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Back to site link */}
        <div
          style={{
            padding: 'var(--space-4)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <Link
            href="/"
            id="sidebar-back-to-site"
            className="flex items-center gap-2"
            style={{
              fontSize: '13px',
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-muted)';
            }}
          >
            <ArrowLeft size={16} />
            Back to site
          </Link>
        </div>
      </aside>

      {/* ── Mobile Bottom Tab Bar ───────────────────────────── */}
      <nav
        id="dashboard-mobile-tabs"
        className="md:hidden"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'var(--color-bg)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: '56px',
          zIndex: 40,
        }}
        aria-label="Dashboard navigation"
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center"
              style={{
                flex: 1,
                height: '100%',
                color: active
                  ? 'var(--color-primary)'
                  : 'var(--color-text-muted)',
                textDecoration: 'none',
                fontSize: '10px',
                fontWeight: active ? 600 : 400,
                gap: '2px',
                transition: 'color 0.15s ease',
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
