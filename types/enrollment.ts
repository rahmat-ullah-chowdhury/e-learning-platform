export type EnrollmentStatus = 'active' | 'completed' | 'refunded';

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  /** Percentage of lessons completed (0–100) */
  progressPercent: number;
  /** Payment reference — null for free courses */
  paymentId: string | null;
  enrolledAt: string;
  completedAt: string | null;
}
