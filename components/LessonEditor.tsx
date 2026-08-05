'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { lessonsSchema } from '@/lib/validation';
import { saveLessonsAction } from '@/app/(instructor)/instructor/courses/[id]/edit/actions';
import type { Lesson, ContentType } from '@/types';
import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';

/**
 * LessonEditor — Curriculum editor for the instructor course editor.
 *
 * Manages the course's lesson list as editable rows (title, content type,
 * duration in minutes, free-preview flag). Add / remove / reorder rows
 * client-side, then persist the whole list via saveLessonsAction.
 * Durations are entered in minutes and converted to seconds on submit.
 */

type LessonRow = {
  id: string;
  title: string;
  contentType: ContentType;
  /** Displayed in minutes; converted to seconds on submit */
  durationMinutes: string;
  isFreePreview: boolean;
};

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: 'video', label: 'Video' },
  { value: 'pdf', label: 'PDF' },
  { value: 'live', label: 'Live session' },
  { value: 'download', label: 'Download' },
];

function newRowId(): string {
  return `lesson-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function toRow(lesson: Lesson): LessonRow {
  return {
    id: lesson.id,
    title: lesson.title,
    contentType: lesson.contentType,
    durationMinutes:
      lesson.durationSeconds && lesson.durationSeconds > 0
        ? String(Math.round(lesson.durationSeconds / 60))
        : '',
    isFreePreview: lesson.isFreePreview,
  };
}

export default function LessonEditor({
  courseId,
  initialLessons,
}: {
  courseId: string;
  initialLessons: Lesson[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState<LessonRow[]>(
    initialLessons.length > 0 ? initialLessons.map(toRow) : [newRow()],
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function newRow(): LessonRow {
    return {
      id: newRowId(),
      title: '',
      contentType: 'video',
      durationMinutes: '',
      isFreePreview: false,
    };
  }

  function updateRow(index: number, patch: Partial<LessonRow>) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function addRow() {
    setRows((prev) => [...prev, newRow()]);
    setSuccess(false);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
    setSuccess(false);
  }

  function moveRow(index: number, direction: -1 | 1) {
    setRows((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setSuccess(false);
  }

  async function handleSave() {
    setErrors([]);
    setGlobalError('');
    setSuccess(false);

    const payload = rows.map((row) => ({
      id: row.id,
      title: row.title,
      contentType: row.contentType,
      durationSeconds:
        row.contentType === 'video' || row.contentType === 'live'
          ? Math.round(Number.parseFloat(row.durationMinutes || '0') * 60)
          : 0,
      isFreePreview: row.isFreePreview,
    }));

    const result = lessonsSchema.safeParse(payload);
    if (!result.success) {
      // Map field issues back to row indexes; array-level issues (e.g. "needs at
      // least one lesson" when every row was removed) have an empty path.
      const rowErrors: string[] = [];
      let listError = '';
      for (const issue of result.error.issues) {
        const [rowIndex] = issue.path as [number];
        if (typeof rowIndex === 'number') {
          rowErrors[rowIndex] = issue.message;
        } else {
          listError = issue.message;
        }
      }
      setErrors(rowErrors);
      setGlobalError(listError);
      return;
    }

    setLoading(true);
    try {
      const res = await saveLessonsAction(courseId, result.data);
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
          Curriculum saved.
        </div>
      )}

      {/* Lesson rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {rows.length === 0 && (
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', margin: 0 }}>
            No lessons yet — add your first lesson below.
          </p>
        )}
        {rows.map((row, index) => {
          const rowError = errors[index];
          const showDuration = row.contentType === 'video' || row.contentType === 'live';
          return (
            <div
              key={row.id}
              style={{
                border: `1px solid ${rowError ? 'var(--color-error)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-3)',
                backgroundColor: 'var(--color-bg-subtle)',
              }}
            >
              {/* Row header: order + remove */}
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: 'var(--space-2)' }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-text-muted)',
                  }}
                >
                  Lesson {index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <IconButton
                    id={`lesson-move-up-${index}`}
                    label="Move up"
                    disabled={index === 0}
                    onClick={() => moveRow(index, -1)}
                  >
                    <MoveUp size={14} />
                  </IconButton>
                  <IconButton
                    id={`lesson-move-down-${index}`}
                    label="Move down"
                    disabled={index === rows.length - 1}
                    onClick={() => moveRow(index, 1)}
                  >
                    <MoveDown size={14} />
                  </IconButton>
                  <IconButton
                    id={`lesson-remove-${index}`}
                    label="Remove lesson"
                    onClick={() => removeRow(index)}
                    danger
                  >
                    <Trash2 size={14} />
                  </IconButton>
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-5" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <input
                    value={row.title}
                    onChange={(e) => updateRow(index, { title: e.target.value })}
                    placeholder="Lesson title"
                    disabled={loading}
                    style={inputBase}
                    aria-label={`Lesson ${index + 1} title`}
                  />
                </div>
                <div className="sm:col-span-3" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <select
                    value={row.contentType}
                    onChange={(e) =>
                      updateRow(index, { contentType: e.target.value as ContentType })
                    }
                    disabled={loading}
                    style={inputBase}
                    aria-label={`Lesson ${index + 1} content type`}
                  >
                    {CONTENT_TYPES.map((ct) => (
                      <option key={ct.value} value={ct.value}>
                        {ct.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <input
                    type="number"
                    min="0"
                    value={row.durationMinutes}
                    onChange={(e) => updateRow(index, { durationMinutes: e.target.value })}
                    placeholder="Mins"
                    disabled={loading || !showDuration}
                    style={{ ...inputBase, opacity: showDuration ? 1 : 0.5 }}
                    aria-label={`Lesson ${index + 1} duration in minutes`}
                  />
                </div>
                <label
                  className="sm:col-span-2 flex items-center gap-2"
                  style={{ fontSize: '13px', color: 'var(--color-text)', cursor: 'pointer' }}
                >
                  <input
                    type="checkbox"
                    checked={row.isFreePreview}
                    onChange={(e) => updateRow(index, { isFreePreview: e.target.checked })}
                    disabled={loading}
                    style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
                  />
                  Free preview
                </label>
              </div>

              {rowError && (
                <p role="alert" style={{ fontSize: '13px', color: 'var(--color-error)', margin: 'var(--space-2) 0 0 0' }}>
                  {rowError}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div
        className="flex flex-wrap items-center gap-3"
        style={{ marginTop: 'var(--space-4)' }}
      >
        <button
          type="button"
          onClick={addRow}
          id="lesson-add"
          disabled={loading}
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
            transition: 'background-color 0.15s ease',
          }}
        >
          <Plus size={14} aria-hidden="true" />
          Add Lesson
        </button>
        <button
          type="button"
          onClick={handleSave}
          id="lessons-save"
          disabled={loading}
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
          {loading ? 'Saving…' : 'Save Curriculum'}
        </button>
      </div>
    </div>
  );
}

function IconButton({
  id,
  label,
  onClick,
  disabled = false,
  danger = false,
  children,
}: {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      id={id}
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center"
      style={{
        width: '28px',
        height: '28px',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--color-bg)',
        color: danger ? 'var(--color-error)' : 'var(--color-text-muted)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'background-color 0.15s ease, color 0.15s ease',
      }}
    >
      {children}
    </button>
  );
}
