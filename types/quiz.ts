export type QuestionType = 'mcq' | 'short_answer' | 'essay';

export type QuizStatus = 'draft' | 'scheduled' | 'open' | 'closed';

export interface Question {
  id: string;
  quizId: string;
  type: QuestionType;
  /** Order within the quiz (1-indexed) */
  order: number;
  text: string;
  /** MCQ only: the choices shown to the student */
  options?: string[];
  /**
   * MCQ only: index into `options` for the correct answer.
   * NEVER sent to the client before grading — server-side only.
   */
  correctOptionIndex?: number;
  /** Points this question is worth */
  points: number;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  status: QuizStatus;
  /** Server-enforced window: students cannot submit outside this range */
  windowStartsAt: string | null;
  windowEndsAt: string | null;
  /** Duration in minutes the student is allowed once they open the quiz */
  durationMinutes: number;
  questions: Question[];
  /** Maximum possible score (sum of all question points) */
  maxScore: number;
  /** Minimum score (as % 0–100) required to pass and earn a certificate */
  passingPercent: number;
  /**
   * Anti-cheat flag — reserved for future use, not active at MVP.
   * See PRD.md §5: explicitly out of scope.
   */
  antiCheatEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

/** A quiz stripped of answers, safe to send to the student during an attempt */
export type QuizForStudent = Omit<Quiz, 'questions'> & {
  questions: Omit<Question, 'correctOptionIndex'>[];
};
