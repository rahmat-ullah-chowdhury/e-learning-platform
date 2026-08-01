# Memory.md — Living Progress Log

> This file does not get created "cold" — start filling it in from the end of your very first coding session, and update it at the end of every session after that. At the start of each new chat/session, paste this file in first so the AI has context without re-reading the whole codebase.

---

## Current Phase
Phase 1 — Types & Design Foundation

## Completed
- Phase 0 — Environment & Scaffold: Next.js 14 project scaffolded (TypeScript, Tailwind, App Router, ESLint)
- Git repository initialized, first commits made
- `docs/` folder added with PRD.md, Architecture.md, Rules.md, Phases.md, Design.md, Memory.md, api-keys-and-signups.md
- Folder structure created: `lib/`, `types/`, `styles/`, `messages/`
- Placeholder files created: `lib/api.ts`, `styles/tokens.css`, `messages/en.json`
- Core dependencies installed: `@tanstack/react-query`, `lucide-react`, `zod`
- Verified `npm run dev` runs successfully, default Next.js page loads at localhost:3000

## In Progress
- Nothing yet — Phase 1 not yet started

## Decisions Made That Aren't in the Other Docs Yet
- Confirmed the "Blocked/Waiting On" client questions below do NOT block Phases 1–8 (all frontend UI work) — they only become relevant at their specific later phase (languages → messages/ later, scale → Phase 9 infra, timeline/budget → project mgmt only, integrations → whenever specific integration is built, admin permission granularity → Phase 13). Safe to proceed through all frontend phases without these answers.
- npm reported 3 high severity vulnerabilities during Phase 0 scaffold (likely dev-only tooling, e.g. eslint-related packages). Decision: do NOT run `npm audit fix --force` now — risks breaking the fresh scaffold by force-upgrading packages Next.js expects specific versions of. Deferred to Phase 14 (Hardening & Launch) for a proper audit pass.

## Known Issues / Tech Debt
- 3 high severity npm vulnerabilities present since Phase 0 scaffold — intentionally unaddressed until Phase 14, not forgotten.

## Blocked / Waiting On
- Client answers still pending (not currently blocking any active phase): number of languages needed, exact scale/growth targets, timeline and budget, existing system integrations, admin role permission granularity (see PRD.md / original metadata doc)

## Next Steps
- Start Phase 1: build out the full `types/` directory per Architecture.md Section on Data Models (User, Course, Lesson, Enrollment, Quiz, Question, Attempt, Payment)
- Build `styles/tokens.css` per Design.md color/typography tokens
- Confirm TypeScript compiles cleanly with no errors before moving to Phase 2 (Shared Layout)

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