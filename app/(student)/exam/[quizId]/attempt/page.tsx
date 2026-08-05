import { notFound } from 'next/navigation';
import { getQuizById } from '@/lib/api';
import QuizAttemptClient from '@/components/QuizAttemptClient';

export const metadata = {
  title: 'Exam — LearnHub',
  description: 'Complete your exam within the allotted time.',
};

/**
 * Quiz Attempt page — server component wrapper.
 *
 * Fetches the quiz server-side (from the shared mock store) and hands the
 * client-safe QuizForStudent to the QuizAttemptClient. Fetching here (not in
 * the client) means quizzes created at runtime by an instructor — which never
 * exist in the client bundle — can be attempted. Grading still happens
 * server-side via submitAttemptAction.
 */
export default async function QuizAttemptPage(props: {
  params: Promise<{ quizId: string }>;
}) {
  const params = await props.params;
  const quiz = await getQuizById(params.quizId);
  if (!quiz) notFound();

  return <QuizAttemptClient quiz={quiz} />;
}
