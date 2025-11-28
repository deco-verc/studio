
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { CheckCircle, Gift, ShieldCheck } from 'lucide-react';
import type { CustomizedRecommendationsOutput } from '@/ai/flows/customized-recommendations';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Autoplay from "embla-carousel-autoplay"

interface Results {
  diagnosis: string;
  recommendations: CustomizedRecommendationsOutput;
  answers: string[];
}

interface ResultsPageClientProps {
  results: Results;
}

const chartData = Array.from({ length: 10 }, (_, i) => ({
    day: i * 3, 
    "Seu Nível de Inflamação": Math.max(15, 100 * Math.exp(-i * 0.4)), 
    name: i === 1 ? "Agora" : (i === 9 ? "Você Depois" : "")
}));


const faqs = [
    {
      q: "Eu não sei cozinhar / Tenho preguiça. Funciona pra mim?",
      a: "Sim! O método foi criado para a mulher moderna. As receitas são de \"panela única\" ou preparo rápido (menos de 20 minutos). Se você sabe ferver água, você consegue seguir o protocolo."
    },
    {
      q: "Os ingredientes são caros?",
      a: "Não. Você não vai precisar de farinha de amêndoas do Himalaia. Usamos o que tem no açougue e na feira: ovos, carnes, legumes e frutas. Você vai, na verdade, economizar no mercado."
    },
    {
      q: "Tenho mais de 50/60 anos e metabolismo lento. Adianta?",
      a: "É exatamente para você. O protocolo não depende da velocidade do seu metabolismo, mas da qualidade química do alimento. Ele foi desenhado para desinflamar corpos que sofreram com anos de alimentação industrializada."
    },
    {
      q: "E se eu tiver compulsão por doces?",
      a: "O Antídoto foi feito para isso. As receitas de doces funcionais vão saciar a química do seu cérebro sem disparar a insulina, permitindo que você coma o que gosta sem travar o emagrecimento."
    },
    {
        q: "Por que nunca ouvi falar disso antes?",
        a: "Porque essa informação é financeiramente perigosa para a Indústria Alimentícia. Se você souber que pode \"destravar\" seu metabolismo usando ingredientes baratos do mercado, você para de comprar os produtos \"Diet/Light\" caros e os remédios que eles vendem. A grande mídia é patrocinada por quem quer te manter inflamada. O que estou te entregando é o \"segredo de bastidores\" que nutricionistas de elite usam, mas que nunca chega na TV aberta porque vai contra o lucro dos gigantes."
    },
    {
        q: "E se eu não gostar?",
        a: "O risco é zero para você. Eu confio tanto neste protocolo que ofereço uma Garantia Blindada de 7 Dias. Você entra, acessa as receitas, faz o teste do jantar de desintoxicação... Se você não sentir suas roupas folgadas, ou se simplesmente não for com a minha cara, eu devolvo 100% do seu dinheiro. Sem letras miúdas e sem perguntas. Você só paga pelo que funciona."
    },
    {
        q: "Será que o produto funciona?",
        a: "Funciona porque ataca a causa raiz (a inflamação e o vício químico), e não apenas o sintoma (a gordura). Dietas comuns falham porque tentam vencer a biologia com \"força de vontade\". O nosso protocolo funciona porque usa a química a seu favor: ele desinflama as células para que elas soltem a gordura e silencia o \"ruído mental\" para que você não precise lutar contra a fome. Nossa Inteligência Artificial já validou esse método com milhares de perfis idênticos ao seu."
    },
    {
        q: "Será que isso dá certo para mim?",
        a: "Sim, principalmente se você sente que tem \"metabolismo lento\" ou \"genética ruim\". O protocolo foi desenhado especificamente para corpos que foram danificados por anos de alimentação industrializada e efeito sanfona. Não importa sua idade (30, 40 ou 60 anos) ou quantas vezes você já falhou antes. O método não depende do seu \"esforço\", ele depende da reação química dos alimentos no seu organismo. Se você come, você consegue aplicar."
    }
];

const bonusContent = [
    {
      title: 'O Guia "Anti-Falso Saudável"',
      id: 'bonus1',
      description: 'Nunca mais seja enganada por rótulos bonitos.'
    },
    {
      title: 'O Antídoto de Emergência',
      id: 'bonus2',
      description: 'Uma sequência de 3 bebidas naturais para limpar os receptores de açúcar.'
    },
    {
      title: 'Sobremesas que "Enganam" o Cérebro',
      id: 'bonus3',
      description: 'Sobremesas que dão o prazer que seu cérebro pede, mas sem disparar a insulina.'
    },
    {
      title: 'Manual da Economia no Mercado',
      id: 'bonus4',
      description: 'Como substituir ingredientes caros por versões baratas que têm o mesmo efeito químico.'
    },
];

export function ResultsPageClient({ results }: ResultsPageClientProps) {
  const [today, setToday] = useState('');

  useEffect(() => {
    const date = new Date();
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    setToday(formattedDate);
  }, []);

  const transformationImages = [
    'carousel1', 'carousel2', 'carousel3', 'carousel4', 'carousel5', 'carousel6', 'carousel7'
  ].map(id => PlaceHolderImages.find(p => p.id === id)).filter(Boolean) as any[];

  const foodImages = [
    'food1', 'food2', 'food3', 'food4', 'food5', 'food6', 'food7', 'food8'
  ].map(id => PlaceHolderImages.find(p => p.id === id)).filter(Boolean) as any[];
  
  const foodAutoplay = useRef(
    Autoplay({ delay: 1500, stopOnInteraction: false })
  );
  
  const socialProofAutoplay = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-primary/10 py-12 md:py-20">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight sm:text-4xl lg:text-6xl/none font-headline text-blue-600 mb-4">DIAGNÓSTICO CONFIRMADO</h1>
                <p className="text-lg md:text-2xl max-w-3xl mx-auto text-foreground/80">
                    O seu metabolismo <span className="font-bold">NÃO</span> está "velho" ou "quebrado". Ele foi <span className="font-bold text-destructive">Bloqueado pela Química das Indústrias.</span>
                </p>
            </div>
        </section>
        
        {/* Main Content Section */}
        <section className="py-12 md:py-20">
            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    {/* Diagnosis */}
                    <Card className="shadow-lg border-none bg-card">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Sua Análise Personalizada</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-lg text-foreground/90">
                            <p>Eu sei exatamente o que você pensou quando viu o resultado desse quiz.</p>
                            <p>Você pensou em todas as vezes que recusou um jantar com amigos para não sair da dieta. Pensou nos horas de esteira, nos chás amargos e na frustração de subir na balança e ver o peso subindo. É uma sensação horrível que eu também já senti.</p>
                            <p className="font-semibold text-primary">Mas existe uma maneira de consertar isso. E não é parando de comer.</p>
                            <p>Pelo contrário: você precisa comer. Mas precisa comer os nutrientes certos, na combinação exata, para formatar o seu paladar e obrigar o seu corpo a usar a gordura estocada como combustível novamente.</p>
                        </CardContent>
                    </Card>

                    {/* Chart */}
                    <Card className="shadow-lg border-none bg-card">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Seu Metabolismo: Antes e Depois</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="w-full h-[300px]">
                                <ResponsiveContainer>
                                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                        <XAxis 
                                            dataKey="name" 
                                            stroke="hsl(var(--muted-foreground))" 
                                            fontSize={12} 
                                            tickLine={false} 
                                            axisLine={false} 
                                            interval={0}
                                        />
                                        <YAxis 
                                            stroke="hsl(var(--muted-foreground))" 
                                            fontSize={12} 
                                            tickLine={false} 
                                            axisLine={false} 
                                            tickFormatter={(value) => `${Math.round(value)}%`} 
                                        />
                                        <Tooltip 
                                            cursor={{fill: 'hsla(var(--accent) / 0.1)'}} 
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--background))', 
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: 'var(--radius)'
                                            }}
                                            labelFormatter={(label) => label ? `Dia ${label}` : ''}
                                            formatter={(value: number) => [`${value.toFixed(0)}%`, "Inflamação"]}
                                        />
                                        <Legend wrapperStyle={{fontSize: "14px"}}/>
                                        <Line 
                                            type="monotone" 
                                            dataKey="Seu Nível de Inflamação" 
                                            stroke="hsl(var(--primary))" 
                                            strokeWidth={3}
                                            dot={false}
                                            activeDot={{ r: 8, strokeWidth: 2, fill: 'hsl(var(--primary))' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                     {/* Offer */}
                    <Card className="shadow-lg bg-primary/5 border-primary">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl text-primary">O que você recebe ao desbloquear seu acesso:</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <ul className="space-y-3 text-lg">
                                <li className="flex items-start"><CheckCircle className="h-6 w-6 text-primary mr-3 mt-1 shrink-0"/> <span><span className="font-bold">Receitas que Enganam seu Cérebro:</span> 200+ opções deliciosas.</span></li>
                                <li className="flex items-start"><CheckCircle className="h-6 w-6 text-primary mr-3 mt-1 shrink-0"/> <span><span className="font-bold">O Detox de Gorduras:</span> Um plano para limpar seu corpo.</span></li>
                                <li className="flex items-start"><CheckCircle className="h-6 w-6 text-primary mr-3 mt-1 shrink-0"/> <span><span className="font-bold">A Ativação da Queima Noturna:</span> Emagreça enquanto dorme.</span></li>
                            </ul>
                             <Carousel
                                opts={{ align: "start", loop: true }}
                                plugins={[foodAutoplay.current]}
                                className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto pt-4"
                            >
                                <CarouselContent>
                                    {foodImages.map((img, index) => (
                                        <CarouselItem key={index} className="sm:basis-1/2 md:basis-1/3">
                                            <div className="p-1">
                                                <Card className="border-none">
                                                    <CardContent className="flex aspect-square items-center justify-center p-0 rounded-lg overflow-hidden">
                                                        <Image src={img.imageUrl} alt={img.description} width={400} height={400} className="object-cover w-full h-full" data-ai-hint={img.imageHint} />
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="hidden sm:flex" />
                                <CarouselNext className="hidden sm:flex" />
                            </Carousel>
                        </CardContent>
                    </Card>

                </div>
                
                {/* Sidebar with recommendations */}
                <aside className="space-y-8 lg:sticky top-8 self-start">
                     <Card className="shadow-lg bg-accent/10 border-accent/50">
                        <CardHeader>
                            <CardTitle className="font-headline text-xl md:text-2xl text-accent-foreground flex items-center"><Gift className="mr-2"/> Seus Bônus Exclusivos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-foreground/80">Baseado nas suas respostas, estes são os materiais que mais vão te ajudar:</p>
                             <ul className="space-y-4">
                                {bonusContent.map(bonus => (
                                    <li key={bonus.id} className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-primary mr-3 mt-1 shrink-0"/>
                                        <div>
                                            <p className={`font-semibold ${results.recommendations.recommendedBonusContent.includes(bonus.title) ? 'text-foreground' : 'text-muted-foreground'}`}>{bonus.title}</p>
                                            <p className={`text-sm ${results.recommendations.recommendedBonusContent.includes(bonus.title) ? 'text-foreground/80' : 'text-muted-foreground/80'}`}>{bonus.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </section>

        {/* Price Anchor Section */}
        <section className="py-12 md:py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <Card className="bg-destructive text-destructive-foreground p-3 mb-4 rounded-lg shadow-lg">
                        <p className="font-bold text-lg">{`OFERTA BLACK FRIDAY (${today} - 23:59)`}</p>
                    </Card>
                    <Card className="p-6 md:p-10 bg-primary/5 shadow-2xl border-2 border-accent">
                        <CardHeader>
                            <CardTitle className="font-headline text-3xl md:text-5xl !mt-2">Acesso Imediato ao Protocolo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="my-4">
                                <p className="text-4xl md:text-5xl font-bold text-muted-foreground line-through">De R$147,00</p>
                                <p className="text-lg text-muted-foreground mt-1">Por apenas</p>
                                <p className="text-6xl md:text-8xl font-black text-primary my-2">
                                    R$47<span className="text-4xl md:text-6xl align-top">,90</span>
                                </p>
                            </div>
                            <Button size="lg" className="w-full max-w-md bg-accent hover:bg-accent/90 text-accent-foreground text-xl md:text-2xl font-bold py-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform animate-pulse">
                                COMPRAR COM DESCONTO
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        {/* Action Section */}
        <section className="bg-primary text-primary-foreground py-12 md:py-20">
            <div className="container mx-auto px-4 text-center space-y-6">
                 <div className="flex items-center justify-center space-x-4 text-lg">
                    <ShieldCheck className="h-10 w-10 shrink-0"/>
                    <div>
                        <p className="font-bold">Garantia Incondicional de 7 Dias</p>
                        <p className="text-sm max-w-xl mx-auto">Tenho tanta certeza de que este método vai funcionar para o seu perfil que faço questão de te dar uma garantia incondicional. Se você não gostar, ou achar que não é para você, eu devolvo 100% do seu dinheiro. Sem perguntas e objeções.</p>
                    </div>
                 </div>
            </div>
        </section>

        {/* Social Proof Carousel */}
        <section className="py-12 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-black tracking-tight sm:text-5xl font-headline mb-4">Elas Tinham as Mesmas Dificuldades que Você</h2>
                     <p className="text-lg max-w-3xl mx-auto text-muted-foreground">Nossa inteligência artificial identificou um padrão. As suas respostas no quiz foram 97% parecidas com as delas. Elas enfrentavam as mesmas dificuldades que você enfrenta hoje, mas veja o que aconteceu depois que elas se reprogramaram seus cérebros.</p>
                </div>
                <Carousel 
                    className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto"
                    plugins={[socialProofAutoplay.current]}
                    opts={{ align: "start", loop: true }}
                >
                    <CarouselContent>
                        {transformationImages.map((img, index) => (
                        <CarouselItem key={index} className="sm:basis-1/2 md:basis-1/3">
                            <div className="p-1">
                            <Card className="border-none">
                                <CardContent className="flex aspect-square items-center justify-center p-0 rounded-lg overflow-hidden">
                                     <Image src={img.imageUrl} alt={img.description} width={400} height={400} className="object-cover w-full h-full" data-ai-hint={img.imageHint} />
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
        </section>
        
        {/* FAQ Section */}
        <section className="bg-primary/5 py-12 md:py-24">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight sm:text-5xl font-headline text-center mb-12">Perguntas Frequentes</h2>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem value={`item-${index}`} key={index} className="bg-card border-none rounded-lg shadow-sm mb-4 px-6">
                            <AccordionTrigger className="text-lg text-left font-semibold hover:no-underline">{faq.q}</AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground pt-2">
                            {faq.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                <div className="text-center mt-12">
                     <Button size="lg" className="w-full max-w-md bg-accent hover:bg-accent/90 text-accent-foreground text-xl md:text-2xl font-bold py-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                        ESTOU PREPARADA PARA COMPRAR
                    </Button>
                </div>
            </div>
        </section>
      </main>
      <footer className="flex items-center justify-center w-full h-20 border-t border-primary/10">
        <p className="text-xs text-muted-foreground">&copy; 2024 CorpoLeve. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

    
    

    