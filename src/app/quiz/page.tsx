import { QuizForm } from '@/components/quiz/quiz-form';
import { submitQuiz } from '@/app/actions';

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-background">
      <QuizForm submitQuiz={submitQuiz} />
    </main>
  );
}
