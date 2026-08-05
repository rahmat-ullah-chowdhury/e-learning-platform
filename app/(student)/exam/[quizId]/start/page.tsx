import { getQuizById } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, FileQuestion, Award, AlertCircle } from 'lucide-react';

export async function generateMetadata(props: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await props.params;
  const quiz = await getQuizById(quizId);
  return {
    title: quiz ? `${quiz.title} — LearnHub` : 'Quiz Not Found — LearnHub',
    description: quiz?.description ?? 'Take this quiz to test your knowledge.',
  };
}

/**
 * Quiz Start page — /exam/[quizId]/start
 *
 * Shows quiz metadata and a "Begin Quiz" CTA.
 * Awaits params per Next.js 16 convention.
 */
export default async function QuizStartPage(props: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await props.params;
  const quiz = await getQuizById(quizId);

  if (!quiz) notFound();

  const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
  const mcqCount = quiz.questions.filter((q) => q.type === 'mcq').length;
  const shortCount = quiz.questions.filter((q) => q.type === 'short_answer').length;
  const essayCount = quiz.questions.filter((q) => q.type === 'essay').length;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-6)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--color-bg)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card-hover)',
          overflow: 'hidden',
        }}
      >
        {/* Header strip */}
        <div
          style={{
            backgroundColor: 'var(--color-primary)',
            padding: 'var(--space-6)',
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: '0 0 6px 0', fontWeight: 500 }}>
            Quiz
          </p>
          <h1
            style={{
              color: '#fff',
              fontSize: '22px',
              fontWeight: 600,
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {quiz.title}
          </h1>
          {quiz.description && (
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: 'var(--space-2) 0 0 0' }}>
              {quiz.description}
            </p>
          )}
        </div>

        {/* Stats */}
        <div style={{ padding: 'var(--space-6)' }}>
          <div
            className="grid grid-cols-3 gap-4"
            style={{ marginBottom: 'var(--space-6)' }}
          >
            <InfoTile
              icon={<Clock size={18} style={{ color: 'var(--color-primary)' }} />}
              label="Time Limit"
              value={`${quiz.durationMinutes} min`}
            />
            <InfoTile
              icon={<FileQuestion size={18} style={{ color: 'var(--color-secondary)' }} />}
              label="Questions"
              value={String(quiz.questions.length)}
            />
            <InfoTile
              icon={<Award size={18} style={{ color: 'var(--color-success)' }} />}
              label="To Pass"
              value={`${quiz.passingPercent}%`}
            />
          </div>

          {/* Breakdown */}
          <div
            style={{
              padding: 'var(--space-4)',
              backgroundColor: 'var(--color-bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 'var(--space-6)',
            }}
          >
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 var(--space-2) 0' }}>
              Question Breakdown
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, fontSize: '13px', color: 'var(--color-text-muted)' }}>
              {mcqCount > 0 && <li>• {mcqCount} Multiple Choice ({mcqCount * 2} pts each)</li>}
              {shortCount > 0 && <li>• {shortCount} Short Answer (manually graded)</li>}
              {essayCount > 0 && <li>• {essayCount} Essay (manually graded)</li>}
            </ul>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: 'var(--space-2) 0 0 0' }}>
              Total: <strong style={{ color: 'var(--color-text)' }}>{totalPoints} points</strong>
            </p>
          </div>

          {/* Timer notice */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-4)',
              backgroundColor: 'rgba(217, 119, 6, 0.06)',
              border: '1px solid rgba(217, 119, 6, 0.2)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 'var(--space-6)',
            }}
          >
            <AlertCircle size={16} style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: 0 }}>
              The timer starts when you click &ldquo;Begin Quiz&rdquo;. Short-answer and essay
              responses will be reviewed by your instructor after submission.
            </p>
          </div>

          {/* CTA */}
          <Link
            href={`/exam/${quizId}/attempt`}
            id="quiz-begin-btn"
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              padding: 'var(--space-4)',
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '16px',
              textDecoration: 'none',
              transition: 'background-color 0.15s ease',
            }}
            className="hover:bg-[var(--color-primary-hover)]"
          >
            Begin Quiz
          </Link>

          <Link
            href="/dashboard"
            id="quiz-back-dashboard"
            style={{
              display: 'block',
              textAlign: 'center',
              marginTop: 'var(--space-3)',
              fontSize: '13px',
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
            }}
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: 'var(--space-3)',
        backgroundColor: 'var(--color-bg-subtle)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>{icon}</div>
      <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 2px 0' }}>{value}</p>
      <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0 }}>{label}</p>
    </div>
  );
}
