
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { SocialProofCarousel } from '@/components/home/social-proof-carousel';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  const features = [
    'Como sair da Armadilha da Indústria Alimentícia que vicia o seu paladar em açúcar',
    'A mentira dos alimentos “light” e “fit” e por que muitos deles te fazem engordar',
    'A técnica simples que obriga seu corpo a usar a gordura acumulada como energia enquanto você dorme.',
    'O Botão que desliga sua fome emocional.',
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl lg:text-6xl/none font-headline text-black">
                    Emagreça <span className="text-green-600">até 3kg em 7 dias</span> com o <span className="text-red-600">Truque</span> que a <span className="text-red-600">Industria Alimentícia</span> utiliza para <span className="text-red-600">enganar</span> seu cérebro.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Sem passar fome e comendo suas comidas preferidas. Fique até o final para você descobrir:
                  </p>
                </div>
                <ul className="grid gap-3 py-4">
                  {features.map((feature, index) => (
                    <li key={index}>
                      <div className="flex items-start">
                        <CheckCircle className="mt-1 h-5 w-5 text-primary shrink-0" />
                        <span className="ml-3 text-muted-foreground">{feature}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-center justify-center space-y-6">
                {heroImage && (
                  <div className="w-full max-w-[400px] md:max-w-[500px] mx-auto">
                    <Image
                      src={heroImage.imageUrl}
                      width="500"
                      height="500"
                      alt={heroImage.description}
                      data-ai-hint={heroImage.imageHint}
                      className="aspect-square overflow-hidden rounded-xl object-cover shadow-[0_0_20px_cyan]"
                      priority
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2 text-center w-full max-w-md mx-auto">
                  <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-xl font-bold py-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform animate-pulse-shadow">
                    <Link href="/quiz">
                      FAZER TESTE GRATUITO
                    </Link>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 px-4">
                    🔒 Esse teste libera um conteúdo que não fica disponível publicamente. Apenas quem completa o questionário tem acesso ao protocolo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Mais de 10.516 mulheres seguiram esse mesmo protocolo a maioria começou exatamente onde você está agora.</h2>
              </div>
            </div>
            <SocialProofCarousel />
          </div>
        </section>
      </main>

      <footer className="flex items-center justify-center w-full h-20 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 CorpoLeve. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
