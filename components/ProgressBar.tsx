/**
 * ProgressBar — Reusable progress bar with design tokens.
 *
 * Accepts a percent (0–100) and renders a filled track.
 * Uses --color-primary for the fill and --color-border for the track.
 */

interface ProgressBarProps {
  /** Percentage complete (0–100) */
  percent: number;
  /** Size variant */
  size?: 'sm' | 'md';
  /** Show percentage label to the right */
  showLabel?: boolean;
}

export default function ProgressBar({
  percent,
  size = 'md',
  showLabel = false,
}: ProgressBarProps) {
  const clampedPercent = Math.max(0, Math.min(100, percent));
  const trackHeight = size === 'sm' ? '6px' : '8px';
  const isComplete = clampedPercent === 100;

  return (
    <div className="flex items-center gap-2" style={{ width: '100%' }}>
      <div
        role="progressbar"
        aria-valuenow={clampedPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${clampedPercent}% complete`}
        style={{
          flex: 1,
          height: trackHeight,
          backgroundColor: 'var(--color-border)',
          borderRadius: '9999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${clampedPercent}%`,
            height: '100%',
            backgroundColor: isComplete
              ? 'var(--color-success)'
              : 'var(--color-primary)',
            borderRadius: '9999px',
            transition: 'width 0.4s ease',
          }}
        />
      </div>
      {showLabel && (
        <span
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: isComplete
              ? 'var(--color-success)'
              : 'var(--color-text-muted)',
            minWidth: '36px',
            textAlign: 'right',
          }}
        >
          {clampedPercent}%
        </span>
      )}
    </div>
  );
}
