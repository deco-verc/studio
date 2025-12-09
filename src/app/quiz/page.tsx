import { QuizForm } from '@/components/quiz/quiz-form';
import Head from 'next/head';

export default function QuizPage() {
  // Preloading logic can be improved or removed if not necessary
  return (
    <>
      <Head>
        {/* You can add preload links here if you identify critical images */}
      </Head>
      <main className="min-h-screen bg-background">
        <QuizForm />
      </main>
    </>
  );
}
