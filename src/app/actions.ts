'use server';

import { personalizedDiagnosis } from '@/ai/flows/personalized-diagnosis';
import { generateCustomizedRecommendations } from '@/ai/flows/customized-recommendations';
import { redirect } from 'next/navigation';


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
    // Propagate a more informative error message
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate analysis. Please try again.';
    gtmEvent('analysis_failed', { error: errorMessage });
    return { error: `Análise falhou: ${errorMessage}` };
  }
}

// Helper to pass GTM events from server actions
import { gtmEvent } from '@/components/analytics/google-tag-manager';
