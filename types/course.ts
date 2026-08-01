export type CourseStatus = 'draft' | 'published' | 'archived';

export type ContentType = 'video' | 'pdf' | 'live' | 'download';

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  instructorId: string;
  instructorName: string;
  /** Price in pence (GBP). 0 means free. */
  pricePence: number;
  currency: 'GBP';
  status: CourseStatus;
  category: string;
  tags: string[];
  /** Total duration in seconds across all video/live lessons */
  totalDurationSeconds: number;
  lessonCount: number;
  enrollmentCount: number;
  /** Average rating 0–5, null if no ratings yet */
  averageRating: number | null;
  /** coupon hook — schema-ready, not active at MVP */
  couponCode?: string;
  /** subscription hook — schema-ready, not active at MVP */
  subscriptionPlanId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseListItem {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl?: string;
  instructorName: string;
  pricePence: number;
  currency: 'GBP';
  category: string;
  enrollmentCount: number;
  averageRating: number | null;
  lessonCount: number;
}
