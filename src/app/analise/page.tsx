'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function AnalisePage() {
  const [showButton, setShowButton] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const data = searchParams.get('data');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 60000); // 1 minute delay

    return () => clearTimeout(timer);
  }, []);

  const handleRedirect = () => {
    if (data) {
      router.push(`/resultado?data=${data}`);
    } else {
      // Fallback if data is somehow missing
      router.push('/quiz?error=true');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="w-full max-w-4xl text-center space-y-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-headline text-primary">
          Estou analisando o seu perfil agora... e já posso te adiantar: a culpa não é sua.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Por favor, não feche essa página. No vídeo abaixo, eu vou te provar por que suas dietas falharam no passado e te entregar o caminho exato para resolver isso sem passar fome.
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
              className="w-full max-w-md bg-green-600 hover:bg-green-700 text-white text-2xl font-bold py-8 rounded-lg shadow-lg animate-pulse"
              onClick={handleRedirect}
            >
              VER MEU DIAGNÓSTICO COMPLETO
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
