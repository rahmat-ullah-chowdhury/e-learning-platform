# Memory.md — Living Progress Log

> This file does not get created "cold" — start filling it in from the end of your very first coding session, and update it at the end of every session after that. At the start of each new chat/session, paste this file in first so the AI has context without re-reading the whole codebase.

---

## Current Phase
Phase 8 — Admin Dashboard (UI Only)

## Completed
- Phase 0 — Environment & Scaffold: Next.js 14 project scaffolded (TypeScript, Tailwind, App Router, ESLint)
- Git repository initialized, first commits made
- `docs/` folder added with PRD.md, Architecture.md, Rules.md, Phases.md, Design.md, Memory.md, api-keys-and-signups.md
- Folder structure created: `lib/`, `types/`, `styles/`, `messages/`
- Placeholder files created: `lib/api.ts`, `styles/tokens.css`, `messages/en.json`
- Core dependencies installed: `@tanstack/react-query`, `lucide-react`, `zod`
- Verified `npm run dev` runs successfully, default Next.js page loads at localhost:3000
- **Phase 1 — Types & Design Foundation** ✅
  - `types/user.ts` — User, AuthUser, JwtPayload types (roles: student/instructor/admin/super_admin)
  - `types/course.ts` — Course, CourseListItem types (prices in pence GBP; coupon/subscription hooks present but inactive)
  - `types/lesson.ts` — Lesson, LessonProgress types (all content types: video/pdf/live/download)
  - `types/enrollment.ts` — Enrollment type with status and progressPercent
  - `types/quiz.ts` — Quiz, Question, Attempt types; QuizForStudent (answers stripped from client-safe type)
  - `types/attempt.ts` — Attempt, SubmittedAnswer, AnswerReview types (server-authoritative timestamps)
  - `types/payment.ts` — Payment, PaymentSummary types (pence integers, Stripe ID references)
  - `types/index.ts` — Barrel export for all types
  - `styles/tokens.css` — All CSS variables per Design.md (colors, spacing, radius, shadow, dark-mode hook)
  - `messages/en.json` — Full i18n scaffold (nav, home, course, auth, dashboard, exam, instructor, admin, common)
  - `app/globals.css` — Updated to import tailwindcss + tokens.css, base body styles using Inter
  - `app/layout.tsx` — Updated to use Inter (next/font/google), --font-inter CSS variable, updated metadata
  - `npx tsc --noEmit` passes with zero errors
  - `npm run dev` confirmed: GET / 200, no application errors
- **Phase 2 — Shared Layout** ✅
  - `components/Navbar.tsx` — Logged-out variant with design tokens, responsive hamburger menu.
  - `components/Footer.tsx` — Minimal footer with platform brand, company, legal links.
  - `components/PageContainer.tsx` — Max-width wrapper primitive with narrow option.
  - `app/(public)/layout.tsx` — Public route group layout providing sticky footer structure.
  - `app/(public)/page.tsx` — Home page placeholder verifying layout.
  - `app/(public)/courses/page.tsx` — Courses placeholder with mock grid verifying layout.
  - Removed default `app/page.tsx` scaffold.
  - Layout successfully verified visually across pages and mobile viewport.
- **Phase 3 — Public Pages** ✅
  - `lib/api.ts` — Mock API layer: getCourses, getCourseBySlug, getLessonsByCourseId, getFeaturedCourses, getCategories, formatPrice, formatDuration. 8 realistic mock courses with category/rating/price data.
  - `components/CourseCard.tsx` — Free/paid/enrolled/completed variants. Design.md card styling (shadow-card, radius-md, hover lift). FREE badge overlay, star rating, price via formatPrice.
  - `app/(public)/page.tsx` — Full home page: dark navy hero with gradient, CTA buttons, stat cards, category pills, top-rated course grid, free courses banner.
  - `app/(public)/courses/page.tsx` — Course listing with category filter pills, 8-course grid, empty states. searchParams awaited per Next.js 16.
  - `app/(public)/courses/[slug]/page.tsx` — Course detail: dark hero, enrol card (free/paid CTA), What you'll learn, curriculum with preview/locked lesson rows. params awaited per Next.js 16. notFound() on bad slug.
  - Zero TS errors. All 3 pages browser-verified: no console errors.
- **Phase 4 — Auth UI (Frontend Only)** ✅
  - `lib/api.ts` — Added login(), signup(), forgotPassword(), resetPassword() mock functions + AuthResult/ForgotPasswordResult/ResetPasswordResult types. Per Rules.md: generic auth error messages only.
  - `components/FormField.tsx` — Reusable label+input+error unit. aria-invalid, aria-describedby, disabled state. Error text directly under field in --color-error per Design.md.
  - `components/LoginForm.tsx` — Email + password, Zod validation, loading spinner, generic global error for auth failures.
  - `components/SignupForm.tsx` — Name + email + password (strength rules) + confirmPassword (cross-field match), Zod, loading state.
  - `components/ForgotPasswordForm.tsx` — Email only; on success shows "Check your email" confirmation (always, prevents user enumeration). 
  - `components/ResetPasswordForm.tsx` — Password + confirm; expired token shows inline error with link to /forgot-password; on success auto-redirects to /login.
  - `app/(public)/login/page.tsx`, `signup/page.tsx`, `forgot-password/page.tsx`, `reset-password/[token]/page.tsx` — Server component shells with metadata wrapping client forms.
  - `app/globals.css` — Added @keyframes spin + input:focus-visible ring.
  - All 4 pages browser-verified: zero console errors, all field validations confirmed working.
- **Phase 5 — Student Dashboard & Course Player (Frontend Only)** ✅
  - `lib/api.ts` — Added mock data (MOCK_CURRENT_USER, MOCK_ENROLLMENTS, MOCK_LESSON_PROGRESS, MOCK_PAYMENTS) and functions. Added view-model type `EnrolledCourse`.
  - `components/ProgressBar.tsx` — Reusable progress bar using tokens.
  - `components/StatusBadge.tsx` — Status indicator reusing --color-warning for pending and refunded.
  - `components/EnrolledCourseCard.tsx` — Course card with progress and CTA.
  - `components/DashboardSidebar.tsx` — Sidebar navigation (desktop fixed, mobile bottom tabs).
  - `app/(student)/layout.tsx` — Student dashboard shell without public Navbar/Footer.
  - `app/(student)/dashboard/page.tsx` — Overview with stats, continue learning, and enrolled courses.
  - `app/(student)/dashboard/courses/page.tsx` — My Courses with filter tabs (searchParams awaited).
  - `app/(student)/dashboard/certificates/page.tsx` — Certificates placeholder (download disabled).
  - `app/(student)/dashboard/payments/page.tsx` — Payment history table (desktop) and cards (mobile).
  - `app/(student)/dashboard/settings/page.tsx` — Settings page wrapping `SettingsProfileForm` and `SettingsPasswordForm` (Zod validation).
  - `components/CourseSidebar.tsx` — Collapsible curriculum sidebar for the player.
  - `components/LessonPlayer.tsx` — Renders video/pdf/live/download placeholders and handles "Mark Complete".
  - `app/(student)/learn/[courseSlug]/page.tsx` — Course overview in player.
  - `app/(student)/learn/[courseSlug]/[lessonId]/page.tsx` — Individual lesson view with Prev/Next navigation.
  - TypeScript clean, browser-verified including mobile responsive behavior.
- **Phase 6 — Quiz/Exam UI (Frontend Only)** ✅
  - `lib/api.ts` — Added `MOCK_QUIZZES` (2 quizzes with MCQ, short_answer, and essay questions), `MOCK_CORRECT_ANSWERS` (private server-side lookup, never in QuizForStudent), `MOCK_ATTEMPTS`. Added `getQuizById`, `getQuizzesByCourseId`, `submitQuizAttempt` (simulates server-side auto-grading for MCQ), `getAttemptResult`.
  - `components/QuizTimer.tsx` — Cosmetic countdown client component. Contains explicit comment block stating Phase 12 adds server authority. Warning/error colour ramp per Design.md exam UI guidance (muted until final 5 min).
  - `components/QuestionRenderer.tsx` — Polymorphic question input. MCQ renders radio button group; short_answer renders input; essay renders textarea. Receives `QuizForStudent` question only (no `correctOptionIndex`).
  - `app/(student)/exam/[quizId]/start/page.tsx` — Quiz start page with metadata, question breakdown, and Begin Quiz CTA. Server component, params awaited.
  - `app/(student)/exam/[quizId]/attempt/page.tsx` — Active quiz UI. Client component fetching `QuizForStudent`, rendering all `QuestionRenderer`s + `QuizTimer`, and calling `submitQuizAttempt` on submit. Redirects to result page on success.
  - `app/(student)/exam/[quizId]/result/[attemptId]/page.tsx` — Result page showing pass/fail, MCQ auto-score, pending manual review notice, and submitted answers summary. Does NOT reveal correct MCQ answers. Server component.
  - `app/(student)/learn/[courseSlug]/page.tsx` — Added Quizzes section listing course quizzes with Take Quiz links.
  - TypeScript clean (`npx tsc --noEmit` zero errors). Full quiz flow browser-verified: start → attempt (all 3 question types) → submit → result.
- **Phase 7 — Instructor Dashboard (UI Only)** ✅
  - `lib/api.ts` — Added mock instructor (Sarah Mitchell, i1) + `MOCK_FULL_QUIZZES` canonical full-quiz store (answers included, seeded from Phase 6 quizzes). New functions: `getInstructorProfile`, `getInstructorCourses` (view-model with lesson/quiz counts), `getInstructorCourseById`, `getInstructorQuizzes`, `getQuizForInstructor`, `saveCourseInfo`, `saveLessons` (recomputes lessonCount/totalDurationSeconds), `createCourse`, `saveQuiz` (recomputes maxScore, keeps student-safe MOCK_QUIZZES in sync), `createQuiz`. `submitQuizAttempt` grading now prefers the canonical store (fallback to `MOCK_CORRECT_ANSWERS`). Draft quizzes excluded from student-facing `getQuizById`/`getQuizzesByCourseId`.
  - `lib/validation.ts` (new) — Shared Zod schemas (courseInfo/lesson/quizInput) used by BOTH client forms and server actions (Rules.md §2 both-sides validation), client-safe module.
  - `components/StatusBadge.tsx` — Extended with course/quiz variants (draft/published/archived/scheduled/open/closed) — draft/closed muted, published/open success, scheduled info, archived warning. No ad hoc colors.
  - `components/InstructorSidebar.tsx` — Instructor nav (Overview, My Courses), desktop fixed + mobile bottom tabs, mirroring DashboardSidebar (JS hover handlers since inline styles beat Tailwind hover classes).
  - `app/(instructor)/layout.tsx` — Instructor shell without public Navbar/Footer.
  - `app/(instructor)/instructor/page.tsx` — Overview with 4 stat cards (courses, students, quizzes, est. revenue), quick actions, recent courses list.
  - `app/(instructor)/instructor/courses/page.tsx` — My Courses with status filter tabs (All/Drafts/Published/Archived via searchParams) + New Course form action.
  - `app/(instructor)/instructor/courses/[id]/edit/page.tsx` — Course editor: `CourseInfoForm` (title/description/category/price in £→pence/status/tags, datalist categories), `LessonEditor` (add/remove/reorder rows, minutes→seconds conversion, free-preview toggle), Quizzes section with per-quiz Build links + Create Quiz action.
  - `app/(instructor)/instructor/quizzes/[id]/edit/page.tsx` — Quiz builder page (server component fetching FULL Quiz) wrapping `QuizBuilderForm`: metadata + question editor (mcq with correct-answer radios, short_answer, essay), points, live maxScore.
  - Server actions (co-located, Phase 6 pattern): `createCourseAction` (redirect to editor), `saveCourseInfoAction`/`saveLessonsAction` (Zod re-validate), `createQuizAction` (redirect to builder), `saveQuizAction` (Zod re-validate).
  - `components/InstructorCourseCard.tsx` — Instructor card (status badge, students/lessons/quizzes, rating, price, Edit) with working shadow-hover via classes (EnrolledCourseCard pattern).
  - Verified: `npx tsc --noEmit` zero errors, eslint clean on new files, `next build` passes with all 4 instructor routes, all pages browser-verified zero console errors, quiz builder shows correct-answer radios.

## In Progress
- Nothing — Phase 7 complete; Phase 8 ready to start

## Decisions Made That Aren't in the Other Docs Yet
- Confirmed the "Blocked/Waiting On" client questions below do NOT block Phases 1–8 (all frontend UI work) — they only become relevant at their specific later phase (languages → messages/ later, scale → Phase 9 infra, timeline/budget → project mgmt only, integrations → whenever specific integration is built, admin permission granularity → Phase 13). Safe to proceed through all frontend phases without these answers.
- npm reported 3 high severity vulnerabilities during Phase 0 scaffold (likely dev-only tooling, e.g. eslint-related packages). Decision: do NOT run `npm audit fix --force` now — risks breaking the fresh scaffold by force-upgrading packages Next.js expects specific versions of. Deferred to Phase 14 (Hardening & Launch) for a proper audit pass.
- **The installed Next.js version is 16.2.12, not 14 as written in Architecture.md.** The AGENTS.md rule says to read `node_modules/next/dist/docs/` and heed deprecation notices. Key breaking changes from v14→v16 to follow:
  - `params` and `searchParams` in page/layout components are now **Promises** and must be `await`ed
  - `PageProps` and `LayoutProps` are globally available helpers (no import needed) — use them for typed page components
  - Tailwind v4 is installed (not v3): uses `@import 'tailwindcss'` in CSS (not `@tailwind base/components/utilities`); uses `@theme` block in CSS for design tokens; no `tailwind.config.js` needed for basic usage
- **Price stored in pence (integer GBP)** to avoid floating-point issues. Display layer converts (e.g. `£` + `(pricePence / 100).toFixed(2)`).
- **`QuizForStudent` type** strips `correctOptionIndex` from Question — this is the type to ALWAYS use when sending quiz data to clients. The full `Quiz` type with answers is server-only.
- **i18n approach**: `next-intl` is installed but not yet wired up (middleware, routing). Will be configured when needed. For Phases 2–8 (UI work), use plain English strings directly in components — swap to `useTranslations()` when wiring i18n properly.
- **Phase 5 Auth/Access**: `/dashboard` and `/learn/*` routes have no real access control yet; they are reachable directly with a hardcoded mock user for UI building. Real middleware comes in Phase 9.
- **EnrolledCourse Type**: Defined in `lib/api.ts` rather than `types/` as it's a view-model joining enrollment and course data for display, not a core data type.
- **StatusBadge Colors**: Reuses `--color-warning` for both `pending` and `refunded` states. No ad hoc colors were added outside the `Design.md` token system.
- **Server Components & Styling**: Resolved a Phase 5 Next.js error by substituting JS event handlers (`onMouseEnter`/`onMouseLeave` in `EnrolledCourseCard` and `dashboard/page.tsx`) with pure Tailwind CSS `hover:` modifiers, establishing a convention to keep UI cards as Server Components.
- **QuizForStudent type enforcement**: `MOCK_QUIZZES` is typed as `QuizForStudent[]` — TypeScript enforces that `correctOptionIndex` cannot appear in any question. Correct answers live solely in `MOCK_CORRECT_ANSWERS`, a private constant inside `lib/api.ts`. The `submitQuizAttempt` function performs grading inside the mock API (server simulation); the component only submits raw `SubmittedAnswer` objects and receives a scored `Attempt` back.
- **QuizTimer cosmetic-only (Phase 6)**: Timer is client-side countdown only. Phase 12 will add server-side window enforcement (`startedAt + durationMinutes` checked server-side, force-submission on expiry).
- **MCQ correct answers not revealed on result page**: The result page shows submitted answers but not correct ones. A review API (comparing submission to correct answers) is deferred to Phase 12.
- **Attempt page as Client Component**: Attempt page is `'use client'` because it needs `useEffect`/`useState` for answer tracking and the `QuizTimer`. Start and result pages remain Server Components.
- **Mock Quiz Submission Fix (Bug 1)**: The attempt page uses a Server Action (`submitAttemptAction`) to submit answers. This ensures the in-memory `MOCK_ATTEMPTS` array is updated on the server side so the subsequent Server Component result page can find the newly created attempt.
- **QuizTimer Refresh Persistence (Bug 2)**: Added `sessionStorage` to `QuizTimer` to persist the start time across browser refreshes. This is a temporary client-side mechanism; real server-enforced timing will replace this in Phase 12.
- **Phase 7 mock instructor**: The instructor dashboard uses a hardcoded mock instructor (Sarah Mitchell, id i1) matching existing mock course instructorIds — `getInstructorProfile()` mirrors `getCurrentUser()`. Real RBAC comes in Phase 9.
- **Quiz builder handles the FULL Quiz type (correct answers included)**: `getInstructorQuizzes`/`getQuizForInstructor`/`saveQuiz`/`createQuiz` are server-only — only imported by server components and server actions. The instructor is the authorised quiz owner (they set the answers); students still receive only `QuizForStudent` via the Phase 6 functions. Comment blocks in lib/api.ts warn against importing these into client components.
- **Canonical full-quiz store (`MOCK_FULL_QUIZZES`)**: Seeded from Phase 6 student-safe quizzes (answers re-joined from `MOCK_CORRECT_ANSWERS`). `saveQuiz`/`createQuiz` keep the student-safe `MOCK_QUIZZES` array in sync (answers stripped), and `submitQuizAttempt` grading prefers the canonical store so instructor-edited answers grade correctly.
- **Draft quizzes are never student-visible**: `getQuizById`/`getQuizzesByCourseId` filter out `status === 'draft'` — a quiz stays hidden from students until the instructor opens/schedules/publishes it.
- **Shared Zod schemas in `lib/validation.ts`**: Course/lesson/quiz editor schemas live in a new client-safe module imported by both client form components (inline field errors) and server actions (re-validation before persisting). Satisfies Rules.md §2 without schema duplication.
- **Instructor editors are Server Components + client forms + server actions**: same pattern as Phase 6 attempt submit. Pages fetch via server-only API functions; forms persist via co-located server actions, then `router.refresh()` re-fetches server data.
- **Slug regenerated from title on save**: mock behavior — renaming a published course changes its public/enrolled URLs. Acceptable for mock; Phase 10 real API will decouple slug from title.
- **Durations entered in minutes in editors, stored in seconds**: `LessonEditor` and `QuizBuilderForm` take minute inputs and convert to the canonical seconds/minutes units on submit.
- **InstructorSidebar hover uses JS handlers**: inline `backgroundColor` styles beat Tailwind hover classes, so the sidebar mirrors DashboardSidebar's `onMouseEnter`/`onMouseLeave` approach (it's a client component anyway). Card hover shadows use class-only styling (EnrolledCourseCard pattern) where inline shadows would block them.

## Known Issues / Tech Debt
- 3 high severity npm vulnerabilities present since Phase 0 scaffold — intentionally unaddressed until Phase 14, not forgotten.
- `next-intl` is installed but not configured (middleware/routing). i18n wiring deferred; components use plain strings for now.
- CourseCard thumbnails use coloured placeholder divs with category initials — real thumbnails will come via Cloudflare R2/S3 in Phase 10.
- Course detail `getWhatYouLearnPoints()` returns generic per-category outcomes — real `whatYouLearn[]` field should be added to the `Course` type and mock data. (Still pending — the Phase 7 course editor edits existing fields only; a `whatYouLearn[]` editor is a natural Phase 7.5/8 addition.)
- **Server-only quiz data still co-located in `lib/api.ts`**: the client attempt page imports `getQuizById` from lib/api.ts, which bundles the whole module (now including `MOCK_FULL_QUIZZES` with correct answers) into the client graph in dev. Pre-existing since Phase 6 (`MOCK_CORRECT_ANSWERS` had the same issue); Phase 7 amplified it. Phase 9 restructure should split server-only quiz data + grading into a separate server-only module.

## Blocked / Waiting On
- Client answers still pending (not currently blocking any active phase): number of languages needed, exact scale/growth targets, timeline and budget, existing system integrations, admin role permission granularity (see PRD.md / original metadata doc)

## Next Steps
- Start Phase 8 — Admin Dashboard (UI Only):
  1. Create `app/(admin)/` route group with its own layout (separate from instructor/student/public).
  2. Build Admin overview page with charts (Recharts is already in the approved dependency list but NOT yet installed — ask before adding it).
  3. Build course/user/payment management tables (DataTable component pattern), audit log (read-only), and settings page (branding placeholder).
  4. Done when: admin can view and interact with all mock data tables.

---

### Template for each session's log entry (append below, most recent on top)

```
## Session — [date]
**Phase:** 
**Completed this session:** 
**Files touched:** 
**Decisions made:** 
**Next step:** 
```

## Session — Aug 5, 2026 (Phase 7)
**Phase:** Phase 7 complete, Phase 8 ready
**Completed this session:** Instructor Dashboard (UI Only). Added mock instructor (Sarah Mitchell, i1) + canonical full-quiz store (MOCK_FULL_QUIZZES) + 10 new API functions to lib/api.ts; created lib/validation.ts (shared Zod schemas), InstructorSidebar, InstructorCourseCard, CourseInfoForm, LessonEditor, QuizBuilderForm, and the (instructor) route group: layout, overview, course list with status tabs + New Course action, course editor (details + curriculum + quizzes section), quiz builder with correct-answer radios. Draft quizzes hidden from students; grading prefers the canonical store. TypeScript clean, eslint clean, next build passes, all pages browser-verified with zero console errors.
**Files touched:** lib/api.ts, lib/validation.ts, components/StatusBadge.tsx, components/InstructorSidebar.tsx, components/InstructorCourseCard.tsx, components/CourseInfoForm.tsx, components/LessonEditor.tsx, components/QuizBuilderForm.tsx, app/(instructor)/layout.tsx, app/(instructor)/instructor/page.tsx, app/(instructor)/instructor/courses/page.tsx, app/(instructor)/instructor/courses/actions.ts, app/(instructor)/instructor/courses/[id]/edit/page.tsx, app/(instructor)/instructor/courses/[id]/edit/actions.ts, app/(instructor)/instructor/quizzes/[id]/edit/page.tsx, app/(instructor)/instructor/quizzes/[id]/edit/actions.ts, docs/Memory.md
**Decisions made:** Quiz builder is a server-only surface handling the FULL Quiz type — instructors are authorised owners of answers; students keep getting QuizForStudent only. Server actions + shared Zod schemas for both-sides validation. Mock instructor reuses existing i1 course ownership. Durations entered in minutes, stored in seconds. Slug regenerated from title (mock). Draft quizzes never student-visible.
**Next step:** Begin Phase 8 — Admin Dashboard (UI Only).

## Session — Aug 3, 2026 (Phase 6)
**Phase:** Phase 6 complete, Phase 7 ready
**Completed this session:** Quiz/Exam UI (Frontend Only). Added mock quiz data (QuizForStudent typed — no correctOptionIndex), private MOCK_CORRECT_ANSWERS map, and submitQuizAttempt auto-grading simulation to lib/api.ts. Built QuizTimer (cosmetic, Phase 12 comment included), QuestionRenderer (mcq/short_answer/essay). Built quiz start, attempt, and result pages. Linked quizzes into course overview page. TypeScript clean.
**Files touched:** lib/api.ts, components/QuizTimer.tsx, components/QuestionRenderer.tsx, app/(student)/exam/[quizId]/start/page.tsx, app/(student)/exam/[quizId]/attempt/page.tsx, app/(student)/exam/[quizId]/result/[attemptId]/page.tsx, app/(student)/learn/[courseSlug]/page.tsx
**Decisions made:** QuizForStudent enforced by TypeScript — correct answers never reach the client. Grading simulated server-side in submitQuizAttempt. Timer is cosmetic only. Result page withholds correct answers (Phase 12 review API). Attempt page is a Client Component; start/result are Server Components.
**Next step:** Begin Phase 7 — Instructor Dashboard (UI Only).

## Session — Aug 3, 2026 (Phase 5)
**Phase:** Phase 5 complete, Phase 6 ready
**Completed this session:** Student Dashboard & Course Player (Frontend Only). Added mock data and API methods to `lib/api.ts`. Built student layout with `DashboardSidebar`. Created 5 dashboard pages: overview, My Courses, Certificates, Payments, Settings. Built Course Player with `CourseSidebar`, `LessonPlayer` branching by content type, and course overview page. Verified mobile responsiveness and TypeScript.
**Files touched:** lib/api.ts, app/(student)/*, components/DashboardSidebar.tsx, components/EnrolledCourseCard.tsx, components/ProgressBar.tsx, components/SettingsPasswordForm.tsx, components/SettingsProfileForm.tsx, components/StatusBadge.tsx, components/CourseSidebar.tsx, components/LessonPlayer.tsx
**Decisions made:** `/dashboard` and `/learn/*` routes have no access control yet; `EnrolledCourse` type placed in `api.ts` as a view-model; `StatusBadge` reuses `--color-warning` for pending/refunded to strictly follow Design.md tokens.
**Next step:** Begin Phase 6 — Quiz/Exam UI.

## Session — Aug 1, 2026 (Phase 4)
**Phase:** Phase 4 complete, Phase 5 ready
**Completed this session:** 4 mock auth functions in lib/api.ts (login, signup, forgotPassword, resetPassword); FormField reusable component; LoginForm, SignupForm, ForgotPasswordForm, ResetPasswordForm client components; 4 page shells (login, signup, forgot-password, reset-password/[token]); @keyframes spin + input focus style in globals.css. All 4 pages browser-verified with zero console errors and all field validations confirmed working.
**Files touched:** lib/api.ts, components/FormField.tsx, components/LoginForm.tsx, components/SignupForm.tsx, components/ForgotPasswordForm.tsx, components/ResetPasswordForm.tsx, app/(public)/login/page.tsx, app/(public)/signup/page.tsx, app/(public)/forgot-password/page.tsx, app/(public)/reset-password/[token]/page.tsx, app/globals.css
**Decisions made:** Server component page shells wrap 'use client' form components — keeps metadata (title/description) available while forms are interactive. forgotPassword always returns ok:true to prevent user enumeration. Generic auth error messages only per Rules.md.
**Next step:** Begin Phase 5 — Student Dashboard (sidebar layout, enrolled courses, settings).

## Session — Aug 1, 2026 (Phase 3)
**Phase:** Phase 3 complete, Phase 4 ready
**Completed this session:** lib/api.ts mock layer (8 courses, formatPrice, formatDuration, getCourses/getCourseBySlug/getLessonsByCourseId/getFeaturedCourses/getCategories); CourseCard component (free/paid/enrolled/completed variants); full home page (hero, categories, featured grid, banner); course listing page (category filters, grid, empty states); course detail page (hero, enrol card, curriculum, what you'll learn). Zero TS errors. All 3 pages browser-verified with no console errors.
**Files touched:** lib/api.ts, components/CourseCard.tsx, app/(public)/page.tsx, app/(public)/courses/page.tsx, app/(public)/courses/[slug]/page.tsx
**Decisions made:** formatPrice/formatDuration helpers live in lib/api.ts as they're tightly coupled to the data layer. CourseCard thumbnails use coloured placeholders for now. getWhatYouLearnPoints() is a temporary hardcoded helper — will be replaced with real course data field in Phase 7.
**Next step:** Begin Phase 4 — Auth UI (login, signup, forgot-password, reset-password forms with Zod validation).

## Session — Aug 1, 2026 (Phase 2)
**Phase:** Phase 2 complete, Phase 3 ready
**Completed this session:** Shared layout built (Navbar, Footer, PageContainer). Set up `(public)` route group layout and two placeholder pages (`/` and `/courses`). Deleted Next.js default page. Verified UI layout across desktop and mobile.
**Files touched:** components/Navbar.tsx, components/Footer.tsx, components/PageContainer.tsx, app/(public)/layout.tsx, app/(public)/page.tsx, app/(public)/courses/page.tsx, app/page.tsx (deleted).
**Decisions made:** Use `(public)` route group to apply the Navbar and Footer to public pages, making it easy to separate from dashboard/admin layouts later.
**Next step:** Begin Phase 3 — Public Pages (Home, Course listing, Course detail).

## Session — Aug 1, 2026 (Phase 1)
**Phase:** Phase 1 complete, Phase 2 ready
**Completed this session:** All types/ directory (user, course, lesson, enrollment, quiz, attempt, payment, index barrel); tokens.css with full Design.md token set; en.json i18n scaffold; updated globals.css (Tailwind v4 imports + tokens); updated layout.tsx (Inter font, metadata template). TypeScript passes clean. Dev server confirmed GET / 200.
**Files touched:** types/user.ts, types/course.ts, types/lesson.ts, types/enrollment.ts, types/quiz.ts, types/attempt.ts, types/payment.ts, types/index.ts, styles/tokens.css, messages/en.json, app/globals.css, app/layout.tsx, package.json (added @tanstack/react-query, lucide-react, zod direct, next-intl)
**Decisions made:** Next.js is actually v16 (not 14 as in Architecture.md) — params/searchParams are Promises, must be awaited. Tailwind v4 installed — uses @import not @tailwind directives. Prices in pence (integer). QuizForStudent strips correctOptionIndex. i18n deferred to proper wiring phase.
**Next step:** Begin Phase 2 — Navbar, Footer, PageContainer, shared layout, two placeholder pages

## Session — Aug 1, 2026 (cont'd)
**Phase:** Phase 0 complete, confirming readiness for Phase 1
**Completed this session:** Reviewed "Blocked/Waiting On" list against Phases.md — confirmed nothing pending blocks Phases 1-8; decided to defer npm audit vulnerabilities to Phase 14
**Files touched:** docs/Memory.md
**Decisions made:** See "Decisions Made" section above
**Next step:** Begin Phase 1 — types/ directory and tokens.css

## Session — Aug 1, 2026
**Phase:** Phase 0 complete, starting Phase 1
**Completed this session:** Next.js scaffold, git init, docs folder added, lib/types/styles/messages folders created, dependencies installed (@tanstack/react-query, lucide-react, zod)
**Files touched:** package.json, docs/*, lib/api.ts, styles/tokens.css, messages/en.json
**Decisions made:** Project moved from Desktop (D:\) to avoid OneDrive file-lock conflicts during npm install
**Next step:** Start Phase 1 — build types/ directory and tokens.css