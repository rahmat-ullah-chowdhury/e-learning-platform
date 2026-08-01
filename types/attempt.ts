export type AttemptStatus = 'in_progress' | 'submitted' | 'graded';

export type GradeStatus = 'pending' | 'auto_graded' | 'manually_reviewed';

/** A single answer submitted for one question */
export interface SubmittedAnswer {
  questionId: string;
  /** MCQ: index of chosen option. short_answer/essay: free text. */
  value: string | number;
}

/** An instructor's or admin's review of a manually-graded answer */
export interface AnswerReview {
  questionId: string;
  score: number;
  feedback?: string;
  reviewedBy: string; // userId
  reviewedAt: string;
}

export interface Attempt {
  id: string;
  quizId: string;
  userId: string;
  status: AttemptStatus;
  gradeStatus: GradeStatus;
  /** ISO timestamp when the student opened the quiz — set server-side */
  startedAt: string;
  /**
   * ISO timestamp when the student submitted (or when the server
   * force-closed at window end) — set server-side, never trusted from client
   */
  submittedAt: string | null;
  answers: SubmittedAnswer[];
  reviews: AnswerReview[];
  /** Auto-graded MCQ score + any manually assigned scores combined */
  totalScore: number | null;
  /** Whether the student achieved >= quiz.passingPercent */
  passed: boolean | null;
  /** Certificate ID issued on pass — null until issued */
  certificateId: string | null;
}
