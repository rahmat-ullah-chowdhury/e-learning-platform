'use client';

import type { QuizForStudent } from '@/types';
import type { SubmittedAnswer } from '@/types';

/**
 * QuestionRenderer — Polymorphic question input component.
 *
 * Renders the appropriate input based on `question.type`:
 *   - mcq          → radio button group (options array)
 *   - short_answer → single-line text input
 *   - essay        → multi-line textarea
 *
 * IMPORTANT: This component never has access to correctOptionIndex.
 * It only receives the QuizForStudent question shape, which omits correct answers.
 * The student's selected value is passed up via `onChange`.
 */

type QuizQuestion = QuizForStudent['questions'][number];

interface QuestionRendererProps {
  question: QuizQuestion;
  questionNumber: number;
  value: string | number | undefined;
  onChange: (questionId: string, value: string | number) => void;
  disabled?: boolean;
}

export default function QuestionRenderer({
  question,
  questionNumber,
  value,
  onChange,
  disabled = false,
}: QuestionRendererProps) {
  const isUnanswered = value === undefined || value === '';

  return (
    <div
      id={`question-${question.id}`}
      style={{
        backgroundColor: 'var(--color-bg)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-card)',
        padding: 'var(--space-6)',
        marginBottom: 'var(--space-4)',
        border: `1px solid ${isUnanswered ? 'var(--color-border)' : 'rgba(37,99,235,0.2)'}`,
        transition: 'border-color 0.2s ease',
      }}
    >
      {/* Question header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-4)',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-bg-subtle)',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            flexShrink: 0,
          }}
        >
          {questionNumber}
        </span>
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: '16px',
              fontWeight: 500,
              color: 'var(--color-text)',
              margin: '0 0 4px 0',
              lineHeight: 1.5,
            }}
          >
            {question.text}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '12px',
                color: 'var(--color-text-muted)',
                padding: '2px 8px',
                backgroundColor: 'var(--color-bg-subtle)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
              }}
            >
              {question.type === 'mcq'
                ? 'Multiple Choice'
                : question.type === 'short_answer'
                ? 'Short Answer'
                : 'Essay'}
            </span>
            <span
              style={{
                fontSize: '12px',
                color: 'var(--color-text-muted)',
              }}
            >
              {question.points} {question.points === 1 ? 'point' : 'points'}
            </span>
          </div>
        </div>
      </div>

      {/* Input area */}
      {question.type === 'mcq' && question.options && (
        <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
          <legend className="sr-only">Choose an answer for question {questionNumber}</legend>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {question.options.map((option, idx) => {
              const isSelected = value === idx;
              return (
                <label
                  key={idx}
                  htmlFor={`${question.id}-opt-${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    backgroundColor: isSelected
                      ? 'rgba(37,99,235,0.05)'
                      : 'var(--color-bg)',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.7 : 1,
                    transition: 'border-color 0.15s ease, background-color 0.15s ease',
                  }}
                >
                  <input
                    type="radio"
                    id={`${question.id}-opt-${idx}`}
                    name={`question-${question.id}`}
                    value={idx}
                    checked={isSelected}
                    disabled={disabled}
                    onChange={() => onChange(question.id, idx)}
                    style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
                  />
                  <span
                    style={{
                      fontSize: '15px',
                      color: isSelected ? 'var(--color-primary)' : 'var(--color-text)',
                      fontWeight: isSelected ? 500 : 400,
                    }}
                  >
                    {option}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {question.type === 'short_answer' && (
        <input
          id={`${question.id}-input`}
          type="text"
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(question.id, e.target.value)}
          disabled={disabled}
          placeholder="Type your answer here…"
          style={{
            width: '100%',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text)',
            fontSize: '15px',
            outline: 'none',
            transition: 'border-color 0.15s ease',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
        />
      )}

      {question.type === 'essay' && (
        <textarea
          id={`${question.id}-textarea`}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(question.id, e.target.value)}
          disabled={disabled}
          placeholder="Write your response here…"
          rows={8}
          style={{
            width: '100%',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text)',
            fontSize: '15px',
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.15s ease',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
        />
      )}
    </div>
  );
}
