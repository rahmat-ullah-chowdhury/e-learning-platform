# Phases.md — Build Phases

Each phase should be completed, tested in-browser, and committed to git before moving to the next. Do not start a phase before the previous one is functionally complete.

---

## Phase 0 — Environment & Scaffold
- Next.js 14 project created (TypeScript, Tailwind, App Router, ESLint)
- Git repo initialized, first commit made
- Core dependencies installed (TanStack Query, Zod, lucide-react, next-intl)
- Folder structure created per Architecture.md
**Done when:** `npm run dev` shows the default Next.js page with no errors.

## Phase 1 — Types & Design Foundation
- Full `types/` directory written (User, Course, Lesson, Enrollment, Quiz, Question, Attempt, Payment)
- `tokens.css` created per Design.md
- `messages/en.json` scaffolded for i18n
**Done when:** types compile with no TS errors; a test page can import and render tokens correctly.

## Phase 2 — Shared Layout
- Navbar (logged-out variant only for now)
- Footer
- Base page container/grid system
**Done when:** layout renders consistently across at least two placeholder pages.

## Phase 3 — Public Pages
- Home page
- Course listing page (with mock data from `lib/api.ts`)
- Course detail page
- `CourseCard` component (free/paid variants)
**Done when:** a user can browse from home → listing → detail using only mock data.

## Phase 4 — Auth UI (Frontend Only)
- Login, Signup, Forgot Password, Reset Password pages
- Zod validation on all forms
- No real backend auth yet — forms submit to mock functions in `lib/api.ts`
**Done when:** all forms validate correctly and show appropriate error states.

## Phase 5 — Student Dashboard & Course Player
- Dashboard page (enrolled courses, progress)
- Course player page (branches by `contentType`: video/pdf/live/download)
- Mark-complete + progress tracking (mocked)
**Done when:** a mock-enrolled student can navigate through a full mock course.

## Phase 6 — Quiz/Exam UI
- Quiz start, attempt, and result pages
- `QuestionRenderer` (mcq/short_answer/essay)
- `QuizTimer` (cosmetic countdown, with a code comment noting server authority is added in Phase 10)
**Done when:** a full mock quiz can be started, answered, and submitted, showing a result screen.

## Phase 7 — Instructor Dashboard (UI Only)
- Instructor overview, course list, course editor, quiz builder
**Done when:** an instructor can build a full mock course + quiz through the UI (still writing to mock data).

## Phase 8 — Admin Dashboard (UI Only)
- Admin overview with charts
- Course/user/payment management tables (`DataTable`)
- Audit log (read-only)
- Settings page (branding placeholder)
**Done when:** admin can view and interact with all mock data tables.

---

## Phase 9 — Backend Foundation
- PostgreSQL + Prisma schema (matches `types/` exactly)
- Auth system: registration, login, JWT access/refresh, RBAC middleware
- Replace mock auth in Phase 4 pages with real calls
**Done when:** a real user can register, log in, and stay authenticated across a refresh.

## Phase 10 — Courses & Enrollment API
- Course/lesson CRUD APIs
- Enrollment logic (free instant, paid via Stripe)
- Swap `lib/api.ts` course/enrollment functions from mock to real
**Done when:** a real course can be created by an instructor and enrolled in by a student.

## Phase 11 — Payments
- Stripe checkout integration
- Webhook handling (signature-verified)
- Payment history real data
**Done when:** a real (test-mode) Stripe payment completes and unlocks a paid course.

## Phase 12 — Exam Engine (Server-Authoritative)
- Server-enforced exam windows
- Auto-save answers
- Auto-grading for MCQ, manual review queue for short answer/essay
- Certificate generation on pass
**Done when:** a real exam can be taken, timed server-side, graded, and a certificate issued.

## Phase 13 — Admin Actions & Audit Logging
- Real role promotion, ban/suspend, refunds
- Every sensitive action written to audit log table
**Done when:** all admin actions are functional and logged with actor + timestamp.

## Phase 14 — Hardening & Launch
- Full pass against Security & Auth checklist (Rules.md + Architecture.md)
- Performance: indexes, Redis caching, ISR, Lighthouse pass
- Backups configured + tested restore
- Sentry + uptime monitoring live
- Legal pages finalized
- Load testing on checkout + exam submission
**Done when:** every item on the security checklist is checked, and the platform survives a basic load test.

---

## How to Use This File With Memory.md
At the end of each work session, update `Memory.md` with: which phase you're in, what was completed, what's in progress, and any decisions made that deviate from these documents. Start every new session by reading `Memory.md` first.
