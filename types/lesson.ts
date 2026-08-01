import type { ContentType } from './course';

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  contentType: ContentType;
  /** Order within the course (1-indexed) */
  order: number;
  /** Duration in seconds (applicable to video/live) */
  durationSeconds?: number;
  /** Signed URL or direct URL depending on content type */
  contentUrl?: string;
  /** Filename for downloadable resources */
  fileName?: string;
  /** File size in bytes for PDFs/downloads */
  fileSizeBytes?: number;
  isFreePreview: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Per-student lesson progress record */
export interface LessonProgress {
  lessonId: string;
  userId: string;
  completed: boolean;
  /** Last watch position in seconds (for video lessons) */
  lastPositionSeconds?: number;
  completedAt?: string;
}
