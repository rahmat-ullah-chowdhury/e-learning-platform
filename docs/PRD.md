# PRD.md — Product Requirements Document

## 1. What We're Building
A web-based e-learning platform offering free and paid courses, with a strict, exam-style live testing system. Instructors upload courses; students learn, get assessed, and earn certificates; admins oversee the whole platform.

## 2. Target Users

| User Type | Description |
|---|---|
| Student / General Public | Anyone — students, working professionals, educators — browsing and taking courses, sitting exams, earning certificates |
| Instructor | Uploads and manages their own courses, builds quizzes/exams, views their enrolled students |
| Admin | Oversees all courses, users, payments, exams; can promote other admins |
| Super Admin | The single top-level account at launch; only role that can create new admins |

## 3. Region & Market
Launching UK-first (currency: GBP, payment methods: UK + global via Stripe), architected to expand globally later without rework (currency/region is config-driven, not hardcoded).

## 4. Core Features (MVP)

### Course System
- Free and paid courses, no fixed ratio between them
- Content types: video, PDF, live class, downloadable resources
- Course categories, search, and filtering
- Progress tracking per student, per lesson

### Payments
- One-time course purchase at launch (subscription support reserved in schema for later)
- Stripe integration (covers UK + global cards)
- Payment history and invoices for students
- Admin refund capability

### Exams / Quizzes
- Fixed exam windows (real-exam style) — start/end time enforced server-side, not client-side
- Question types: MCQ, short answer, essay
- MCQ auto-graded instantly; short answer/essay go to manual review queue
- Certificates issued on passing
- Anti-cheat: off by default, reserved as a togglable feature for later (not required at launch)

### Roles & Access
- Multi-instructor support (multiple people can upload courses)
- Admin oversight dashboard over all content, users, and payments
- Single super admin at launch, with ability to promote others later
- Full audit log of admin actions

### Multi-language
- i18n scaffolded from day one (English content only at launch), so adding languages later is a translation task, not a rebuild

## 5. Explicitly Out of Scope for MVP
- Native mobile app (web-only, responsive)
- Coupon codes / discount system (hook left in schema, not built)
- Subscription billing (schema-ready, not active)
- Webcam/AI proctoring (flag reserved, not implemented)
- Multiple languages live (structure only)

## 6. Success Criteria
- A student can discover, enroll in (free or paid), and complete a course end to end
- A student can sit a timed exam that cannot be manipulated client-side, and receive a grade
- An instructor can upload a full course with mixed content types
- An admin can see platform-wide activity and take moderation/financial actions, all logged
- The platform passes the full Security & Auth checklist (see Rules.md / Architecture.md) before launch

## 7. Design Reference
Visual direction inspired by Udemy and Coursera — clean, card-heavy, trustworthy edtech aesthetic. Full detail in Design.md.
