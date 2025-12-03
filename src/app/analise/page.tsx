
import { Loader2 } from 'lucide-react';

export default function AnalisePage() {
  // This page now serves as a visual loading indicator.
  // The actual data processing and redirection happens in the server action.
  // Next.js will show the loading.tsx file during the server action's execution,
  // and then transition to the results page. This page is a fallback view
  // in case the transition takes an observable amount of time or if JS is disabled.

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="w-full max-w-4xl text-center space-y-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-headline text-primary">
          Analisando seu perfil...
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Isso pode levar um momento. Por favor, não feche esta página.
        </p>

        <div className="flex items-center justify-center text-muted-foreground text-lg h-20">
          <Loader2 className="mr-4 h-8 w-8 animate-spin" />
          Processando suas respostas...
        </div>

        {/* You can keep the VSL or a placeholder here if desired */}
        <div className="aspect-video w-full bg-black rounded-lg shadow-2xl overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-white">Um vídeo de espera pode ser exibido aqui.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
