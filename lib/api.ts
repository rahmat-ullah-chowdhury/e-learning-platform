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

import type { Course, CourseListItem } from '@/types';
import type { Lesson } from '@/types';

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
  let courses = MOCK_COURSES.filter((c) => c.status === 'published');

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
  return MOCK_COURSES.find((c) => c.slug === slug && c.status === 'published') ?? null;
}

/**
 * Get lessons for a course (for detail page curriculum section).
 * Phase 9: replace with GET /api/courses/:id/lessons
 */
export async function getLessonsByCourseId(courseId: string): Promise<Lesson[]> {
  await delay();
  return MOCK_LESSONS[courseId] ?? [];
}

/**
 * Get featured courses for the home page (top-rated published courses).
 * Phase 9: replace with GET /api/courses?featured=true
 */
export async function getFeaturedCourses(): Promise<CourseListItem[]> {
  await delay();
  return MOCK_COURSES
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
  const cats = new Set(MOCK_COURSES.filter((c) => c.status === 'published').map((c) => c.category));
  return Array.from(cats).sort();
}
