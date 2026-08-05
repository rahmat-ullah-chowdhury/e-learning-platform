import { getEnrollments } from '@/lib/api';
import Link from 'next/link';
import { Award, Download } from 'lucide-react';

export const metadata = {
  title: 'Certificates — LearnHub',
  description: 'View and download your course completion certificates.',
};

// Mock phase: re-query the shared mock source on every visit (see /instructor).
export const dynamic = 'force-dynamic';

/**
 * Certificates page — lists completed courses with download placeholder.
 *
 * Actual certificate generation is Phase 12.
 * For now, shows completed courses with a disabled "Download" button.
 */
export default async function CertificatesPage() {
  const enrollments = await getEnrollments();
  const completed = enrollments.filter(
    (e) => e.enrollment.status === 'completed'
  );

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
        Certificates
      </h1>
      <p
        style={{
          fontSize: '15px',
          color: 'var(--color-text-muted)',
          margin: '0 0 var(--space-6) 0',
        }}
      >
        Download certificates for your completed courses.
      </p>

      {completed.length > 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
          }}
        >
          {completed.map((item) => (
            <div
              key={item.enrollment.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-4)',
                padding: 'var(--space-4) var(--space-6)',
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-card)',
              }}
              className="flex-col sm:flex-row"
            >
              {/* Certificate icon */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(22, 163, 74, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Award size={24} style={{ color: 'var(--color-success)' }} />
              </div>

              {/* Course info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    margin: '0 0 4px 0',
                  }}
                >
                  {item.course.title}
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-text-muted)',
                    margin: 0,
                  }}
                >
                  Completed on{' '}
                  {item.enrollment.completedAt
                    ? new Date(item.enrollment.completedAt).toLocaleDateString(
                        'en-GB',
                        { day: 'numeric', month: 'long', year: 'numeric' }
                      )
                    : '—'}
                </p>
              </div>

              {/* Download button (placeholder) */}
              <button
                disabled
                id={`cert-download-${item.course.slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg)',
                  color: 'var(--color-text-muted)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'not-allowed',
                  opacity: 0.6,
                }}
                title="Certificate generation will be available in a future update"
              >
                <Download size={14} />
                Download
              </button>
            </div>
          ))}

          <p
            style={{
              fontSize: '13px',
              color: 'var(--color-text-muted)',
              marginTop: 'var(--space-2)',
              fontStyle: 'italic',
            }}
          >
            Certificate generation will be available in a future update.
          </p>
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--space-12) var(--space-4)',
            backgroundColor: 'var(--color-bg)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <Award
            size={48}
            style={{ color: 'var(--color-text-muted)', margin: '0 auto var(--space-4)' }}
          />
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--color-text)',
              margin: '0 0 var(--space-2) 0',
            }}
          >
            No certificates yet
          </h2>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--color-text-muted)',
              margin: '0 0 var(--space-6) 0',
            }}
          >
            Complete a course to earn your first certificate.
          </p>
          <Link
            href="/dashboard/courses"
            id="cert-view-courses"
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              padding: '10px 24px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 500,
              fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            View My Courses
          </Link>
        </div>
      )}
    </div>
  );
}
