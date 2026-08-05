import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Award, Users } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import CourseCard from '@/components/CourseCard';
import { getFeaturedCourses, getCategories } from '@/lib/api';

export const metadata: Metadata = {
  title: 'LearnHub — Learn skills that matter',
  description:
    'Free and paid courses from expert instructors. Browse, enrol, and learn at your own pace.',
};

// Mock phase: re-query the shared mock source on every visit so newly
// published courses appear immediately instead of a static snapshot.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featuredCourses, categories] = await Promise.all([
    getFeaturedCourses(),
    getCategories(),
  ]);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e293b 100%)',
          color: '#fff',
          padding: 'var(--space-12) 0',
        }}
        aria-labelledby="hero-heading"
      >
        <PageContainer>
          <div
            className="flex flex-col lg:flex-row items-center gap-12"
            style={{ minHeight: '340px' }}
          >
            {/* Left: copy */}
            <div style={{ flex: 1 }}>
              <h1
                id="hero-heading"
                style={{
                  fontSize: 'clamp(32px, 5vw, 48px)',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  marginBottom: 'var(--space-4)',
                  color: '#fff',
                }}
              >
                Learn skills that<br />
                <span style={{ color: '#60a5fa' }}>matter most</span>
              </h1>
              <p
                style={{
                  fontSize: '18px',
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.6,
                  maxWidth: '480px',
                  marginBottom: 'var(--space-8)',
                }}
              >
                Free and paid courses from expert instructors — on your schedule,
                at your pace. Earn certificates that get noticed.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/courses"
                  id="hero-browse-cta"
                  className="flex items-center gap-2"
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 600,
                    fontSize: '15px',
                    transition: 'background 0.15s',
                  }}
                >
                  Browse courses
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  href="/signup"
                  id="hero-signup-cta"
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 600,
                    fontSize: '15px',
                    border: '1px solid rgba(255,255,255,0.25)',
                    transition: 'background 0.15s',
                  }}
                >
                  Sign up free
                </Link>
              </div>
            </div>

            {/* Right: stats */}
            <div
              className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4"
              style={{ flexShrink: 0 }}
            >
              <StatCard icon={<BookOpen size={20} />} value="50+" label="Courses" />
              <StatCard icon={<Users size={20} />} value="40k+" label="Students" />
              <StatCard icon={<Award size={20} />} value="98%" label="Pass rate" />
            </div>
          </div>
        </PageContainer>
      </section>

      {/* ── Category pills ───────────────────────────────────── */}
      <section
        style={{
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg)',
          padding: 'var(--space-4) 0',
          overflowX: 'auto',
        }}
        aria-label="Course categories"
      >
        <PageContainer>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/courses"
              id="category-all"
              style={{
                padding: '6px 16px',
                borderRadius: '999px',
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              All courses
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/courses?category=${encodeURIComponent(cat)}`}
                id={`category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                style={{
                  padding: '6px 16px',
                  borderRadius: '999px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  fontSize: '13px',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                className="hover:border-blue-400 hover:text-blue-600"
              >
                {cat}
              </Link>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* ── Featured courses ─────────────────────────────────── */}
      <section
        style={{ padding: 'var(--space-12) 0', backgroundColor: 'var(--color-bg)' }}
        aria-labelledby="featured-heading"
      >
        <PageContainer>
          <div
            className="flex items-center justify-between"
            style={{ marginBottom: 'var(--space-6)' }}
          >
            <div>
              <h2
                id="featured-heading"
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                }}
              >
                Top-rated courses
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Highly rated by students worldwide
              </p>
            </div>
            <Link
              href="/courses"
              id="featured-view-all"
              className="flex items-center gap-1"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--color-primary)',
              }}
            >
              View all
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          {featuredCourses.length === 0 ? (
            <EmptyState message="No featured courses available yet." />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 'var(--space-6)',
              }}
            >
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </PageContainer>
      </section>

      {/* ── Free courses banner ──────────────────────────────── */}
      <section
        style={{
          padding: 'var(--space-12) 0',
          backgroundColor: 'var(--color-bg-subtle)',
          borderTop: '1px solid var(--color-border)',
        }}
        aria-labelledby="free-banner-heading"
      >
        <PageContainer>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2
                id="free-banner-heading"
                style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-text)' }}
              >
                Start learning for free
              </h2>
              <p style={{ color: 'var(--color-text-muted)', marginTop: '4px', fontSize: '15px' }}>
                Several courses are completely free — no credit card required.
              </p>
            </div>
            <Link
              href="/courses?category=Programming"
              id="free-banner-cta"
              style={{
                padding: '12px 28px',
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '15px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              Explore free courses
            </Link>
          </div>
        </PageContainer>
      </section>
    </>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div
      style={{
        padding: 'var(--space-4) var(--space-6)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        minWidth: '140px',
      }}
    >
      <div style={{ color: '#60a5fa' }} aria-hidden="true">
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>{value}</div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{label}</div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: 'var(--space-12) 0',
        color: 'var(--color-text-muted)',
        fontSize: '15px',
      }}
      role="status"
    >
      {message}
    </div>
  );
}
