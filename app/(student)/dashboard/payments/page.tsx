import { getPaymentHistory, formatPrice } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import { CreditCard, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Payment History — LearnHub',
  description: 'View your payment history and download invoices.',
};

// Mock phase: re-query the shared mock source on every visit (see /instructor).
export const dynamic = 'force-dynamic';

/**
 * Payment History page — table/card list of all payments.
 *
 * Shows: Course, Amount, Status, Date, Invoice link.
 * Status badges use design tokens only (--color-warning for pending/refunded).
 */
export default async function PaymentsPage() {
  const payments = await getPaymentHistory();

  return (
    <div>
      <h1
        style={{
          fontSize: '28px',
          fontWeight: 600,
          color: 'var(--color-text)',
          margin: '0 0 var(--space-2) 0',
        }}
      >
        Payment History
      </h1>
      <p
        style={{
          fontSize: '15px',
          color: 'var(--color-text-muted)',
          margin: '0 0 var(--space-6) 0',
        }}
      >
        View your past transactions and download invoices.
      </p>

      {payments.length > 0 ? (
        <>
          {/* Desktop table */}
          <div
            className="hidden sm:block"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-card)',
              overflow: 'hidden',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px',
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg-subtle)',
                  }}
                >
                  <th
                    style={{
                      textAlign: 'left',
                      padding: 'var(--space-3) var(--space-4)',
                      fontWeight: 500,
                      color: 'var(--color-text-muted)',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Course
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: 'var(--space-3) var(--space-4)',
                      fontWeight: 500,
                      color: 'var(--color-text-muted)',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Amount
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: 'var(--space-3) var(--space-4)',
                      fontWeight: 500,
                      color: 'var(--color-text-muted)',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: 'var(--space-3) var(--space-4)',
                      fontWeight: 500,
                      color: 'var(--color-text-muted)',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      textAlign: 'right',
                      padding: 'var(--space-3) var(--space-4)',
                      fontWeight: 500,
                      color: 'var(--color-text-muted)',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    <td
                      style={{
                        padding: 'var(--space-4)',
                        fontWeight: 500,
                        color: 'var(--color-text)',
                      }}
                    >
                      {payment.courseTitle}
                    </td>
                    <td
                      style={{
                        padding: 'var(--space-4)',
                        color: 'var(--color-text)',
                        fontWeight: 600,
                      }}
                    >
                      {formatPrice(payment.amountPence)}
                    </td>
                    <td style={{ padding: 'var(--space-4)' }}>
                      <StatusBadge status={payment.status} />
                    </td>
                    <td
                      style={{
                        padding: 'var(--space-4)',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      {new Date(payment.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td
                      style={{
                        padding: 'var(--space-4)',
                        textAlign: 'right',
                      }}
                    >
                      {payment.invoiceUrl ? (
                        <a
                          href={payment.invoiceUrl}
                          id={`invoice-${payment.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1"
                          style={{
                            fontSize: '13px',
                            color: 'var(--color-primary)',
                            textDecoration: 'none',
                            fontWeight: 500,
                          }}
                        >
                          View <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div
            className="sm:hidden flex flex-col gap-3"
          >
            {payments.map((payment) => (
              <div
                key={payment.id}
                style={{
                  backgroundColor: 'var(--color-bg)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-card)',
                  padding: 'var(--space-4)',
                }}
              >
                <div
                  className="flex items-start justify-between"
                  style={{ marginBottom: 'var(--space-2)' }}
                >
                  <p
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      margin: 0,
                    }}
                  >
                    {payment.courseTitle}
                  </p>
                  <StatusBadge status={payment.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                    }}
                  >
                    {formatPrice(payment.amountPence)}
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {new Date(payment.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                {payment.invoiceUrl && (
                  <a
                    href={payment.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1"
                    style={{
                      marginTop: 'var(--space-3)',
                      fontSize: '13px',
                      color: 'var(--color-primary)',
                      textDecoration: 'none',
                      fontWeight: 500,
                    }}
                  >
                    View Invoice <ExternalLink size={12} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--space-12) var(--space-4)',
            backgroundColor: 'var(--color-bg)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <CreditCard
            size={48}
            style={{ color: 'var(--color-text-muted)', margin: '0 auto var(--space-4)' }}
          />
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--color-text)',
              margin: '0 0 var(--space-2) 0',
            }}
          >
            No payments yet
          </h2>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--color-text-muted)',
              margin: 0,
            }}
          >
            Your payment history will appear here when you enrol in a paid course.
          </p>
        </div>
      )}
    </div>
  );
}
