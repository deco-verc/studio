import { ResultsPageClient } from '@/components/resultado/results-page-client';
import { Suspense } from 'react';
import Loading from '../loading';
import { generateCustomizedRecommendations } from '@/ai/flows/customized-recommendations';
import { personalizedDiagnosis } from '@/ai/flows/personalized-diagnosis';

// Dummy data for rendering while the real data is being fetched or if fetching fails.
const fallbackRecommendations: any = {
  recommendedRecipes: [],
  recommendedBonusContent: [],
  reasoning: '',
};

const fallbackResults = {
  diagnosis: 'Análise detalhada sobre como a indústria pode ter impactado seu metabolismo.',
  recommendations: fallbackRecommendations,
  answers: [],
};


export default function ResultadoPage() {
  // This page now directly renders the VSL content.
  // The complex data fetching logic has been removed.
  return (
    <Suspense fallback={<Loading />}>
      <ResultsPageClient results={fallbackResults} />
    </Suspense>
  )
}

    