# Rules.md — Boundaries for AI-Assisted Coding

## 1. Libraries — Use These, Nothing Else Without Asking

**Approved:**
- Next.js 14 (App Router only — never Pages Router)
- Tailwind CSS (no other CSS-in-JS libraries)
- TypeScript strict mode (no `any` unless explicitly justified in a comment)
- TanStack Query
- Zod (all validation)
- Prisma (all database access — no raw SQL unless Prisma genuinely cannot express the query, and even then, ask first)
- bcrypt or argon2 (password hashing only — never a custom hash implementation)
- jsonwebtoken (JWT handling)
- Stripe official SDK
- lucide-react (icons)
- Recharts (charts)

**Do not introduce without explicit approval:**
- Any new state management library (Redux, MobX, etc.) — TanStack Query + React state is sufficient
- Any new CSS framework or component library beyond Tailwind (no Bootstrap, MUI, Chakra, etc.)
- Any ORM other than Prisma
- Any auth-as-a-service (Auth0, Clerk, Firebase Auth) — auth is custom-built per the JWT architecture already defined
- Any new database (no MongoDB, Firebase, Supabase-as-DB alongside Postgres)

## 2. What the AI Should Always Do
- Read `PRD.md`, `Architecture.md`, and `Phases.md` before starting any new feature
- Check `Memory.md` (once it exists) at the start of every session before writing code
- Follow the exact TypeScript types defined in `types/` — never invent new fields without updating the type first
- Write loading, empty, and error states for every data-driven component
- Validate all form input with Zod, client and server side
- Ask before making an architectural decision not already covered in these documents
- Flag any request that would contradict the Security & Auth Architecture (e.g., "just store the JWT in localStorage for now" — explain why not, don't silently comply)
- Keep components small and single-purpose; prefer composition over large monolithic components
- Use the mock API layer (`lib/api.ts`) pattern — never fetch data directly inside a component

## 3. What the AI Should Never Do
- Never hardcode API keys, secrets, or credentials anywhere in code
- Never store JWTs or any auth token in localStorage/sessionStorage
- Never send correct quiz answers to the client before grading
- Never trust client-submitted role, price, or timestamp data for anything security- or payment-relevant — always re-validate server-side
- Never write raw SQL string concatenation
- Never skip input validation "to save time"
- Never silently expand scope (e.g., adding a feature not listed in the current Phase) — flag it and ask instead
- Never remove or weaken a security measure already agreed upon (rate limiting, httpOnly cookies, RBAC checks) without explicit instruction

## 4. Error Handling Conventions
- User-facing errors: generic, non-revealing messages ("Invalid credentials", "Something went wrong") — never expose stack traces, internal error messages, or which specific field failed for auth-related errors
- Internal errors: full detail logged server-side (console in dev, Sentry in production)
- All API routes wrapped in try/catch; failures return consistent JSON shape: `{ error: string }`
- Every async operation in the frontend must have a loading and error UI state — no silent failures

## 5. Code Style
- TypeScript everywhere, strict mode on
- Functional components only, no class components
- Prettier for formatting (run before every commit)
- File naming: PascalCase for components, camelCase for functions/utilities
- One component per file, matching filename
- Comments only where logic isn't self-explanatory — don't over-comment obvious code

## 6. When the AI Is Unsure
If a request is ambiguous, contradicts an existing document, or requires a decision not yet made (e.g., "should refunds be automatic or manual approval?") — the AI should ask a direct clarifying question rather than assume and build the wrong thing. Getting this wrong costs more tokens and time than asking upfront.
