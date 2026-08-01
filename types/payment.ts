export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  /** Amount paid in pence (GBP) */
  amountPence: number;
  currency: 'GBP';
  status: PaymentStatus;
  /** Stripe PaymentIntent or CheckoutSession ID */
  stripePaymentId: string;
  /** Stripe invoice URL for the student's records */
  invoiceUrl?: string;
  /**
   * Refund reason — set by admin when issuing a refund.
   * Subscription hook field reserved per PRD.md §5.
   */
  refundReason?: string;
  /** userId of the admin who issued the refund */
  refundedBy?: string;
  createdAt: string;
  updatedAt: string;
}

/** Summary card shown in student payment history */
export interface PaymentSummary {
  id: string;
  courseTitle: string;
  courseThumbnailUrl?: string;
  amountPence: number;
  currency: 'GBP';
  status: PaymentStatus;
  createdAt: string;
  invoiceUrl?: string;
}
