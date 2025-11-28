'use server';

import { personalizedDiagnosis } from '@/ai/flows/personalized-diagnosis';
import { generateCustomizedRecommendations } from '@/ai/flows/customized-recommendations';
import { redirect } from 'next/navigation';

export async function submitQuiz(answers: string[]) {
  try {
    // Both AI flows can run in parallel
    const [diagnosisResult, recommendationsResult] = await Promise.all([
      personalizedDiagnosis({ quizAnswers: answers }),
      generateCustomizedRecommendations({ quizResponses: answers }),
    ]);

    const results = {
      diagnosis: diagnosisResult.diagnosis,
      recommendations: recommendationsResult,
      answers,
    };

    const encodedResults = encodeURIComponent(JSON.stringify(results));
    redirect(`/resultado?data=${encodedResults}`);
  } catch (error) {
    console.error('Error processing quiz:', error);
    // In case of an error, redirect back to the quiz with an error flag
    // The UI can then use this to show a message
    redirect('/quiz?error=true'); 
  }
}
