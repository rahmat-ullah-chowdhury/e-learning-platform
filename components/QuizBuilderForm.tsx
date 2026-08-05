'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { quizInputSchema } from '@/lib/validation';
import { saveQuizAction } from '@/app/(instructor)/instructor/quizzes/[id]/edit/actions';
import type { Quiz, QuestionType, QuizStatus } from '@/types';
import { Plus, Trash2, ListChecks } from 'lucide-react';

/**
 * QuizBuilderForm — Instructor quiz builder.
 *
 * Edits quiz metadata (title, description, duration, pass mark, status) and the
 * question list. MCQ questions include the correct-answer selector — this is
 * the INSTRUCTOR's own quiz, so correct answers are expected here. They are
 * persisted via a server action and NEVER exposed through student-facing APIs
 * (students only ever receive QuizForStudent, stripped of answers).
 */

type QuestionRow = {
  id: string;
  type: QuestionType;
  text: string;
  options: string[];
  correctOptionIndex: number | undefined;
  /** string input; coerced to int points on save */
  points: string;
};

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'mcq', label: 'Multiple choice' },
  { value: 'short_answer', label: 'Short answer' },
  { value: 'essay', label: 'Essay' },
];

function newQuestionId(): string {
  return `q-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function newQuestionRow(): QuestionRow {
  return {
    id: newQuestionId(),
    type: 'mcq',
    text: '',
    options: ['', ''],
    correctOptionIndex: 0,
    points: '1',
  };
}

function toRow(question: Quiz['questions'][number]): QuestionRow {
  return {
    id: question.id,
    type: question.type,
    text: question.text,
    options: question.options && question.options.length > 0 ? [...question.options] : ['', ''],
    correctOptionIndex:
      question.type === 'mcq' ? question.correctOptionIndex ?? 0 : undefined,
    points: String(question.points),
  };
}

export default function QuizBuilderForm({ initialQuiz }: { initialQuiz: Quiz }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialQuiz.title);
  const [description, setDescription] = useState(initialQuiz.description ?? '');
  const [status, setStatus] = useState<QuizStatus>(initialQuiz.status);
  const [durationMinutes, setDurationMinutes] = useState(String(initialQuiz.durationMinutes));
  const [passingPercent, setPassingPercent] = useState(String(initialQuiz.passingPercent));
  const [questions, setQuestions] = useState<QuestionRow[]>(
    initialQuiz.questions.length > 0
      ? initialQuiz.questions.map(toRow)
      : [newQuestionRow()]
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalPoints = questions.reduce(
    (sum, q) => sum + (Number.parseFloat(q.points) || 0),
    0
  );

  function updateQuestion(index: number, patch: Partial<QuestionRow>) {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  }

  function setQuestionType(index: number, type: QuestionType) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== index) return q;
        if (type === 'mcq') {
          return {
            ...q,
            type,
            options: q.options.length >= 2 ? q.options : ['', ''],
            correctOptionIndex: q.correctOptionIndex ?? 0,
          };
        }
        // Switching away from MCQ: drop the correct-answer marker
        return { ...q, type, correctOptionIndex: undefined };
      })
    );
  }

  function updateOption(questionIndex: number, optionIndex: number, value: string) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === questionIndex
          ? { ...q, options: q.options.map((opt, oi) => (oi === optionIndex ? value : opt)) }
          : q
      )
    );
  }

  function addOption(questionIndex: number) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === questionIndex ? { ...q, options: [...q.options, ''] } : q))
    );
  }

  function removeOption(questionIndex: number, optionIndex: number) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== questionIndex) return q;
        const options = q.options.filter((_, oi) => oi !== optionIndex);
        // Keep the correct marker valid after removal
        let correct = q.correctOptionIndex;
        if (correct === optionIndex) correct = 0;
        else if (correct !== undefined && correct > optionIndex) correct = correct - 1;
        return { ...q, options, correctOptionIndex: correct };
      })
    );
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, newQuestionRow()]);
    setSuccess(false);
  }

  function removeQuestion(index: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
    setSuccess(false);
  }

  function buildPayload() {
    return {
      title,
      description: description || undefined,
      status,
      durationMinutes: Number.parseFloat(durationMinutes) || 0,
      passingPercent: Number.parseFloat(passingPercent) || 0,
      questions: questions.map((q) => ({
        id: q.id,
        type: q.type,
        text: q.text,
        options: q.type === 'mcq' ? q.options : undefined,
        correctOptionIndex: q.type === 'mcq' ? q.correctOptionIndex : undefined,
        points: Number.parseFloat(q.points) || 0,
      })),
    };
  }

  async function handleSave() {
    setErrors({});
    setGlobalError('');
    setSuccess(false);

    const result = quizInputSchema.safeParse(buildPayload());
    if (!result.success) {
      const nextErrors: { [key: string]: string } = {};
      for (const issue of result.error.issues) {
        const [section, questionIndex, field] = issue.path as [string, number, string];
        const key =
          typeof questionIndex === 'number' && field
            ? `${section}.${questionIndex}.${field}`
            : (section ?? 'form');
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await saveQuizAction(initialQuiz.id, result.data);
      if (res.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        setGlobalError(res.error);
      }
    } catch {
      setGlobalError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputBase: React.CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    fontSize: '14px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text)',
    outline: 'none',
    transition: 'border-color 0.15s',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  function questionError(qIndex: number, field: string): string | undefined {
    return errors[`questions.${qIndex}.${field}`];
  }

  return (
    <div>
      {globalError && (
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
          {globalError}
        </div>
      )}

      {success && (
        <div
          role="status"
          style={{
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: 'rgba(22, 163, 74, 0.06)',
            border: '1px solid rgba(22, 163, 74, 0.2)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-success)',
            fontSize: '14px',
            marginBottom: 'var(--space-4)',
          }}
        >
          Quiz saved.
        </div>
      )}

      {/* ── Quiz settings ───────────────────────────────────── */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        style={{ marginBottom: 'var(--space-6)' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Label htmlFor="quiz-title">Quiz title *</Label>
          <input
            id="quiz-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            style={inputBase}
          />
          {errors.title && <FieldError>{errors.title}</FieldError>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Label htmlFor="quiz-status">Status *</Label>
          <select
            id="quiz-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as QuizStatus)}
            disabled={loading}
            style={inputBase}
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Label htmlFor="quiz-duration">Duration (minutes) *</Label>
          <input
            id="quiz-duration"
            type="number"
            min="1"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            disabled={loading}
            style={inputBase}
          />
          {errors.durationMinutes && <FieldError>{errors.durationMinutes}</FieldError>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Label htmlFor="quiz-passing">Pass mark (%) *</Label>
          <input
            id="quiz-passing"
            type="number"
            min="1"
            max="100"
            value={passingPercent}
            onChange={(e) => setPassingPercent(e.target.value)}
            disabled={loading}
            style={inputBase}
          />
          {errors.passingPercent && <FieldError>{errors.passingPercent}</FieldError>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: '1 / -1' }}>
          <Label htmlFor="quiz-description">Description</Label>
          <textarea
            id="quiz-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            rows={3}
            placeholder="Instructions shown to students before they begin…"
            style={{ ...inputBase, resize: 'vertical' }}
          />
        </div>
      </div>

      {/* ── Questions ───────────────────────────────────────── */}
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: 'var(--space-4)' }}
      >
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--color-text)',
            margin: 0,
          }}
        >
          Questions
        </h3>
        <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
          Total points: <strong style={{ color: 'var(--color-text)' }}>{totalPoints}</strong>
        </span>
      </div>

      {errors.questions && !Array.isArray(errors.questions) && (
        <p role="alert" style={{ fontSize: '13px', color: 'var(--color-error)', margin: '0 0 var(--space-3) 0' }}>
          {errors.questions}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {questions.map((q, qIndex) => (
          <div
            key={q.id}
            style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              backgroundColor: 'var(--color-bg-subtle)',
            }}
          >
            {/* Question header */}
            <div
              className="flex flex-wrap items-center justify-between gap-3"
              style={{ marginBottom: 'var(--space-3)' }}
            >
              <div className="flex items-center gap-2">
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {qIndex + 1}
                </span>
                <select
                  value={q.type}
                  onChange={(e) => setQuestionType(qIndex, e.target.value as QuestionType)}
                  disabled={loading}
                  style={{ ...inputBase, width: 'auto', padding: '6px 10px', fontSize: '13px' }}
                  aria-label={`Question ${qIndex + 1} type`}
                >
                  {QUESTION_TYPES.map((qt) => (
                    <option key={qt.value} value={qt.value}>
                      {qt.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                disabled={loading || questions.length <= 1}
                id={`quiz-question-remove-${qIndex}`}
                className="flex items-center gap-1"
                style={{
                  padding: '6px 10px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-bg)',
                  color: 'var(--color-error)',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: loading || questions.length <= 1 ? 'not-allowed' : 'pointer',
                  opacity: loading || questions.length <= 1 ? 0.5 : 1,
                }}
              >
                <Trash2 size={12} aria-hidden="true" />
                Remove
              </button>
            </div>

            {/* Question text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: 'var(--space-3)' }}>
              <textarea
                value={q.text}
                onChange={(e) => updateQuestion(qIndex, { text: e.target.value })}
                disabled={loading}
                rows={2}
                placeholder="Question text"
                style={{ ...inputBase, resize: 'vertical' }}
                aria-label={`Question ${qIndex + 1} text`}
              />
              {questionError(qIndex, 'text') && (
                <FieldError>{questionError(qIndex, 'text')}</FieldError>
              )}
            </div>

            {/* Points */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: q.type === 'mcq' ? 'var(--space-3)' : 0,
              }}
            >
              <label
                htmlFor={`quiz-question-points-${qIndex}`}
                style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}
              >
                Points
              </label>
              <input
                id={`quiz-question-points-${qIndex}`}
                type="number"
                min="0"
                value={q.points}
                onChange={(e) => updateQuestion(qIndex, { points: e.target.value })}
                disabled={loading}
                style={{ ...inputBase, width: '80px' }}
              />
              {questionError(qIndex, 'points') && (
                <FieldError>{questionError(qIndex, 'points')}</FieldError>
              )}
            </div>

            {/* MCQ options */}
            {q.type === 'mcq' && (
              <div>
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    margin: '0 0 var(--space-2) 0',
                  }}
                >
                  Options — select the correct answer
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {q.options.map((option, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${q.id}`}
                        checked={q.correctOptionIndex === oi}
                        onChange={() => updateQuestion(qIndex, { correctOptionIndex: oi })}
                        disabled={loading}
                        style={{ accentColor: 'var(--color-success)', width: '16px', height: '16px', flexShrink: 0 }}
                        aria-label={`Mark option ${oi + 1} as correct`}
                      />
                      <input
                        value={option}
                        onChange={(e) => updateOption(qIndex, oi, e.target.value)}
                        disabled={loading}
                        placeholder={`Option ${oi + 1}`}
                        style={inputBase}
                        aria-label={`Option ${oi + 1} text`}
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(qIndex, oi)}
                        disabled={loading || q.options.length <= 2}
                        id={`quiz-option-remove-${qIndex}-${oi}`}
                        aria-label={`Remove option ${oi + 1}`}
                        style={{
                          padding: '8px',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--color-bg)',
                          color: 'var(--color-error)',
                          cursor: loading || q.options.length <= 2 ? 'not-allowed' : 'pointer',
                          opacity: loading || q.options.length <= 2 ? 0.5 : 1,
                          flexShrink: 0,
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => addOption(qIndex)}
                      disabled={loading}
                      id={`quiz-option-add-${qIndex}`}
                      className="flex items-center gap-1"
                      style={{
                        padding: '6px 12px',
                        border: '1px dashed var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-bg)',
                        color: 'var(--color-primary)',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: loading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <Plus size={12} aria-hidden="true" />
                      Add option
                    </button>
                  </div>
                </div>
                {(questionError(qIndex, 'options') || questionError(qIndex, 'correctOptionIndex')) && (
                  <FieldError>
                    {questionError(qIndex, 'options') ?? questionError(qIndex, 'correctOptionIndex')}
                  </FieldError>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div
        className="flex flex-wrap items-center gap-3"
        style={{ marginTop: 'var(--space-4)' }}
      >
        <button
          type="button"
          onClick={addQuestion}
          disabled={loading}
          id="quiz-add-question"
          className="flex items-center gap-1"
          style={{
            padding: '9px 16px',
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-primary)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          <Plus size={14} aria-hidden="true" />
          Add Question
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          id="quiz-save"
          className="flex items-center gap-2"
          style={{
            padding: '9px 20px',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'background-color 0.15s ease, opacity 0.15s ease',
          }}
        >
          <ListChecks size={14} aria-hidden="true" />
          {loading ? 'Saving…' : 'Save Quiz'}
        </button>
      </div>
    </div>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text)' }}
    >
      {children}
    </label>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" style={{ fontSize: '12px', color: 'var(--color-error)', margin: 0 }}>
      {children}
    </p>
  );
}
