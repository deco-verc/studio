'use server';

import { personalizedDiagnosis } from '@/ai/flows/personalized-diagnosis';
import { generateCustomizedRecommendations } from '@/ai/flows/customized-recommendations';
import { redirect } from 'next/navigation';

// This action now only redirects to the analysis page with the raw answers.
// The AI processing will be triggered on the analysis page.
export async function submitQuiz(answers: string[]) {
  const encodedAnswers = encodeURIComponent(JSON.stringify(answers));
  redirect(`/analise?answers=${encodedAnswers}`);
}

// This new action will be called from the analysis page to get the results.
export async function getAnalysisResults(answers: string[]) {
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

    return results;
  } catch (error) {
    console.error('Error processing quiz analysis:', error);
    // Return a specific error object that the client can handle
    return { error: 'Failed to generate analysis. Please try again.' };
  }
}
