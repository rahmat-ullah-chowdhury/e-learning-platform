/**
 * lib/api.ts — Mock API layer
 *
 * This file is the ONLY place components fetch data from.
 * Rule: never call fetch() directly inside a component.
 *
 * Phase 3: returns mock data with artificial delay to simulate real latency.
 * Phase 9+: replace individual functions with real fetch() calls to the backend.
 * The component-facing API (function names, parameter shapes, return types) must
 * NOT change between mock and real — only the implementation inside each function.
 */

import type {
  Course,
  CourseListItem,
  Enrollment,
  AuthUser,
  PaymentSummary,
  Lesson,
  LessonProgress,
  QuizForStudent,
  Quiz,
  Question,
  SubmittedAnswer,
  Attempt,
  CourseStatus,
  ContentType,
  QuestionType,
  QuizStatus,
} from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Simulate network latency in development */
const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

/** Format pence as a GBP price string e.g. "£19.99" or "Free" */
export function formatPrice(pricePence: number): string {
  if (pricePence === 0) return 'Free';
  return `£${(pricePence / 100).toFixed(2)}`;
}

/** Format total seconds as "Xh Ym" or "Xm" */
export function formatDuration(totalSeconds: number): string {
  if (totalSeconds === 0) return '—';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    slug: 'python-for-beginners',
    title: 'Python for Beginners',
    description:
      'Learn Python from scratch — variables, loops, functions, and building your first real project. No experience required. This comprehensive course takes you from zero to writing your own Python programs.',
    thumbnailUrl: undefined,
    instructorId: 'i1',
    instructorName: 'Sarah Mitchell',
    pricePence: 0,
    currency: 'GBP',
    status: 'published',
    category: 'Programming',
    tags: ['python', 'beginner', 'programming'],
    totalDurationSeconds: 7200,
    lessonCount: 24,
    enrollmentCount: 4821,
    averageRating: 4.7,
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-06-01T12:00:00Z',
  },
  {
    id: 'c2',
    slug: 'web-development-bootcamp',
    title: 'Web Development Bootcamp',
    description:
      'A comprehensive full-stack web development course covering HTML, CSS, JavaScript, React, Node.js, and databases. Build 10 real projects and launch your career as a developer.',
    thumbnailUrl: undefined,
    instructorId: 'i2',
    instructorName: 'James Thornton',
    pricePence: 4999,
    currency: 'GBP',
    status: 'published',
    category: 'Web Development',
    tags: ['html', 'css', 'javascript', 'react', 'nodejs'],
    totalDurationSeconds: 64800,
    lessonCount: 82,
    enrollmentCount: 11203,
    averageRating: 4.8,
    createdAt: '2025-11-05T09:00:00Z',
    updatedAt: '2026-07-15T12:00:00Z',
  },
  {
    id: 'c3',
    slug: 'data-science-fundamentals',
    title: 'Data Science Fundamentals',
    description:
      'Master the core concepts of data science: statistics, data wrangling with pandas, visualisation with matplotlib, and an introduction to machine learning with scikit-learn.',
    thumbnailUrl: undefined,
    instructorId: 'i1',
    instructorName: 'Sarah Mitchell',
    pricePence: 3499,
    currency: 'GBP',
    status: 'published',
    category: 'Data Science',
    tags: ['python', 'data science', 'machine learning', 'pandas'],
    totalDurationSeconds: 36000,
    lessonCount: 48,
    enrollmentCount: 3654,
    averageRating: 4.6,
    createdAt: '2026-02-20T09:00:00Z',
    updatedAt: '2026-07-01T12:00:00Z',
  },
  {
    id: 'c4',
    slug: 'ux-design-essentials',
    title: 'UX Design Essentials',
    description:
      'Learn the fundamentals of user experience design — user research, wireframing, prototyping, and usability testing. Build a portfolio-ready case study by the end of the course.',
    thumbnailUrl: undefined,
    instructorId: 'i3',
    instructorName: 'Priya Nair',
    pricePence: 2999,
    currency: 'GBP',
    status: 'published',
    category: 'Design',
    tags: ['ux', 'design', 'figma', 'prototyping'],
    totalDurationSeconds: 21600,
    lessonCount: 30,
    enrollmentCount: 2187,
    averageRating: 4.5,
    createdAt: '2026-03-15T09:00:00Z',
    updatedAt: '2026-06-20T12:00:00Z',
  },
  {
    id: 'c5',
    slug: 'excel-for-professionals',
    title: 'Excel for Professionals',
    description:
      'Go beyond the basics — master pivot tables, VLOOKUP, macros, Power Query, and financial modelling. The essential Excel skills every professional needs to work faster and smarter.',
    thumbnailUrl: undefined,
    instructorId: 'i4',
    instructorName: 'David Okafor',
    pricePence: 0,
    currency: 'GBP',
    status: 'published',
    category: 'Business',
    tags: ['excel', 'spreadsheet', 'business', 'data'],
    totalDurationSeconds: 18000,
    lessonCount: 22,
    enrollmentCount: 7934,
    averageRating: 4.4,
    createdAt: '2025-12-01T09:00:00Z',
    updatedAt: '2026-05-10T12:00:00Z',
  },
  {
    id: 'c6',
    slug: 'aws-cloud-practitioner',
    title: 'AWS Cloud Practitioner',
    description:
      'Everything you need to pass the AWS Certified Cloud Practitioner exam. Covers core AWS services, security, pricing, and cloud concepts with hands-on demos and practice exams.',
    thumbnailUrl: undefined,
    instructorId: 'i5',
    instructorName: 'Marcus Webb',
    pricePence: 5999,
    currency: 'GBP',
    status: 'published',
    category: 'Cloud',
    tags: ['aws', 'cloud', 'certification', 'devops'],
    totalDurationSeconds: 43200,
    lessonCount: 56,
    enrollmentCount: 5012,
    averageRating: 4.9,
    createdAt: '2026-01-25T09:00:00Z',
    updatedAt: '2026-07-20T12:00:00Z',
  },
  {
    id: 'c7',
    slug: 'digital-marketing-masterclass',
    title: 'Digital Marketing Masterclass',
    description:
      'Learn SEO, social media marketing, Google Ads, email marketing, and analytics from scratch. Practical strategies used by real agencies to grow brands and generate leads.',
    thumbnailUrl: undefined,
    instructorId: 'i3',
    instructorName: 'Priya Nair',
    pricePence: 1999,
    currency: 'GBP',
    status: 'published',
    category: 'Marketing',
    tags: ['marketing', 'seo', 'social media', 'google ads'],
    totalDurationSeconds: 27000,
    lessonCount: 36,
    enrollmentCount: 3298,
    averageRating: 4.3,
    createdAt: '2026-04-10T09:00:00Z',
    updatedAt: '2026-07-05T12:00:00Z',
  },
  {
    id: 'c8',
    slug: 'project-management-fundamentals',
    title: 'Project Management Fundamentals',
    description:
      'Understand Agile, Scrum, Waterfall, and hybrid methodologies. Learn to manage teams, budgets, and timelines effectively — whether you are new to PM or preparing for a certification.',
    thumbnailUrl: undefined,
    instructorId: 'i4',
    instructorName: 'David Okafor',
    pricePence: 0,
    currency: 'GBP',
    status: 'published',
    category: 'Business',
    tags: ['project management', 'agile', 'scrum', 'pmp'],
    totalDurationSeconds: 14400,
    lessonCount: 18,
    enrollmentCount: 6102,
    averageRating: 4.6,
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-06-15T12:00:00Z',
  },
];

/** Mock lessons for a course — used on the course detail page */
const MOCK_LESSONS: Record<string, Lesson[]> = {
  'c1': [
    { id: 'l1', courseId: 'c1', title: 'Welcome & Setup', contentType: 'video', order: 1, durationSeconds: 480, isFreePreview: true, createdAt: '', updatedAt: '' },
    { id: 'l2', courseId: 'c1', title: 'Variables and Data Types', contentType: 'video', order: 2, durationSeconds: 720, isFreePreview: true, createdAt: '', updatedAt: '' },
    { id: 'l3', courseId: 'c1', title: 'Control Flow: if, elif, else', contentType: 'video', order: 3, durationSeconds: 900, isFreePreview: false, createdAt: '', updatedAt: '' },
    { id: 'l4', courseId: 'c1', title: 'Loops: for and while', contentType: 'video', order: 4, durationSeconds: 840, isFreePreview: false, createdAt: '', updatedAt: '' },
    { id: 'l5', courseId: 'c1', title: 'Functions', contentType: 'video', order: 5, durationSeconds: 1020, isFreePreview: false, createdAt: '', updatedAt: '' },
    { id: 'l6', courseId: 'c1', title: 'Course Resources', contentType: 'download', order: 6, isFreePreview: true, createdAt: '', updatedAt: '' },
  ],
  'c2': [
    { id: 'l7', courseId: 'c2', title: 'Course Introduction', contentType: 'video', order: 1, durationSeconds: 300, isFreePreview: true, createdAt: '', updatedAt: '' },
    { id: 'l8', courseId: 'c2', title: 'HTML Fundamentals', contentType: 'video', order: 2, durationSeconds: 1800, isFreePreview: true, createdAt: '', updatedAt: '' },
    { id: 'l9', courseId: 'c2', title: 'CSS Styling', contentType: 'video', order: 3, durationSeconds: 2400, isFreePreview: false, createdAt: '', updatedAt: '' },
    { id: 'l10', courseId: 'c2', title: 'JavaScript Basics', contentType: 'video', order: 4, durationSeconds: 3600, isFreePreview: false, createdAt: '', updatedAt: '' },
    { id: 'l11', courseId: 'c2', title: 'Live Q&A Session', contentType: 'live', order: 5, durationSeconds: 3600, isFreePreview: false, createdAt: '', updatedAt: '' },
  ],
};

// ─── Course API functions ──────────────────────────────────────────────────────

/**
 * Get all published courses (for listing page).
 * Phase 9: replace with GET /api/courses
 */
export async function getCourses(options?: {
  category?: string;
  search?: string;
}): Promise<CourseListItem[]> {
  await delay();
  let courses = getDb().courses.filter((c) => c.status === 'published');

  if (options?.category) {
    courses = courses.filter(
      (c) => c.category.toLowerCase() === options.category!.toLowerCase()
    );
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    courses = courses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.includes(q))
    );
  }

  return courses.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    thumbnailUrl: c.thumbnailUrl,
    instructorName: c.instructorName,
    pricePence: c.pricePence,
    currency: c.currency,
    category: c.category,
    enrollmentCount: c.enrollmentCount,
    averageRating: c.averageRating,
    lessonCount: c.lessonCount,
  }));
}

/**
 * Get a single course by slug (for detail page).
 * Phase 9: replace with GET /api/courses/:slug
 */
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  await delay();
  return getDb().courses.find((c) => c.slug === slug && c.status === 'published') ?? null;
}

/**
 * Get lessons for a course (for detail page curriculum section).
 * Phase 9: replace with GET /api/courses/:id/lessons
 */
export async function getLessonsByCourseId(courseId: string): Promise<Lesson[]> {
  await delay();
  return getDb().lessons[courseId] ?? [];
}

/**
 * Get featured courses for the home page (top-rated published courses).
 * Phase 9: replace with GET /api/courses?featured=true
 */
export async function getFeaturedCourses(): Promise<CourseListItem[]> {
  await delay();
  return getDb().courses
    .filter((c) => c.status === 'published' && c.averageRating !== null)
    .sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
    .slice(0, 4)
    .map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      thumbnailUrl: c.thumbnailUrl,
      instructorName: c.instructorName,
      pricePence: c.pricePence,
      currency: c.currency,
      category: c.category,
      enrollmentCount: c.enrollmentCount,
      averageRating: c.averageRating,
      lessonCount: c.lessonCount,
    }));
}

/** Get all unique categories from published courses */
export async function getCategories(): Promise<string[]> {
  await delay(50);
  const cats = new Set(getDb().courses.filter((c) => c.status === 'published').map((c) => c.category));
  return Array.from(cats).sort();
}

// ─── Auth API functions (mock) ─────────────────────────────────────────────────
//
// These functions simulate backend auth responses during Phases 4–8.
// Phase 9: replace each body with a real fetch() call to the backend.
// The function signatures (name, params, return type) must NOT change.
//
// Per Rules.md: user-facing auth errors are always generic — never reveal
// which specific field failed (e.g. don't say "email not found" or "wrong password").

export type AuthResult =
  | { ok: true; redirectTo: string }
  | { ok: false; error: string };

/**
 * Log in with email + password.
 * Phase 9: POST /api/auth/login
 */
export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  await delay(600);
  // Mock: any well-formed credentials succeed; simulate failure for demo account
  if (data.email === 'fail@example.com') {
    return { ok: false, error: 'Invalid credentials. Please try again.' };
  }
  return { ok: true, redirectTo: '/dashboard' };
}

/**
 * Register a new account.
 * Phase 9: POST /api/auth/signup
 */
export async function signup(data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  await delay(800);
  // Mock: simulate "email already in use" for demo address
  if (data.email === 'taken@example.com') {
    return { ok: false, error: 'An account with this email already exists.' };
  }
  return { ok: true, redirectTo: '/dashboard' };
}

export type ForgotPasswordResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Request a password reset link.
 * Phase 9: POST /api/auth/forgot-password
 *
 * Note: always returns ok:true regardless of whether the email exists —
 * this prevents user-enumeration attacks (confirms nothing about the email).
 */
export async function forgotPassword(data: {
  email: string;
}): Promise<ForgotPasswordResult> {
  await delay(700);
  // Always succeeds client-side — real endpoint does the same (user-enumeration prevention)
  void data.email;
  return { ok: true };
}

export type ResetPasswordResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Submit a new password using the reset token from the URL.
 * Phase 9: POST /api/auth/reset-password
 */
export async function resetPassword(data: {
  token: string;
  password: string;
}): Promise<ResetPasswordResult> {
  await delay(700);
  // Mock: simulate an expired/invalid token
  if (data.token === 'expired') {
    return { ok: false, error: 'This link has expired. Please request a new one.' };
  }
  return { ok: true };
}

// ─── Phase 5: Student Dashboard & Course Player ────────────────────────────────
//
// NOTE: No real access control exists on /dashboard or /learn/* routes yet.
// They are reachable by direct URL with a hardcoded mock user, purely to build
// and test the UI. Real protected-route middleware and actual auth state come
// in Phase 9.

/**
 * View-model type joining an Enrollment with its Course summary.
 * Defined here (not in types/) because it's a display-layer composite,
 * not a core domain type. Logged as an explicit decision in Memory.md.
 */
export type EnrolledCourse = {
  enrollment: Enrollment;
  course: CourseListItem;
};

/** Hardcoded mock user for Phase 5 UI development */
const MOCK_CURRENT_USER: AuthUser = {
  id: 'u1',
  email: 'alex.johnson@example.com',
  name: 'Alex Johnson',
  role: 'student',
  status: 'active',
};

/** Mock enrollments — 4 enrollments at various stages */
const MOCK_ENROLLMENTS: Enrollment[] = [
  {
    id: 'e1',
    userId: 'u1',
    courseId: 'c1',
    status: 'completed',
    progressPercent: 100,
    paymentId: null,
    enrolledAt: '2026-03-15T10:00:00Z',
    completedAt: '2026-05-20T14:30:00Z',
  },
  {
    id: 'e2',
    userId: 'u1',
    courseId: 'c2',
    status: 'active',
    progressPercent: 65,
    paymentId: 'p1',
    enrolledAt: '2026-04-01T09:00:00Z',
    completedAt: null,
  },
  {
    id: 'e3',
    userId: 'u1',
    courseId: 'c3',
    status: 'active',
    progressPercent: 30,
    paymentId: 'p2',
    enrolledAt: '2026-06-10T11:00:00Z',
    completedAt: null,
  },
  {
    id: 'e4',
    userId: 'u1',
    courseId: 'c5',
    status: 'active',
    progressPercent: 0,
    paymentId: null,
    enrolledAt: '2026-07-28T08:00:00Z',
    completedAt: null,
  },
];

/** Mock lesson progress for enrolled courses */
const MOCK_LESSON_PROGRESS: LessonProgress[] = [
  // c1 (Python) — all completed
  { lessonId: 'l1', userId: 'u1', completed: true, completedAt: '2026-03-16T10:00:00Z' },
  { lessonId: 'l2', userId: 'u1', completed: true, completedAt: '2026-03-17T10:00:00Z' },
  { lessonId: 'l3', userId: 'u1', completed: true, completedAt: '2026-03-20T10:00:00Z' },
  { lessonId: 'l4', userId: 'u1', completed: true, completedAt: '2026-04-01T10:00:00Z' },
  { lessonId: 'l5', userId: 'u1', completed: true, completedAt: '2026-05-10T10:00:00Z' },
  { lessonId: 'l6', userId: 'u1', completed: true, completedAt: '2026-05-20T10:00:00Z' },
  // c2 (Web Dev) — partial
  { lessonId: 'l7', userId: 'u1', completed: true, completedAt: '2026-04-02T09:00:00Z' },
  { lessonId: 'l8', userId: 'u1', completed: true, completedAt: '2026-04-05T09:00:00Z' },
  { lessonId: 'l9', userId: 'u1', completed: true, lastPositionSeconds: 2400, completedAt: '2026-04-10T09:00:00Z' },
  { lessonId: 'l10', userId: 'u1', completed: false, lastPositionSeconds: 1200 },
  { lessonId: 'l11', userId: 'u1', completed: false },
];

/** Mock payment history */
const MOCK_PAYMENTS: PaymentSummary[] = [
  {
    id: 'p1',
    courseTitle: 'Web Development Bootcamp',
    amountPence: 4999,
    currency: 'GBP',
    status: 'succeeded',
    createdAt: '2026-04-01T09:00:00Z',
    invoiceUrl: '#',
  },
  {
    id: 'p2',
    courseTitle: 'Data Science Fundamentals',
    amountPence: 3499,
    currency: 'GBP',
    status: 'succeeded',
    createdAt: '2026-06-10T11:00:00Z',
    invoiceUrl: '#',
  },
];

// ─── Student Dashboard API functions ───────────────────────────────────────────

/**
 * Get the currently logged-in user.
 * Phase 9: reads from JWT cookie via server-side auth.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  await delay(100);
  return getDb().currentUser;
}

/**
 * Get all enrollments for the current user, joined with course info.
 * Phase 10: GET /api/enrollments
 */
export async function getEnrollments(): Promise<EnrolledCourse[]> {
  await delay();
  return getDb().enrollments.map((enrollment): EnrolledCourse | null => {
    const course = getDb().courses.find((c) => c.id === enrollment.courseId);
    if (!course) return null;
    return {
      enrollment,
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        thumbnailUrl: course.thumbnailUrl,
        instructorName: course.instructorName,
        pricePence: course.pricePence,
        currency: course.currency,
        category: course.category,
        enrollmentCount: course.enrollmentCount,
        averageRating: course.averageRating,
        lessonCount: course.lessonCount,
      },
    };
  }).filter((e): e is EnrolledCourse => e !== null);
}

/**
 * Get a single enrollment by course slug, with full lesson list + progress.
 * Phase 10: GET /api/enrollments/:courseSlug
 */
export async function getEnrollmentBySlug(slug: string): Promise<{
  enrollment: Enrollment;
  course: Course;
  lessons: Lesson[];
  progress: LessonProgress[];
} | null> {
  await delay();
  const db = getDb();
  const course = db.courses.find((c) => c.slug === slug);
  if (!course) return null;
  const enrollment = db.enrollments.find((e) => e.courseId === course.id);
  if (!enrollment) return null;
  const lessons = db.lessons[course.id] ?? [];
  const lessonIds = new Set(lessons.map((l) => l.id));
  const progress = db.lessonProgress.filter((p) => lessonIds.has(p.lessonId));
  return { enrollment, course, lessons, progress };
}

/**
 * Get a single lesson by ID (with contentUrl for the player).
 * Phase 10: GET /api/lessons/:id
 */
export async function getLessonById(lessonId: string): Promise<Lesson | null> {
  await delay(100);
  for (const lessons of Object.values(getDb().lessons)) {
    const lesson = lessons.find((l) => l.id === lessonId);
    if (lesson) {
      return {
        ...lesson,
        contentUrl: lesson.contentType === 'video'
          ? 'https://example.com/placeholder-video.mp4'
          : lesson.contentType === 'pdf'
            ? 'https://example.com/placeholder.pdf'
            : undefined,
      };
    }
  }
  return null;
}

/**
 * Get lesson progress for the current user for a specific set of lessons.
 * Phase 10: GET /api/progress?lessonIds=...
 */
export async function getLessonProgress(lessonIds: string[]): Promise<LessonProgress[]> {
  await delay(50);
  const idSet = new Set(lessonIds);
  return getDb().lessonProgress.filter((p) => idSet.has(p.lessonId));
}

/**
 * Mark a lesson as complete for the current user.
 * Phase 10: POST /api/progress/:lessonId/complete
 */
export async function markLessonComplete(lessonId: string): Promise<{ ok: true }> {
  await delay(300);
  const db = getDb();
  // Mock: find and update the lesson progress entry, or add a new one
  const existing = db.lessonProgress.find((p) => p.lessonId === lessonId);
  if (existing) {
    existing.completed = true;
    existing.completedAt = new Date().toISOString();
  } else {
    db.lessonProgress.push({
      lessonId,
      userId: 'u1',
      completed: true,
      completedAt: new Date().toISOString(),
    });
  }
  // Recalculate enrollment progress for the course that owns this lesson
  for (const [courseId, lessons] of Object.entries(db.lessons)) {
    if (lessons.some((l) => l.id === lessonId)) {
      const totalLessons = lessons.length;
      const completedLessons = lessons.filter((l) =>
        db.lessonProgress.some((p) => p.lessonId === l.id && p.completed)
      ).length;
      const enrollment = db.enrollments.find((e) => e.courseId === courseId);
      if (enrollment) {
        enrollment.progressPercent = Math.round((completedLessons / totalLessons) * 100);
        if (enrollment.progressPercent === 100) {
          enrollment.status = 'completed';
          enrollment.completedAt = new Date().toISOString();
        }
      }
      break;
    }
  }
  return { ok: true };
}

/**
 * Get payment history for the current user.
 * Phase 11: GET /api/payments
 */
export async function getPaymentHistory(): Promise<PaymentSummary[]> {
  await delay();
  return getDb().payments;
}

export type ProfileUpdateResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Update the current user's profile (name, email).
 * Phase 9: PUT /api/users/me
 */
export async function updateProfile(data: {
  name: string;
  email: string;
}): Promise<ProfileUpdateResult> {
  await delay(500);
  if (data.email === 'taken@example.com') {
    return { ok: false, error: 'This email is already in use.' };
  }
  // Mock: update in-memory
  getDb().currentUser.name = data.name;
  getDb().currentUser.email = data.email;
  return { ok: true };
}

export type ChangePasswordResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Change the current user's password.
 * Phase 9: PUT /api/users/me/password
 */
export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<ChangePasswordResult> {
  await delay(500);
  // Mock: simulate wrong current password
  if (data.currentPassword === 'wrong') {
    return { ok: false, error: 'Current password is incorrect.' };
  }
  return { ok: true };
}

// ─── Phase 6: Quiz / Exam UI ──────────────────────────────────────────────────

/**
 * MOCK_CORRECT_ANSWERS is a private server-side lookup table.
 * It maps questionId → correct option index for MCQ questions.
 *
 * This data NEVER appears inside a QuizForStudent object.
 * The submitQuizAttempt function uses it to simulate auto-grading,
 * as if the grading logic ran on the backend server.
 *
 * In Phase 9+, this map is replaced by the Prisma `Question.correctOptionIndex`
 * column, which is only queried inside a server-side API route, never sent to clients.
 */
const MOCK_CORRECT_ANSWERS: Record<string, number> = {
  'q1-1': 1, // Python was created by Guido van Rossum
  'q1-2': 2, // Python lists are mutable
  'q1-3': 0, // def is the keyword for defining a function
  'q2-1': 2, // The DOM stands for Document Object Model
  'q2-2': 0, // CSS stands for Cascading Style Sheets
};

/**
 * MOCK_QUIZZES contains QuizForStudent objects — the client-safe type.
 * Notice: questions have NO `correctOptionIndex` field.
 * This is intentional and enforced by the QuizForStudent type.
 */
const MOCK_QUIZZES: QuizForStudent[] = [
  {
    id: 'quiz-1',
    courseId: 'c1',
    title: 'Python Basics — End of Course Quiz',
    description:
      'Test your understanding of Python fundamentals: syntax, data types, and functions.',
    status: 'open',
    windowStartsAt: null,
    windowEndsAt: null,
    durationMinutes: 30,
    questions: [
      {
        id: 'q1-1',
        quizId: 'quiz-1',
        type: 'mcq',
        order: 1,
        text: 'Who created the Python programming language?',
        options: [
          'Linus Torvalds',
          'Guido van Rossum',
          'Dennis Ritchie',
          'James Gosling',
        ],
        points: 2,
        // NOTE: correctOptionIndex is intentionally absent here.
        // The correct answer (index 1) is stored server-side in MOCK_CORRECT_ANSWERS.
      },
      {
        id: 'q1-2',
        quizId: 'quiz-1',
        type: 'mcq',
        order: 2,
        text: 'Which of the following Python data types is mutable?',
        options: ['String', 'Tuple', 'List', 'Integer'],
        points: 2,
      },
      {
        id: 'q1-3',
        quizId: 'quiz-1',
        type: 'mcq',
        order: 3,
        text: 'Which keyword is used to define a function in Python?',
        options: ['def', 'function', 'fun', 'define'],
        points: 2,
      },
      {
        id: 'q1-4',
        quizId: 'quiz-1',
        type: 'short_answer',
        order: 4,
        text: 'In one or two sentences, explain what a Python list comprehension is and give a simple example.',
        points: 5,
      },
      {
        id: 'q1-5',
        quizId: 'quiz-1',
        type: 'essay',
        order: 5,
        text: 'Compare Python to another programming language you know (e.g., JavaScript, Java, or C++). What are the key advantages and disadvantages of Python in comparison?',
        points: 10,
      },
    ],
    maxScore: 21,
    passingPercent: 60,
    antiCheatEnabled: false,
    createdAt: '2026-06-01T09:00:00Z',
    updatedAt: '2026-06-01T09:00:00Z',
  },
  {
    id: 'quiz-2',
    courseId: 'c2',
    title: 'Web Development Fundamentals Quiz',
    description: 'Covers HTML, CSS, and JavaScript basics.',
    status: 'open',
    windowStartsAt: null,
    windowEndsAt: null,
    durationMinutes: 20,
    questions: [
      {
        id: 'q2-1',
        quizId: 'quiz-2',
        type: 'mcq',
        order: 1,
        text: 'What does DOM stand for in web development?',
        options: [
          'Data Object Model',
          'Document Oriented Markup',
          'Document Object Model',
          'Dynamic Object Management',
        ],
        points: 2,
      },
      {
        id: 'q2-2',
        quizId: 'quiz-2',
        type: 'mcq',
        order: 2,
        text: 'What does CSS stand for?',
        options: [
          'Cascading Style Sheets',
          'Computer Style Syntax',
          'Creative Style Specifications',
          'Cascading Syntax Sheets',
        ],
        points: 2,
      },
      {
        id: 'q2-3',
        quizId: 'quiz-2',
        type: 'short_answer',
        order: 3,
        text: 'What is the difference between `let` and `const` in JavaScript?',
        points: 5,
      },
    ],
    maxScore: 9,
    passingPercent: 60,
    antiCheatEnabled: false,
    createdAt: '2026-06-15T09:00:00Z',
    updatedAt: '2026-06-15T09:00:00Z',
  },
];

/** In-memory store for mock attempts, mutated by submitQuizAttempt */
const MOCK_ATTEMPTS: Attempt[] = [];

/**
 * Get a quiz by ID (client-safe QuizForStudent — no correct answers).
 * Draft quizzes are instructor-side only and never returned to students.
 * Phase 9: GET /api/quizzes/:quizId
 */
export async function getQuizById(quizId: string): Promise<QuizForStudent | null> {
  await delay();
  const quiz = getDb().quizzes.find((q) => q.id === quizId);
  return quiz && quiz.status !== 'draft' ? quiz : null;
}

/**
 * Get all quizzes for a course (client-safe). Drafts are excluded.
 * Phase 9: GET /api/courses/:courseId/quizzes
 */
export async function getQuizzesByCourseId(courseId: string): Promise<QuizForStudent[]> {
  await delay();
  return getDb().quizzes.filter((q) => q.courseId === courseId && q.status !== 'draft');
}

export type SubmitAttemptResult =
  | { ok: true; attempt: Attempt }
  | { ok: false; error: string };

/**
 * Submit a quiz attempt. Simulates server-side grading.
 *
 * IMPORTANT: Grading logic runs HERE (simulating the server), not in the component.
 * The component submits raw answers; the "server" returns a scored Attempt.
 * MCQ questions are auto-graded by comparing against MOCK_CORRECT_ANSWERS.
 * short_answer and essay questions are marked as pending manual review.
 *
 * Phase 9: POST /api/quizzes/:quizId/attempts
 */
export async function submitQuizAttempt(
  quizId: string,
  answers: SubmittedAnswer[]
): Promise<SubmitAttemptResult> {
  await delay(800);

  const db = getDb();
  const quiz = db.quizzes.find((q) => q.id === quizId);
  if (!quiz) return { ok: false, error: 'Quiz not found.' };

  // --- Server-side grading simulation ---
  let autoScore = 0;
  let needsManualReview = false;

  for (const question of quiz.questions) {
    const answer = answers.find((a) => a.questionId === question.id);

    if (question.type === 'mcq') {
      // Prefer the canonical full-quiz store (kept in sync by the Phase 7
      // instructor quiz builder), falling back to the original answer map.
      const correctIndex =
        db.fullQuizzes[quiz.id]?.questions.find((q) => q.id === question.id)
          ?.correctOptionIndex ?? db.correctAnswers[question.id];
      // Only award points if the student answered and the index matches
      if (
        answer !== undefined &&
        typeof answer.value === 'number' &&
        answer.value === correctIndex
      ) {
        autoScore += question.points;
      }
    } else {
      // short_answer / essay: queued for manual review
      if (answer && String(answer.value).trim().length > 0) {
        needsManualReview = true;
      }
    }
  }

  const passed = quiz.maxScore > 0
    ? (autoScore / quiz.maxScore) * 100 >= quiz.passingPercent
    : false;

  const attempt: Attempt = {
    id: `attempt-${Date.now()}`,
    quizId,
    userId: 'u1',
    status: 'graded',
    gradeStatus: needsManualReview ? 'pending' : 'auto_graded',
    startedAt: new Date(Date.now() - 600_000).toISOString(), // 10 min ago (cosmetic)
    submittedAt: new Date().toISOString(),
    answers,
    reviews: [],
    totalScore: autoScore,
    passed,
    certificateId: null,
  };

  db.attempts.push(attempt);
  return { ok: true, attempt };
}

/**
 * Get a specific attempt result by ID.
 * Phase 9: GET /api/attempts/:attemptId
 */
export async function getAttemptResult(attemptId: string): Promise<Attempt | null> {
  await delay();
  return getDb().attempts.find((a) => a.id === attemptId) ?? null;
}

// ─── Phase 7: Instructor Dashboard (UI Only) ──────────────────────────────────
//
// NOTE: Same access-control caveat as Phases 5–6 — the /instructor routes are
// reachable by direct URL with a hardcoded mock instructor user. Real RBAC
// middleware and server-side session auth come in Phase 9.
//
// IMPORTANT — server-only quiz data:
// The quiz-builder functions below (getInstructorQuizzes, getQuizForInstructor,
// saveQuiz, createQuiz) deal with the FULL Quiz type, which INCLUDES
// correctOptionIndex. This is intentional and safe: these functions are only
// ever imported by server components and server actions. The instructor is the
// authorised owner of the quiz — they set the answers. Students continue to
// receive only QuizForStudent (answers stripped) via the Phase 6 functions.
// Never import these functions into a client component.

/** Hardcoded mock instructor user for Phase 7 UI development */
const MOCK_INSTRUCTOR_USER: AuthUser = {
  id: 'i1',
  email: 'sarah.mitchell@example.com',
  name: 'Sarah Mitchell',
  role: 'instructor',
  status: 'active',
};

/** View-model for the instructor course list: course + derived counts. */
export type InstructorCourseSummary = {
  course: Course;
  lessonCount: number;
  quizCount: number;
};

/** Shape of the course info saved by the instructor course editor. */
export type CourseInfoInput = {
  title: string;
  description: string;
  category: string;
  pricePence: number;
  status: CourseStatus;
  tags: string[];
};

/** Shape of a lesson row saved by the instructor curriculum editor. */
export type LessonInput = {
  id: string;
  title: string;
  contentType: ContentType;
  durationSeconds: number;
  isFreePreview: boolean;
};

/** Shape of a question saved by the instructor quiz builder. */
export type QuestionInput = {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctOptionIndex?: number;
  points: number;
};

/** Shape of the quiz saved by the instructor quiz builder. */
export type QuizInput = {
  title: string;
  description?: string;
  status: QuizStatus;
  durationMinutes: number;
  passingPercent: number;
  questions: QuestionInput[];
};

export type SaveResult = { ok: true } | { ok: false; error: string };

/** "hello world" → "hello-world" — regenerated from the title on save */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Rebuild the full server-side Quiz (with correct answers) from a student-safe quiz */
function toFullQuiz(quiz: QuizForStudent): Quiz {
  return {
    ...quiz,
    questions: quiz.questions.map((question) => ({
      ...question,
      correctOptionIndex:
        question.type === 'mcq' ? MOCK_CORRECT_ANSWERS[question.id] : undefined,
    })),
  };
}

/** Strip correct answers from a full Quiz → student-safe QuizForStudent */
function stripAnswers(quiz: Quiz): QuizForStudent {
  return {
    id: quiz.id,
    courseId: quiz.courseId,
    title: quiz.title,
    description: quiz.description,
    status: quiz.status,
    windowStartsAt: quiz.windowStartsAt,
    windowEndsAt: quiz.windowEndsAt,
    durationMinutes: quiz.durationMinutes,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      quizId: q.quizId,
      type: q.type,
      order: q.order,
      text: q.text,
      options: q.options,
      points: q.points,
    })),
    maxScore: quiz.maxScore,
    passingPercent: quiz.passingPercent,
    antiCheatEnabled: quiz.antiCheatEnabled,
    createdAt: quiz.createdAt,
    updatedAt: quiz.updatedAt,
  };
}

/**
 * Canonical full-quiz store (answers included) for the instructor quiz builder.
 * Seeded from the Phase 6 student-safe quizzes; kept in sync with MOCK_QUIZZES
 * by saveQuiz/createQuiz so student-facing views and grading stay consistent.
 */
const MOCK_FULL_QUIZZES: Record<string, Quiz> = Object.fromEntries(
  MOCK_QUIZZES.map((quiz) => [quiz.id, toFullQuiz(quiz)])
);

/**
 * Get the mock instructor's profile.
 * Phase 9: reads from JWT cookie via server-side auth.
 */
export async function getInstructorProfile(): Promise<AuthUser | null> {
  await delay(100);
  return getDb().instructorUser;
}

/**
 * Get all courses owned by the mock instructor, with derived lesson/quiz counts.
 * Phase 10: GET /api/instructor/courses
 */
export async function getInstructorCourses(): Promise<InstructorCourseSummary[]> {
  await delay();
  const db = getDb();
  return db.courses
    .filter((c) => c.instructorId === db.instructorUser.id)
    .map((course) => ({
      course,
      lessonCount: (db.lessons[course.id] ?? []).length,
      quizCount: Object.values(db.fullQuizzes).filter((q) => q.courseId === course.id).length,
    }));
}

/**
 * Get a single course owned by the mock instructor, with its lessons.
 * Phase 10: GET /api/instructor/courses/:id
 */
export async function getInstructorCourseById(courseId: string): Promise<{
  course: Course;
  lessons: Lesson[];
} | null> {
  await delay();
  const db = getDb();
  const course = db.courses.find(
    (c) => c.id === courseId && c.instructorId === db.instructorUser.id
  );
  if (!course) return null;
  return { course, lessons: db.lessons[courseId] ?? [] };
}

/**
 * Get all quizzes belonging to the mock instructor's courses (FULL Quiz type —
 * server-only, includes correct answers).
 * Phase 10: GET /api/instructor/quizzes
 */
export async function getInstructorQuizzes(): Promise<Quiz[]> {
  await delay();
  const db = getDb();
  const courseIds = new Set(
    db.courses
      .filter((c) => c.instructorId === db.instructorUser.id)
      .map((c) => c.id)
  );
  return Object.values(db.fullQuizzes).filter((q) => courseIds.has(q.courseId));
}

/**
 * Get a single quiz for editing (FULL Quiz type — server-only, includes correct
 * answers). Only used by the instructor quiz builder.
 * Phase 10: GET /api/instructor/quizzes/:id
 */
export async function getQuizForInstructor(quizId: string): Promise<Quiz | null> {
  await delay();
  return getDb().fullQuizzes[quizId] ?? null;
}

/**
 * Update a course's basic info (mock persistence).
 * Phase 10: PUT /api/instructor/courses/:id
 */
export async function saveCourseInfo(
  courseId: string,
  data: CourseInfoInput
): Promise<SaveResult> {
  await delay(400);
  const course = getDb().courses.find((c) => c.id === courseId);
  if (!course) return { ok: false, error: 'Course not found.' };

  course.title = data.title.trim();
  course.description = data.description.trim();
  course.category = data.category.trim();
  course.pricePence = Math.max(0, Math.round(data.pricePence));
  course.status = data.status;
  course.tags = data.tags.map((t) => t.trim()).filter(Boolean);
  course.slug = slugify(course.title);
  course.updatedAt = new Date().toISOString();
  return { ok: true };
}

/**
 * Replace a course's full lesson list (mock persistence). Recomputes the
 * derived lessonCount and totalDurationSeconds counters.
 * Phase 10: PUT /api/instructor/courses/:id/lessons
 */
export async function saveLessons(
  courseId: string,
  lessons: LessonInput[]
): Promise<SaveResult> {
  await delay(400);
  const db = getDb();
  const course = db.courses.find((c) => c.id === courseId);
  if (!course) return { ok: false, error: 'Course not found.' };

  const now = new Date().toISOString();
  const ordered: Lesson[] = lessons.map((lesson, index) => ({
    id: lesson.id,
    courseId,
    title: lesson.title.trim(),
    contentType: lesson.contentType,
    order: index + 1,
    durationSeconds: Math.max(0, Math.round(lesson.durationSeconds)),
    isFreePreview: lesson.isFreePreview,
    createdAt: now,
    updatedAt: now,
  }));

  db.lessons[courseId] = ordered;
  course.lessonCount = ordered.length;
  course.totalDurationSeconds = ordered.reduce(
    (sum, l) =>
      sum +
      (l.contentType === 'video' || l.contentType === 'live' ? (l.durationSeconds ?? 0) : 0),
    0
  );
  course.updatedAt = now;
  return { ok: true };
}

/**
 * Create a new draft course owned by the mock instructor.
 * Phase 10: POST /api/instructor/courses
 */
export async function createCourse(): Promise<
  | { ok: true; courseId: string }
  | { ok: false; error: string }
> {
  await delay(300);
  const db = getDb();
  const now = new Date().toISOString();
  const id = `c${Date.now()}`;
  const course: Course = {
    id,
    slug: `course-${id}`, // regenerated from the title on first save
    title: 'Untitled Course',
    description: 'Describe your course for students…',
    instructorId: db.instructorUser.id,
    instructorName: db.instructorUser.name,
    pricePence: 0,
    currency: 'GBP',
    status: 'draft',
    category: 'Programming',
    tags: [],
    totalDurationSeconds: 0,
    lessonCount: 0,
    enrollmentCount: 0,
    averageRating: null,
    createdAt: now,
    updatedAt: now,
  };
  db.courses.push(course);
  return { ok: true, courseId: id };
}

/**
 * Update a quiz from the instructor quiz builder. Persists the FULL Quiz
 * (answers included) into the canonical store and keeps the student-safe
 * MOCK_QUIZZES view in sync. Recomputes maxScore from question points.
 * Phase 10: PUT /api/instructor/quizzes/:id
 */
export async function saveQuiz(
  quizId: string,
  data: QuizInput
): Promise<SaveResult> {
  await delay(400);
  const db = getDb();
  const existing = db.fullQuizzes[quizId];
  if (!existing) return { ok: false, error: 'Quiz not found.' };

  const now = new Date().toISOString();
  const questions: Question[] = data.questions.map((q, index) => ({
    id: q.id,
    quizId,
    type: q.type,
    order: index + 1,
    text: q.text.trim(),
    options: q.type === 'mcq' ? (q.options ?? []).map((o) => o.trim()) : undefined,
    correctOptionIndex: q.type === 'mcq' ? q.correctOptionIndex : undefined,
    points: Math.max(0, Math.round(q.points)),
  }));

  const updated: Quiz = {
    ...existing,
    title: data.title.trim(),
    description: data.description?.trim() || undefined,
    status: data.status,
    durationMinutes: Math.max(1, Math.round(data.durationMinutes)),
    passingPercent: Math.min(100, Math.max(1, Math.round(data.passingPercent))),
    questions,
    maxScore: questions.reduce((sum, q) => sum + q.points, 0),
    updatedAt: now,
  };

  db.fullQuizzes[quizId] = updated;
  const studentIndex = db.quizzes.findIndex((q) => q.id === quizId);
  if (studentIndex >= 0) {
    db.quizzes[studentIndex] = stripAnswers(updated);
  }
  return { ok: true };
}

// ─── Single Shared Mock Store ─────────────────────────────────────────────────
//
// IMPORTANT ARCHITECTURAL DECISION (see docs/Memory.md):
// In `next dev` (Turbopack) each route/server-action entry is compiled with its
// own copy of this module, so plain module-level `const MOCK_*` arrays are NOT
// shared across routes — a lesson added in the course editor would be invisible
// to the instructor overview or the student course player (dev-only symptom;
// production bundles everything into one process).
//
// To give the mock a genuine single source of truth we hold the live store on
// `globalThis` instead: every entry in the same Node process reads and mutates
// the SAME object, exactly like a shared database. The MOCK_* constants below
// act as the seed written on first access. State survives hot reloads and is
// reset only when the dev server restarts (like reseeding a DB).
// Phase 9+ replaces this whole store with Prisma/PostgreSQL.

/** Shape of the live mock database held on globalThis */
type MockDb = {
  courses: Course[];
  lessons: Record<string, Lesson[]>;
  quizzes: QuizForStudent[];
  fullQuizzes: Record<string, Quiz>;
  correctAnswers: Record<string, number>;
  enrollments: Enrollment[];
  lessonProgress: LessonProgress[];
  payments: PaymentSummary[];
  attempts: Attempt[];
  currentUser: AuthUser;
  instructorUser: AuthUser;
};

/** Accessor for the one shared mutable store — seed on first use */
function getDb(): MockDb {
  const g = globalThis as unknown as { __MOCK_DB__?: MockDb };
  if (!g.__MOCK_DB__) {
    g.__MOCK_DB__ = {
      courses: MOCK_COURSES,
      lessons: MOCK_LESSONS,
      quizzes: MOCK_QUIZZES,
      fullQuizzes: MOCK_FULL_QUIZZES,
      correctAnswers: MOCK_CORRECT_ANSWERS,
      enrollments: MOCK_ENROLLMENTS,
      lessonProgress: MOCK_LESSON_PROGRESS,
      payments: MOCK_PAYMENTS,
      attempts: MOCK_ATTEMPTS,
      currentUser: MOCK_CURRENT_USER,
      instructorUser: MOCK_INSTRUCTOR_USER,
    };
  }
  return g.__MOCK_DB__;
}

/**
 * Create a new draft quiz for a course owned by the mock instructor.
 * Phase 10: POST /api/instructor/quizzes
 */
export async function createQuiz(courseId: string): Promise<
  | { ok: true; quizId: string }
  | { ok: false; error: string }
> {
  await delay(300);
  const db = getDb();
  const course = db.courses.find((c) => c.id === courseId);
  if (!course) return { ok: false, error: 'Course not found.' };

  const now = new Date().toISOString();
  const quizId = `quiz-${Date.now()}`;
  const quiz: Quiz = {
    id: quizId,
    courseId,
    title: 'New Quiz',
    status: 'draft',
    windowStartsAt: null,
    windowEndsAt: null,
    durationMinutes: 30,
    questions: [
      {
        id: `q-${quizId}-1`,
        quizId,
        type: 'mcq',
        order: 1,
        text: 'Your first question',
        options: ['Option A', 'Option B'],
        correctOptionIndex: 0,
        points: 1,
      },
    ],
    maxScore: 1,
    passingPercent: 60,
    antiCheatEnabled: false,
    createdAt: now,
    updatedAt: now,
  };
  db.fullQuizzes[quizId] = quiz;
  db.quizzes.push(stripAnswers(quiz));
  return { ok: true, quizId };
}

