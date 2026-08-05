/**
 * StatusBadge — Small status indicator badge.
 *
 * Maps status values to design token colors.
 * Per Design.md decision: uses --color-warning for both pending and refunded
 * states (no ad hoc colors outside the token system).
 */

type StatusVariant =
  // payments / enrollments
  | 'active' | 'completed' | 'refunded' | 'pending' | 'succeeded' | 'failed'
  // courses (Phase 7)
  | 'draft' | 'published' | 'archived'
  // quizzes (Phase 7)
  | 'scheduled' | 'open' | 'closed';

interface StatusBadgeProps {
  status: StatusVariant;
  /** Optional custom label — defaults to capitalised status */
  label?: string;
}

const VARIANT_STYLES: Record<StatusVariant, { bg: string; color: string }> = {
  active: { bg: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary)' },
  completed: { bg: 'rgba(22, 163, 74, 0.1)', color: 'var(--color-success)' },
  succeeded: { bg: 'rgba(22, 163, 74, 0.1)', color: 'var(--color-success)' },
  pending: { bg: 'rgba(217, 119, 6, 0.1)', color: 'var(--color-warning)' },
  refunded: { bg: 'rgba(217, 119, 6, 0.1)', color: 'var(--color-warning)' },
  failed: { bg: 'rgba(220, 38, 38, 0.1)', color: 'var(--color-error)' },
  // courses — draft/archived muted, published success
  draft: { bg: 'rgba(100, 116, 139, 0.12)', color: 'var(--color-text-muted)' },
  published: { bg: 'rgba(22, 163, 74, 0.1)', color: 'var(--color-success)' },
  archived: { bg: 'rgba(217, 119, 6, 0.1)', color: 'var(--color-warning)' },
  // quizzes — scheduled info, open success, closed muted
  scheduled: { bg: 'rgba(8, 145, 178, 0.1)', color: 'var(--color-info)' },
  open: { bg: 'rgba(22, 163, 74, 0.1)', color: 'var(--color-success)' },
  closed: { bg: 'rgba(100, 116, 139, 0.12)', color: 'var(--color-text-muted)' },
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const style = VARIANT_STYLES[status] ?? VARIANT_STYLES.active;
  const displayLabel = label ?? status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: '20px',
        borderRadius: '9999px',
        backgroundColor: style.bg,
        color: style.color,
        whiteSpace: 'nowrap',
      }}
    >
      {displayLabel}
    </span>
  );
}
