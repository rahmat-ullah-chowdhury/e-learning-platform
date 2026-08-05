'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle2, Circle, Menu, X, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import type { Lesson, LessonProgress } from '@/types';

/**
 * CourseSidebar — Collapsible sidebar for the course player.
 *
 * Lists all lessons, shows completion status, and highlights current lesson.
 * Collapses to a hamburger menu on mobile.
 */

interface CourseSidebarProps {
  courseTitle: string;
  courseSlug: string;
  lessons: Lesson[];
  progress: LessonProgress[];
  currentLessonId?: string;
}

export default function CourseSidebar({
  courseTitle,
  courseSlug,
  lessons,
  progress,
  currentLessonId,
}: CourseSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Helper to check if a lesson is completed
  const isCompleted = (lessonId: string) =>
    progress.some((p) => p.lessonId === lessonId && p.completed);

  const sidebarContent = (
    <>
      <div
        style={{
          padding: 'var(--space-4)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <Link
          href="/dashboard"
          id="course-player-back"
          className="flex items-center gap-2"
          style={{
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            textDecoration: 'none',
            marginBottom: 'var(--space-4)',
          }}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <h2
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--color-text)',
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {courseTitle}
        </h2>
      </div>

      <nav
        style={{ padding: 'var(--space-4) 0', overflowY: 'auto', flex: 1 }}
        aria-label="Course lessons"
      >
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {lessons.map((lesson) => {
            const active =
              currentLessonId === lesson.id ||
              (!currentLessonId && pathname === `/learn/${courseSlug}`);
            const completed = isCompleted(lesson.id);

            return (
              <li key={lesson.id}>
                <Link
                  href={`/learn/${courseSlug}/${lesson.id}`}
                  id={`lesson-link-${lesson.id}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-start gap-3"
                  style={{
                    padding: 'var(--space-2) var(--space-4)',
                    backgroundColor: active
                      ? 'rgba(37, 99, 235, 0.08)'
                      : 'transparent',
                    textDecoration: 'none',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ marginTop: '2px', flexShrink: 0 }}>
                    {completed ? (
                      <CheckCircle2
                        size={18}
                        style={{ color: 'var(--color-success)' }}
                      />
                    ) : (
                      <Circle
                        size={18}
                        style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}
                      />
                    )}
                  </div>
                  <div>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: active ? 600 : 400,
                        color: active
                          ? 'var(--color-primary)'
                          : 'var(--color-text)',
                        lineHeight: 1.4,
                      }}
                    >
                      {lesson.title}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      {lesson.contentType === 'video' || lesson.contentType === 'live'
                        ? lesson.durationSeconds
                          ? `${Math.round(lesson.durationSeconds / 60)} min`
                          : 'Video'
                        : lesson.contentType.toUpperCase()}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────────── */}
      <aside
        id="course-sidebar-desktop"
        className="hidden md:flex flex-col"
        style={{
          width: '320px',
          minHeight: '100vh',
          backgroundColor: 'var(--color-bg)',
          borderRight: '1px solid var(--color-border)',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 40,
        }}
      >
        {sidebarContent}
      </aside>

      {/* ── Mobile Hamburger Header ─────────────────────────── */}
      <div
        className="md:hidden flex items-center justify-between"
        style={{
          backgroundColor: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
          padding: 'var(--space-3) var(--space-4)',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        <h2
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--color-text)',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {courseTitle}
        </h2>
        <button
          onClick={() => setMobileOpen(true)}
          id="course-mobile-menu"
          style={{
            color: 'var(--color-text-muted)',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Open course menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* ── Mobile Drawer ───────────────────────────────────── */}
      {mobileOpen && (
        <div
          id="course-mobile-drawer"
          className="md:hidden"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 50,
          }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '85%',
              maxWidth: '320px',
              backgroundColor: 'var(--color-bg)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 16px rgba(0,0,0,0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: 'var(--space-4)',
              }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                style={{ color: 'var(--color-text-muted)' }}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
