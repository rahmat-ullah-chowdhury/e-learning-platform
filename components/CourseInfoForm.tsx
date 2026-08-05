'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { courseInfoSchema } from '@/lib/validation';
import { saveCourseInfoAction } from '@/app/(instructor)/instructor/courses/[id]/edit/actions';
import type { Course } from '@/types';

/**
 * CourseInfoForm — Basic course info editor (title, description, category,
 * price, status, tags). Client component with Zod validation; persists via
 * the saveCourseInfoAction server action.
 *
 * Price is entered in pounds (e.g. "19.99") and converted to integer pence
 * on submit — the canonical storage unit (types/course.ts).
 */

type CourseInfoValues = {
  title: string;
  description: string;
  category: string;
  pricePence: number;
  status: Course['status'];
  tags: string[];
};

type FieldErrors = Partial<Record<'title' | 'description' | 'category' | 'pricePence' | 'status', string>>;

export default function CourseInfoForm({
  courseId,
  initialCourse,
  categories,
}: {
  courseId: string;
  initialCourse: Course;
  categories: string[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialCourse.title);
  const [description, setDescription] = useState(initialCourse.description);
  const [category, setCategory] = useState(initialCourse.category);
  // Price as pounds string for the input; convert to pence on submit
  const [pricePounds, setPricePounds] = useState(
    initialCourse.pricePence > 0 ? (initialCourse.pricePence / 100).toFixed(2) : '0.00'
  );
  const [status, setStatus] = useState<Course['status']>(initialCourse.status);
  const [tags, setTags] = useState(initialCourse.tags.join(', '));

  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function buildValues(): CourseInfoValues {
    // "19.99" → 1999 (pence); tolerate "19" or "19.9"
    const priceNumber = Number.parseFloat(pricePounds.replace(/[^0-9.]/g, ''));
    const pricePence = Number.isFinite(priceNumber) ? Math.round(priceNumber * 100) : 0;
    return {
      title,
      description,
      category,
      pricePence,
      status,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setGlobalError('');
    setSuccess(false);

    const values = buildValues();
    const result = courseInfoSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FieldErrors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await saveCourseInfoAction(courseId, result.data);
      if (res.ok) {
        setSuccess(true);
        // Re-fetch server data so derived fields (slug, updatedAt) refresh
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
    padding: '10px 12px',
    fontSize: '15px',
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
    <form onSubmit={handleSubmit} noValidate>
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
          Course details saved.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Label htmlFor="course-title">Course title *</Label>
          <input
            id="course-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            placeholder="e.g. Python for Beginners"
            style={inputBase}
            aria-invalid={!!errors.title}
          />
          {errors.title && <FieldError id="course-title-error">{errors.title}</FieldError>}
        </div>

        {/* Category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Label htmlFor="course-category">Category *</Label>
          <input
            id="course-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
            list="course-category-options"
            placeholder="e.g. Programming"
            style={inputBase}
            aria-invalid={!!errors.category}
          />
          <datalist id="course-category-options">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          {errors.category && <FieldError id="course-category-error">{errors.category}</FieldError>}
        </div>

        {/* Price */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Label htmlFor="course-price">Price (£) *</Label>
          <input
            id="course-price"
            type="number"
            min="0"
            step="0.01"
            value={pricePounds}
            onChange={(e) => setPricePounds(e.target.value)}
            disabled={loading}
            placeholder="0.00"
            style={inputBase}
            aria-invalid={!!errors.pricePence}
          />
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>
            Enter 0 for a free course.
          </p>
          {errors.pricePence && <FieldError id="course-price-error">{errors.pricePence}</FieldError>}
        </div>

        {/* Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Label htmlFor="course-status">Status *</Label>
          <select
            id="course-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Course['status'])}
            disabled={loading}
            style={inputBase}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>
            Only published courses appear in the public catalogue.
          </p>
        </div>
      </div>

      {/* Description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: 'var(--space-4)' }}>
        <Label htmlFor="course-description">Description *</Label>
        <textarea
          id="course-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          rows={5}
          placeholder="Describe what students will learn…"
          style={{ ...inputBase, resize: 'vertical' }}
          aria-invalid={!!errors.description}
        />
        {errors.description && <FieldError id="course-description-error">{errors.description}</FieldError>}
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: 'var(--space-4)' }}>
        <Label htmlFor="course-tags">Tags</Label>
        <input
          id="course-tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          disabled={loading}
          placeholder="python, beginner, programming (comma separated)"
          style={inputBase}
        />
      </div>

      <button
        type="submit"
        id="course-info-save"
        disabled={loading}
        style={{
          marginTop: 'var(--space-6)',
          backgroundColor: 'var(--color-primary)',
          color: '#fff',
          padding: '10px 24px',
          borderRadius: 'var(--radius-sm)',
          border: 'none',
          fontWeight: 500,
          fontSize: '14px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'background-color 0.15s ease, opacity 0.15s ease',
        }}
      >
        {loading ? 'Saving…' : 'Save Course Details'}
      </button>
    </form>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text)' }}
    >
      {children}
    </label>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p
      id={id}
      role="alert"
      style={{ fontSize: '13px', color: 'var(--color-error)', margin: 0 }}
    >
      {children}
    </p>
  );
}

