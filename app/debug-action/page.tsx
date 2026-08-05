import { getInstructorCourseById } from '@/lib/api';
import { addDebugLessonAction, addDebugQuizAction } from './actions';

/**
 * TEMPORARY test page (deleted after use).
 *
 * Renders the current c1 lesson count and a plain HTML form whose submit
 * button invokes a server action (progressive enhancement — no JS needed).
 * This lets us curl the form POST exactly like a browser would and test
 * whether server-action mutations are visible to page renders.
 */
export const dynamic = 'force-dynamic';

export default async function DebugActionPage() {
  const data = await getInstructorCourseById('c1');
  const count = data?.lessons.length ?? 0;
  return (
    <div style={{ padding: 32 }}>
      <p>LESSON_COUNT:{count}</p>
      <form action={addDebugLessonAction}>
        <button type="submit" id="go">
          Add lesson via server action
        </button>
      </form>
      <form action={addDebugQuizAction}>
        <button type="submit" id="go-quiz">
          Add + publish quiz via server action
        </button>
      </form>
    </div>
  );
}
