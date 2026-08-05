'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { markLessonComplete } from '@/lib/api';
import type { Lesson } from '@/types';
import { PlayCircle, FileText, Video, Download, CheckCircle2 } from 'lucide-react';

/**
 * LessonPlayer — Client component rendering the actual lesson content.
 *
 * Branches UI by `contentType` (video, pdf, live, download).
 * Handles the "Mark Complete" toggle (optimistic UI update).
 */

interface LessonPlayerProps {
  lesson: Lesson;
  isInitiallyCompleted: boolean;
}

export default function LessonPlayer({ lesson, isInitiallyCompleted }: LessonPlayerProps) {
  const router = useRouter();
  const [completed, setCompleted] = useState(isInitiallyCompleted);
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    if (completed) return;
    setLoading(true);
    try {
      const res = await markLessonComplete(lesson.id);
      if (res.ok) {
        setCompleted(true);
        router.refresh(); // Refresh server state for sidebar
      }
    } catch {
      // Ignore for mock UI
    } finally {
      setLoading(false);
    }
  }

  // Content type renderer
  let contentNode = null;
  switch (lesson.contentType) {
    case 'video':
      contentNode = (
        <div
          style={{
            aspectRatio: '16/9',
            backgroundColor: '#000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <PlayCircle size={64} style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }} />
          <p style={{ fontSize: '15px', fontWeight: 500, margin: 0 }}>
            Video player will be connected in Phase 10
          </p>
          {lesson.contentUrl && (
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
              Source: {lesson.contentUrl}
            </p>
          )}
        </div>
      );
      break;

    case 'pdf':
      contentNode = (
        <div
          style={{
            height: '400px',
            backgroundColor: 'var(--color-bg-subtle)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--space-6)',
            padding: 'var(--space-6)',
            textAlign: 'center',
          }}
        >
          <FileText size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }} />
          <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text)', margin: '0 0 16px 0' }}>
            PDF Viewer Placeholder
          </p>
          <a
            href={lesson.contentUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-primary)',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            <Download size={16} /> Download PDF
          </a>
        </div>
      );
      break;

    case 'live':
      contentNode = (
        <div
          style={{
            backgroundColor: 'rgba(37, 99, 235, 0.05)',
            border: '1px solid rgba(37, 99, 235, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-8)',
            textAlign: 'center',
            marginBottom: 'var(--space-6)',
          }}
        >
          <Video size={48} style={{ color: 'var(--color-primary)', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 8px 0' }}>
            Live Session
          </h3>
          <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', margin: '0 0 24px 0' }}>
            This session will be hosted live. Link will be available here when the session starts.
          </p>
          <button
            disabled
            style={{
              padding: '10px 24px',
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 500,
              fontSize: '14px',
              opacity: 0.5,
              cursor: 'not-allowed',
            }}
          >
            Join Session (Not Started)
          </button>
        </div>
      );
      break;

    case 'download':
      contentNode = (
        <div
          style={{
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Download size={24} style={{ color: 'var(--color-text-muted)' }} />
            </div>
            <div>
              <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text)', margin: '0 0 4px 0' }}>
                Course Resources
              </p>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: 0 }}>
                {lesson.fileSizeBytes ? `${Math.round(lesson.fileSizeBytes / 1024 / 1024)} MB` : 'ZIP Archive'}
              </p>
            </div>
          </div>
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-primary)',
              fontWeight: 500,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Download
          </button>
        </div>
      );
      break;
  }

  return (
    <div>
      {/* Title block */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 var(--space-2) 0' }}>
          {lesson.title}
        </h1>
        {lesson.description && (
          <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', margin: 0 }}>
            {lesson.description}
          </p>
        )}
      </div>

      {/* Content player */}
      {contentNode}

      {/* Action bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 'var(--space-6)',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <div>
          {completed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-success)' }}>
              <CheckCircle2 size={20} />
              <span style={{ fontSize: '14px', fontWeight: 500 }}>Completed</span>
            </div>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading}
              id="lesson-mark-complete"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Saving...' : 'Mark as Complete'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
