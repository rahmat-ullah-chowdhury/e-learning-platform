/**
 * lib/validation.ts — Shared Zod schemas for the Phase 7 instructor editors.
 *
 * These schemas are used on BOTH sides of the wire:
 *  - client form components (inline field errors, per Rules.md §2)
 *  - server actions (re-validation before persisting mock data)
 *
 * This module is client-safe: it contains no secrets or correct-answer data.
 */
import { z } from 'zod';

export const courseStatusSchema = z.enum(['draft', 'published', 'archived']);
export const contentTypeSchema = z.enum(['video', 'pdf', 'live', 'download']);
export const questionTypeSchema = z.enum(['mcq', 'short_answer', 'essay']);
export const quizStatusSchema = z.enum(['draft', 'scheduled', 'open', 'closed']);

/** Basic course info edited on the instructor course editor */
export const courseInfoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Course title is required')
    .max(120, 'Keep the title under 120 characters'),
  description: z
    .string()
    .trim()
    .min(10, 'Add a description of at least 10 characters'),
  category: z.string().trim().min(1, 'Category is required'),
  pricePence: z.coerce.number().int().min(0, 'Price cannot be negative'),
  status: courseStatusSchema,
  tags: z.array(z.string()).max(10).default([]),
});

/** A single lesson row in the curriculum editor */
export const lessonSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, 'Lesson title is required').max(120),
  contentType: contentTypeSchema,
  durationSeconds: z.coerce.number().int().min(0),
  isFreePreview: z.boolean(),
});

export const lessonsSchema = z
  .array(lessonSchema)
  .min(1, 'A course needs at least one lesson');

/** A single question in the quiz builder */
export const quizQuestionSchema = z
  .object({
    id: z.string().min(1),
    type: questionTypeSchema,
    text: z.string().trim().min(1, 'Question text is required'),
    options: z.array(z.string().trim().min(1, 'Option text cannot be empty')).optional(),
    correctOptionIndex: z.coerce.number().int().min(0).optional(),
    points: z.coerce.number().int().min(0, 'Points cannot be negative'),
  })
  .superRefine((val, ctx) => {
    if (val.type === 'mcq') {
      const options = val.options ?? [];
      if (options.length < 2) {
        ctx.addIssue({
          code: 'custom',
          path: ['options'],
          message: 'MCQ questions need at least 2 options',
        });
      }
      if (val.correctOptionIndex === undefined || val.correctOptionIndex >= options.length) {
        ctx.addIssue({
          code: 'custom',
          path: ['correctOptionIndex'],
          message: 'Select a valid correct answer',
        });
      }
    }
  });

/** Full quiz shape saved by the instructor quiz builder */
export const quizInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Quiz title is required')
    .max(120, 'Keep the title under 120 characters'),
  description: z.string().trim().max(500, 'Keep the description under 500 characters').optional(),
  status: quizStatusSchema,
  durationMinutes: z.coerce.number().int().min(1, 'Duration must be at least 1 minute'),
  passingPercent: z.coerce.number().int().min(1).max(100),
  questions: z.array(quizQuestionSchema).min(1, 'A quiz needs at least one question'),
});
