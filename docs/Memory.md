# Memory.md — Living Progress Log

> This file does not get created "cold" — start filling it in from the end of your very first coding session, and update it at the end of every session after that. At the start of each new chat/session, paste this file in first so the AI has context without re-reading the whole codebase.

---

## Current Phase
Phase 3 — Public Pages

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

## In Progress
- Nothing — Phase 2 complete; Phase 3 ready to start

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
- `lib/api.ts` is empty — will be populated starting Phase 3.

## Blocked / Waiting On
- Client answers still pending (not currently blocking any active phase): number of languages needed, exact scale/growth targets, timeline and budget, existing system integrations, admin role permission granularity (see PRD.md / original metadata doc)

## Next Steps
- Start Phase 3 — Public Pages:
  1. Update `lib/api.ts` to include mock data and mock fetch functions for courses (e.g. `getCourses`, `getCourseBySlug`).
  2. Build `app/(public)/page.tsx` with full hero section and featured courses.
  3. Build `components/CourseCard.tsx` (handling free/paid variants).
  4. Update `app/(public)/courses/page.tsx` to list courses using mock data.
  5. Build `app/(public)/courses/[slug]/page.tsx` for course details.
  6. Done when: user can browse from home -> listing -> detail using mock data.

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