import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');
  const socialProofs = [
    PlaceHolderImages.find(p => p.id === 'socialProof1'),
    PlaceHolderImages.find(p => p.id === 'socialProof2'),
    PlaceHolderImages.find(p => p.id === 'socialProof3'),
    PlaceHolderImages.find(p => p.id === 'socialProof4'),
  ].filter(Boolean) as any[];

  const features = [
    'Como sair da Armadilha da Indústria Alimentícia que vicia o seu paladar em açúcar',
    'A Mentira dos Alimentos "Light e FIT" e como eles te engordam.',
    'A técnica simples que obriga seu corpo a usar a gordura acumulada como energia enquanto você dorme.',
    'O Botão dentro do seu corpo que desliga a Fome',
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl lg:text-6xl/none font-headline text-primary">
                    Emagreça até 3kg em 7 dias com o Truque que a Industria Alimentícia utiliza para enganar seu cérebro.
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
                      className="aspect-square overflow-hidden rounded-xl object-cover shadow-2xl"
                      priority
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2 text-center w-full max-w-md mx-auto">
                  <Link href="/quiz">
                    <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-xl font-bold py-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                      FAZER TESTE GRATUITO
                    </Button>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-2 px-4">
                    Esse teste é feito apenas uma vez por pessoa. Responda o teste para ver se você está apta a acessar um conteúdo exclusivo.
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
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">+10516 Corpos Transformados</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Veja o que aconteceu com mulheres que estavam na mesma situação que você.</h2>
              </div>
            </div>
            <div className="pb-8">
               <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto"
              >
                <CarouselContent>
                  {socialProofs.map((proof) => (
                    <CarouselItem key={proof.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4">
                      <div className="p-2">
                        <Card className="overflow-hidden rounded-lg shadow-md">
                          <CardContent className="p-0">
                            <Image
                              src={proof.imageUrl}
                              width="250"
                              height="500"
                              alt={proof.description}
                              data-ai-hint={proof.imageHint}
                              className="aspect-[1/2] w-full object-cover"
                            />
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex items-center justify-center w-full h-20 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 CorpoLeve. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
