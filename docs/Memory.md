# Memory.md — Living Progress Log

> This file does not get created "cold" — start filling it in from the end of your very first coding session, and update it at the end of every session after that. At the start of each new chat/session, paste this file in first so the AI has context without re-reading the whole codebase.

---

## Current Phase
Phase 5 — Student Dashboard (Frontend Only)

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

## In Progress
- Nothing — Phase 4 complete; Phase 5 ready to start

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

## Known Issues / Tech Debt
- 3 high severity npm vulnerabilities present since Phase 0 scaffold — intentionally unaddressed until Phase 14, not forgotten.
- `next-intl` is installed but not configured (middleware/routing). i18n wiring deferred; components use plain strings for now.
- CourseCard thumbnails use coloured placeholder divs with category initials — real thumbnails will come via Cloudflare R2/S3 in Phase 10.
- Course detail `getWhatYouLearnPoints()` returns generic per-category outcomes — real `whatYouLearn[]` field should be added to the `Course` type and mock data when an instructor course editor is built (Phase 7).

## Blocked / Waiting On
- Client answers still pending (not currently blocking any active phase): number of languages needed, exact scale/growth targets, timeline and budget, existing system integrations, admin role permission granularity (see PRD.md / original metadata doc)

## Next Steps
- Start Phase 5 — Student Dashboard (Frontend Only):
  1. Create `app/(student)/` route group with its own layout (no public Navbar/Footer — separate dashboard shell with sidebar).
  2. Build sidebar nav component: links to Dashboard, My Courses, Certificates, Payments, Settings.
  3. Build `app/(student)/dashboard/page.tsx` — enrolled courses grid (using mock enrollments), progress bars.
  4. Build `app/(student)/dashboard/settings/page.tsx` — name/email edit form (Zod), password change section.
  5. Add mock enrollment data + getEnrollments() to lib/api.ts.
  6. Done when: student can see their enrolled courses with progress, navigate sidebar, and view settings.

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