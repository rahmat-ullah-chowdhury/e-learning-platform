# Architecture.md — App Flow & Technical Architecture

## 1. Tech Stack

### Frontend (build now)
- Next.js 16 (App Router) — note: originally scoped as v14; the actual installed version is 16. Key differences to follow: `params`/`searchParams` in page/layout components are Promises and must be `await`ed; `PageProps`/`LayoutProps` are globally available typed helpers, no import needed
- Tailwind CSS v4 (not v3) — uses `@import 'tailwindcss'` in CSS, not `@tailwind base/components/utilities` directives; design tokens can use the `@theme` block in CSS; no `tailwind.config.js` needed for basic usage
- TypeScript (strict mode)
- TanStack Query (React Query) for data fetching
- next-intl for i18n
- lucide-react for icons
- next/font for fonts
- Recharts for admin charts
- Zod for validation

### Backend (build after frontend foundation)
- Node.js + Express or Fastify (separate service from Next.js frontend)
- PostgreSQL as the primary database
- Prisma as the ORM
- Redis (Upstash) for caching, sessions, and token revocation
- JWT (jsonwebtoken) for authentication — access + refresh token pattern
- Stripe for payments
- Cloudflare R2 or AWS S3 for file storage (thumbnails, PDFs)
- Bunny Stream or Mux for video hosting/streaming
- Socket.io for real-time exam monitoring (only if synchronized live exams are needed)
- BullMQ + Redis for background jobs (emails, certificate generation)

### Infrastructure
- Vercel — frontend hosting
- Railway or Render — backend + Postgres + Redis hosting
- Cloudflare — CDN + DDoS protection, sits in front of everything
- Sentry — error monitoring
- GitHub — version control, CI/CD trigger

## 2. High-Level App Flow

1. **Visitor** browses public pages (home, course listing/detail) — served via SSR/ISR, no auth required
2. **Registration/Login** → credentials validated → password checked via bcrypt → JWT access + refresh tokens issued as httpOnly cookies
3. **Authenticated student** → dashboard, course player, enrollment, payment via Stripe checkout
4. **Exam flow** → student opens quiz within a server-enforced time window → answers auto-saved → submission validated against server time → MCQ auto-graded, others queued for review
5. **Instructor** → uploads course content via presigned upload URLs (browser uploads directly to storage, not through the app server) → creates lessons/quizzes
6. **Admin** → all actions go through role-checked API routes → every sensitive action is written to an audit log
7. **All API requests** pass through: JWT verification middleware → role/permission check → Prisma query → response

## 3. Folder Structure

```
elearning-platform/
├── app/                        # Next.js App Router pages
│   ├── (public)/
│   │   ├── page.tsx             # Home
│   │   ├── courses/
│   │   │   ├── page.tsx         # Course listing
│   │   │   └── [slug]/page.tsx  # Course detail
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/[token]/page.tsx
│   ├── (student)/
│   │   ├── dashboard/page.tsx
│   │   ├── dashboard/settings/page.tsx
│   │   ├── dashboard/payments/page.tsx
│   │   ├── dashboard/certificates/page.tsx
│   │   ├── learn/[courseSlug]/[lessonId]/page.tsx
│   │   └── exam/[quizId]/(start|attempt|result)/page.tsx
│   ├── (instructor)/
│   │   ├── instructor/page.tsx
│   │   ├── instructor/courses/page.tsx
│   │   ├── instructor/courses/[id]/edit/page.tsx
│   │   └── instructor/quizzes/[id]/edit/page.tsx
│   └── (admin)/
│       ├── admin/page.tsx
│       ├── admin/courses/page.tsx
│       ├── admin/users/page.tsx
│       ├── admin/payments/page.tsx
│       ├── admin/exams/page.tsx
│       ├── admin/audit-log/page.tsx
│       └── admin/settings/page.tsx
├── components/                 # Reusable UI components
├── lib/
│   ├── api.ts                   # Mock API layer now → real fetch calls later
│   └── auth.ts                  # Auth helper functions (added in backend phase)
├── types/                       # All TypeScript interfaces
├── styles/
│   └── tokens.css               # Design tokens
├── messages/
│   └── en.json                  # i18n strings
├── prisma/
│   └── schema.prisma            # Added in backend phase
├── .env.local                   # Local secrets (never committed)
├── .env.example                 # Placeholder keys, committed
└── middleware.ts                # Route protection (added in backend phase)
```

## 4. Data Flow: How JWT, Database, and Admin Panel Connect

```
Browser → API route → authMiddleware (verifies JWT from httpOnly cookie)
        → requireRole middleware (checks role from token)
        → Prisma Client → PostgreSQL
        → Response back to browser
```

Every admin/instructor/student action follows this exact chain — no route skips the middleware, no component queries the database directly (only the backend does, via Prisma).

## 5. Data Conventions (established during Phase 1)

- **Currency**: all prices stored as integer pence/cents (e.g. `1999` = £19.99), never floats — avoids floating-point rounding issues. Display layer handles formatting (`£` + `(pricePence / 100).toFixed(2)`).
- **Quiz answer safety**: the full `Quiz`/`Question` type (including `correctOptionIndex`) is server-only and must never be sent to the client. A separate client-safe type (`QuizForStudent`) strips correct-answer fields — this is the type to use for any API response or component that renders a quiz to a student before grading.
- **i18n rollout**: `next-intl` is installed from Phase 1 but not wired up (no middleware/routing config yet). Phases 2–8 (UI-only work) use plain English strings directly in components. Full i18n wiring happens in a dedicated later pass — do not partially wire it mid-phase.

## 6. Environment Variables (structure, values added during setup)

```
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
REDIS_URL=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
S3_OR_R2_ACCESS_KEY=
S3_OR_R2_SECRET_KEY=
S3_OR_R2_BUCKET_NAME=
VIDEO_SERVICE_API_KEY=
SENTRY_DSN=
```