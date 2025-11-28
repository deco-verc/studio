import { ResultsPageClient } from '@/components/resultado/results-page-client';
import { Suspense } from 'react';
import Loading from '../loading';

type ResultsPageProps = {
  searchParams: { [key:string]: string | string[] | undefined };
};

function Resultados({ searchParams }: ResultsPageProps) {
  const dataParam = searchParams.data;

  if (!dataParam || typeof dataParam !== 'string') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-2xl font-bold text-destructive mb-4">Erro: Dados do resultado não encontrados.</h1>
        <p className="text-muted-foreground">Por favor, complete o teste para ver seus resultados.</p>
      </div>
    );
  }

  try {
    const results = JSON.parse(decodeURIComponent(dataParam));
    return <ResultsPageClient results={results} />;
  } catch (error) {
    console.error('Failed to parse results data:', error);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
            <h1 className="text-2xl font-bold text-destructive mb-4">Erro: Falha ao processar os resultados.</h1>
            <p className="text-muted-foreground">Ocorreu um problema ao analisar seus dados. Por favor, tente novamente.</p>
      </div>
    );
  }
}

export default function ResultadoPage(props: ResultsPageProps) {
  return (
    <Suspense fallback={<Loading />}>
      <Resultados {...props} />
    </Suspense>
  )
}
