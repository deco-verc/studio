import { QuizForm } from '@/components/quiz/quiz-form';
import { quizQuestions } from '@/components/quiz/quiz-questions';
import Head from 'next/head';

export default function QuizPage() {
  const imagesToPreload = quizQuestions
    .slice(1) // Skip the first question's images, they will be prioritized
    .flatMap(q => 
      [
        ...(q.options.map(o => o.avatar).filter(Boolean) as string[]),
        q.imageBelowTitle
      ].filter(Boolean) as string[]
    );
  const uniqueImages = [...new Set(imagesToPreload)];

  return (
    <>
      <Head>
        {uniqueImages.map((src) => (
          <link key={src} rel="preload" as="image" href={src} />
        ))}
      </Head>
      <main className="min-h-screen bg-background">
        <QuizForm />
      </main>
    </>
  );
}

    