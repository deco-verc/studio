'use server';

import { personalizedDiagnosis } from '@/ai/flows/personalized-diagnosis';
import { generateCustomizedRecommendations } from '@/ai/flows/customized-recommendations';
import { redirect } from 'next/navigation';

export async function submitQuiz(answers: string[]) {
  try {
    // Run both AI flows in parallel on the server
    const [diagnosisResult, recommendationsResult] = await Promise.all([
      personalizedDiagnosis({ quizAnswers: answers }),
      generateCustomizedRecommendations({ quizResponses: answers }),
    ]);

    const results = {
      diagnosis: diagnosisResult.diagnosis,
      recommendations: recommendationsResult,
      answers,
    };

    // Encode the final results and redirect to the results page
    const encodedResults = encodeURIComponent(JSON.stringify(results));
    redirect(`/resultado?data=${encodedResults}`);
  } catch (error) {
    console.error('Error processing quiz analysis:', error);
    // Redirect to an error state on the quiz page if anything fails
    redirect('/quiz?error=analysis_failed');
  }
}

// This function is no longer needed on the client, as processing happens in submitQuiz
export async function getAnalysisResults(answers: string[]) {
  try {
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
    return { error: 'Failed to generate analysis. Please try again.' };
  }
}
