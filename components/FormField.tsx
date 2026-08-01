/**
 * FormField — reusable label + input + error message unit.
 *
 * Design.md: generous spacing between fields (--space-4), error messages
 * in --color-error directly under the field, never just a red border.
 *
 * This is a presentational component only — no state, no validation logic.
 * All validation is done by Zod in the parent form.
 */
export default function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  autoComplete,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
}: {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label
        htmlFor={id}
        style={{
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--color-text)',
        }}
      >
        {label}
        {required && (
          <span
            aria-hidden="true"
            style={{ color: 'var(--color-error)', marginLeft: '3px' }}
          >
            *
          </span>
        )}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: '15px',
          borderRadius: 'var(--radius-sm)',
          border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
          backgroundColor: disabled ? 'var(--color-bg-subtle)' : 'var(--color-bg)',
          color: 'var(--color-text)',
          outline: 'none',
          transition: 'border-color 0.15s',
          cursor: disabled ? 'not-allowed' : 'text',
        }}
        // Focus ring via global :focus-visible in globals.css
      />

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          style={{
            fontSize: '13px',
            color: 'var(--color-error)',
            margin: 0,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
