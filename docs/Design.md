# Design.md — Visual Design System

## 1. Design Direction
Reference platforms: Udemy, Coursera — clean, card-heavy, trustworthy edtech aesthetic. Prioritize clarity and scannability over decoration; this is a platform people trust with money and exams, so the visual tone should feel credible and calm, not flashy.

## 2. Color Tokens (`styles/tokens.css`)

Defaults below — swappable later via Admin → Settings → Branding, so treat every color as a variable, never a hardcoded hex in components.

```css
:root {
  /* Brand */
  --color-primary: #2563eb;       /* primary actions, links, active states */
  --color-primary-hover: #1d4ed8;
  --color-secondary: #7c3aed;     /* accents, badges */

  /* Semantic */
  --color-success: #16a34a;       /* passed exam, completed course */
  --color-warning: #d97706;       /* pending review, exam window closing */
  --color-error: #dc2626;         /* failed validation, errors */
  --color-info: #0891b2;

  /* Neutrals */
  --color-bg: #ffffff;
  --color-bg-subtle: #f8fafc;
  --color-border: #e2e8f0;
  --color-text: #0f172a;
  --color-text-muted: #64748b;

  /* Spacing scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;

  /* Shadow */
  --shadow-card: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
}
```

## 3. Typography

- **Font**: Inter (via `next/font`) — clean, highly legible, standard for SaaS/edtech UI
- **Scale**:
  - Display / hero: 40–48px, bold
  - H1 (page titles): 32px, semibold
  - H2 (section headers): 24px, semibold
  - H3 (card titles): 18px, semibold
  - Body: 16px, regular
  - Small/meta text: 14px, regular
  - Caption/label: 12px, medium

## 4. Component Style Guidance

**Cards** (`CourseCard`, dashboard widgets): white background, `--shadow-card`, `--radius-md`, hover state lifts shadow slightly — this is the dominant visual pattern across the platform, matching Udemy/Coursera's card-grid approach.

**Buttons**:
- Primary: solid `--color-primary`, white text, `--radius-sm`
- Secondary: outline, `--color-primary` text/border
- Destructive (admin ban/delete/refund): `--color-error`, used sparingly, always with a confirmation step

**Forms**: generous spacing (`--space-4` between fields), clear error states in `--color-error` with a short message directly under the field, never just a red border with no explanation.

**Exam UI specifically**: deliberately calmer and more minimal than the rest of the platform — reduce visual noise during an exam (muted colors, no marketing elements, no distracting animations). The timer should be visible but not anxiety-inducing (avoid harsh red countdown until the final couple of minutes).

**Admin tables**: dense, functional, sortable columns, zebra-striping optional for readability at scale — this is a workspace, not a marketing surface, so it can look more utilitarian than the student-facing pages.

## 5. Responsive Breakpoints (Tailwind defaults, confirmed suitable)
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```
Mobile-first even though this phase is web-only — don't design desktop-only layouts that break down to mobile as an afterthought.

## 6. Dark Mode
Not required for MVP. If added later, tokens.css is already structured (CSS variables) to support a `[data-theme="dark"]` override without touching component code.
