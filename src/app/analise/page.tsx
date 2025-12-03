'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { getAnalysisResults } from '@/app/actions';
import { gtmEvent } from '@/components/analytics/google-tag-manager';

export default function AnalisePage() {
  const [showButton, setShowButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [resultsData, setResultsData] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const answersParam = searchParams.get('answers');

    if (answersParam) {
      try {
        const answers = JSON.parse(decodeURIComponent(answersParam));
        // Trigger AI processing in the background
        getAnalysisResults(answers).then(results => {
          if (results.error) {
            console.error(results.error);
            router.push('/quiz?error=true'); // Redirect on error
          } else {
            setResultsData(encodeURIComponent(JSON.stringify(results)));
            setIsLoading(false); // AI processing is done
          }
        });
      } catch (e) {
        console.error("Failed to parse answers or get results", e);
        router.push('/quiz?error=true');
      }
    } else {
        // No answers, redirect back to quiz
        router.push('/quiz?error=missingData');
    }

    // This timer controls the button's visibility, independent of AI processing
    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 60000); // 1 minute delay

    return () => {
      clearTimeout(buttonTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleRedirect = () => {
    if (resultsData) {
      gtmEvent('vsl_cta_click', {});
      router.push(`/resultado?data=${resultsData}`);
    } else {
      // This can happen if the button is clicked before AI processing is complete
      // We'll show a loading state on the button to prevent this.
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="w-full max-w-4xl text-center space-y-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-headline text-primary">
          Estou analisando o seu perfil agora...
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Não feche essa página. Nesse video, eu vou te provar por que suas dietas falharam no passado e te entregar o caminho exato para resolver isso sem passar fome.
        </p>

        {/* VSL Placeholder */}
        <div className="aspect-video w-full bg-black rounded-lg shadow-2xl overflow-hidden">
          {/* In a real scenario, you would replace this with an iframe or a video player component */}
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-white">Seu vídeo (VSL) aqui</p>
          </div>
        </div>

        <div className="h-20 flex items-center justify-center">
          {showButton ? (
            <Button
              size="lg"
              className="w-full max-w-md bg-accent hover:bg-accent/90 text-accent-foreground text-xl md:text-2xl font-bold py-6 rounded-lg shadow-lg animate-pulse"
              onClick={handleRedirect}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  ANALISANDO...
                </>
              ) : (
                'VER MEU DIAGNÓSTICO COMPLETO'
              )}
            </Button>
          ) : (
            <div className="flex items-center text-muted-foreground text-lg">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Carregando seu botão de acesso...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
