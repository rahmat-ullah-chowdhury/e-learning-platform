import { getAttemptResult, getQuizById } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Clock, Award } from 'lucide-react';

export const metadata = {
  title: 'Quiz Result — LearnHub',
  description: 'Your quiz submission result.',
};

/**
 * Quiz Result page — /exam/[quizId]/result/[attemptId]
 *
 * Shows:
 *  - Pass / Fail status with the auto-graded MCQ score
 *  - A note that short_answer/essay responses are pending manual review
 *  - Per-question answer summary (what was submitted)
 *
 * SECURITY NOTE: This page only shows the student's own submitted answers.
 * It does NOT reveal the correct answers for MCQ questions —
 * that would require a separate "review" API (added in Phase 12).
 *
 * Awaits params per Next.js 16.
 */
export default async function QuizResultPage(props: {
  params: Promise<{ quizId: string; attemptId: string }>;
}) {
  const { quizId, attemptId } = await props.params;

  const [attempt, quiz] = await Promise.all([
    getAttemptResult(attemptId),
    getQuizById(quizId),
  ]);

  if (!attempt || !quiz) notFound();

  const mcqScore = attempt.totalScore ?? 0;
  const mcqMax = quiz.questions
    .filter((q) => q.type === 'mcq')
    .reduce((sum, q) => sum + q.points, 0);
  const needsReview = attempt.gradeStatus === 'pending';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-subtle)',
        padding: 'var(--space-8) var(--space-4)',
      }}
    >
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>

        {/* Result hero card */}
        <div
          style={{
            backgroundColor: 'var(--color-bg)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card-hover)',
            overflow: 'hidden',
            marginBottom: 'var(--space-6)',
          }}
        >
          {/* Top strip */}
          <div
            style={{
              padding: 'var(--space-8)',
              textAlign: 'center',
              backgroundColor: attempt.passed
                ? 'rgba(22, 163, 74, 0.06)'
                : 'rgba(220, 38, 38, 0.06)',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            {attempt.passed ? (
              <CheckCircle2
                size={56}
                style={{ color: 'var(--color-success)', margin: '0 auto var(--space-4)' }}
              />
            ) : (
              <XCircle
                size={56}
                style={{ color: 'var(--color-error)', margin: '0 auto var(--space-4)' }}
              />
            )}

            <h1
              style={{
                fontSize: '26px',
                fontWeight: 700,
                color: attempt.passed ? 'var(--color-success)' : 'var(--color-error)',
                margin: '0 0 var(--space-2) 0',
              }}
            >
              {attempt.passed ? 'Passed!' : 'Not Passed'}
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--color-text-muted)', margin: 0 }}>
              {quiz.title}
            </p>
          </div>

          {/* Score stats */}
          <div
            style={{ padding: 'var(--space-6)' }}
            className="grid grid-cols-3 gap-4"
          >
            <ScoreTile
              icon={<Award size={18} style={{ color: 'var(--color-primary)' }} />}
              label="MCQ Score"
              value={`${mcqScore} / ${mcqMax}`}
            />
            <ScoreTile
              icon={<Clock size={18} style={{ color: 'var(--color-warning)' }} />}
              label="To Pass"
              value={`${quiz.passingPercent}%`}
            />
            <ScoreTile
              icon={
                attempt.passed ? (
                  <CheckCircle2 size={18} style={{ color: 'var(--color-success)' }} />
                ) : (
                  <XCircle size={18} style={{ color: 'var(--color-error)' }} />
                )
              }
              label="Result"
              value={attempt.passed ? 'Pass' : 'Fail'}
            />
          </div>

          {/* Manual review notice */}
          {needsReview && (
            <div
              style={{
                margin: '0 var(--space-6) var(--space-6)',
                padding: 'var(--space-3) var(--space-4)',
                backgroundColor: 'rgba(217, 119, 6, 0.06)',
                border: '1px solid rgba(217, 119, 6, 0.2)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                color: 'var(--color-text-muted)',
              }}
            >
              <strong style={{ color: 'var(--color-warning)' }}>Pending Manual Review:</strong>{' '}
              Your short-answer and essay responses will be reviewed by your instructor. Your final
              score may change after review.
            </div>
          )}
        </div>

        {/* Submitted answers summary */}
        <div
          style={{
            backgroundColor: 'var(--color-bg)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-card)',
            padding: 'var(--space-6)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--color-text)',
              margin: '0 0 var(--space-4) 0',
            }}
          >
            Your Answers
          </h2>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--color-text-muted)',
              margin: '0 0 var(--space-4) 0',
              padding: 'var(--space-3)',
              backgroundColor: 'var(--color-bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
            }}
          >
            ℹ️ Correct answers for MCQ questions are not shown here. Your instructor may share
            a full review after manual grading is complete.
          </p>

          {quiz.questions.map((question, idx) => {
            const submitted = attempt.answers.find(
              (a) => a.questionId === question.id
            );

            return (
              <div
                key={question.id}
                style={{
                  paddingBottom: 'var(--space-4)',
                  marginBottom: 'var(--space-4)',
                  borderBottom:
                    idx < quiz.questions.length - 1
                      ? '1px solid var(--color-border)'
                      : 'none',
                }}
              >
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    margin: '0 0 var(--space-2) 0',
                  }}
                >
                  Q{idx + 1}. {question.text}
                </p>
                <div
                  style={{
                    padding: 'var(--space-3)',
                    backgroundColor: submitted
                      ? 'var(--color-bg-subtle)'
                      : 'rgba(220,38,38,0.04)',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${submitted ? 'var(--color-border)' : 'rgba(220,38,38,0.2)'}`,
                  }}
                >
                  {submitted ? (
                    <p style={{ fontSize: '14px', color: 'var(--color-text)', margin: 0 }}>
                      {question.type === 'mcq' && question.options
                        ? question.options[submitted.value as number] ?? String(submitted.value)
                        : String(submitted.value)}
                    </p>
                  ) : (
                    <p style={{ fontSize: '14px', color: 'var(--color-error)', margin: 0, fontStyle: 'italic' }}>
                      Not answered
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Link
            href="/dashboard"
            id="result-back-dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 24px',
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 500,
              fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            Back to Dashboard
          </Link>
          <Link
            href={`/exam/${quizId}/start`}
            id="result-retake"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 24px',
              backgroundColor: 'var(--color-bg)',
              color: 'var(--color-text)',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 500,
              fontSize: '14px',
              textDecoration: 'none',
              border: '1px solid var(--color-border)',
            }}
          >
            Retake Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}

function ScoreTile({
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
