'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { submitAttemptAction } from '@/app/(student)/exam/[quizId]/attempt/actions';
import type { QuizForStudent, SubmittedAnswer } from '@/types';
import QuestionRenderer from './QuestionRenderer';
import QuizTimer from './QuizTimer';
import { Send } from 'lucide-react';

/**
 * QuizAttemptClient — the active exam UI.
 *
 * Receives the QuizForStudent from a server component parent (the attempt
 * page). This keeps the mock quiz data server-side, so quizzes created at
 * runtime by an instructor (which never exist in the client bundle) can be
 * attempted correctly.
 *
 * SECURITY NOTE: only QuizForStudent questions are available here —
 * correctOptionIndex is NEVER present. Raw answers are sent to
 * submitAttemptAction(), which grades server-side.
 */
export default function QuizAttemptClient({ quiz }: { quiz: QuizForStudent }) {
  const router = useRouter();

  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [timerExpired, setTimerExpired] = useState(false);

  const handleAnswerChange = useCallback(
    (questionId: string, value: string | number) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    []
  );

  const handleTimerExpired = useCallback(() => {
    setTimerExpired(true);
  }, []);

  async function handleSubmit() {
    setSubmitting(true);
    setError('');

    // Build SubmittedAnswer array from the answers state
    const submittedAnswers: SubmittedAnswer[] = quiz.questions
      .map((q) => {
        const val = answers[q.id];
        if (val === undefined) return null;
        return { questionId: q.id, value: val };
      })
      .filter((a): a is SubmittedAnswer => a !== null);

    const result = await submitAttemptAction(quiz.id, submittedAnswers);

    if (result.ok) {
      router.push(`/exam/${quiz.id}/result/${result.attempt.id}`);
    } else {
      setError(result.error);
      setSubmitting(false);
    }
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz.questions.length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-subtle)' }}>
      {/* Sticky header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          backgroundColor: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
          padding: 'var(--space-3) var(--space-4)',
        }}
      >
        <div
          style={{
            maxWidth: '760px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h1
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--color-text)',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {quiz.title}
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
              {answeredCount} of {totalQuestions} answered
            </p>
          </div>
          <QuizTimer
            quizId={quiz.id}
            durationMinutes={quiz.durationMinutes}
            onExpired={handleTimerExpired}
          />
        </div>
      </div>

      {/* Timer expired banner */}
      {timerExpired && (
        <div
          style={{
            backgroundColor: 'rgba(220, 38, 38, 0.08)',
            borderBottom: '1px solid rgba(220, 38, 38, 0.2)',
            padding: 'var(--space-3) var(--space-4)',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--color-error)',
          }}
        >
          Time is up. Please submit your answers now.
        </div>
      )}

      {/* Questions */}
      <div
        style={{
          maxWidth: '760px',
          margin: '0 auto',
          padding: 'var(--space-6) var(--space-4)',
        }}
      >
        {quiz.questions.map((question, idx) => (
          <QuestionRenderer
            key={question.id}
            question={question}
            questionNumber={idx + 1}
            value={answers[question.id]}
            onChange={handleAnswerChange}
            disabled={submitting}
          />
        ))}

        {/* Error */}
        {error && (
          <div
            role="alert"
            style={{
              padding: 'var(--space-3) var(--space-4)',
              backgroundColor: 'rgba(220, 38, 38, 0.06)',
              border: '1px solid rgba(220, 38, 38, 0.2)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-error)',
              fontSize: '14px',
              marginBottom: 'var(--space-4)',
            }}
          >
            {error}
          </div>
        )}

        {/* Submit */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-6) 0',
            borderTop: '1px solid var(--color-border)',
            marginTop: 'var(--space-4)',
          }}
        >
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: 0 }}>
            {answeredCount < totalQuestions
              ? `${totalQuestions - answeredCount} question${totalQuestions - answeredCount !== 1 ? 's' : ''} unanswered`
              : 'All questions answered ✓'}
          </p>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            id="quiz-submit-btn"
            className="flex items-center gap-2"
            style={{
              padding: 'var(--space-3) var(--space-6)',
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '15px',
              fontWeight: 600,
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Send size={16} />
            {submitting ? 'Submitting…' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
}
