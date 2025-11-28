'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { AlertCircle, CheckCircle, Gift, ShieldCheck } from 'lucide-react';
import type { CustomizedRecommendationsOutput } from '@/ai/flows/customized-recommendations';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface Results {
  diagnosis: string;
  recommendations: CustomizedRecommendationsOutput;
  answers: string[];
}

interface ResultsPageClientProps {
  results: Results;
}

const chartData = [
  { name: 'Antes', "Nível de Inflamação": 95, fill: 'hsl(var(--destructive))' },
  { name: 'Depois', "Nível de Inflamação": 25, fill: 'hsl(var(--primary))' },
];

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
  }
];

const bonusContent = [
    { title: "O Guia \"Anti-Falso Saudável\"", id: 'bonus1' },
    { title: "O Antídoto de Emergência", id: 'bonus2' },
    { title: "Sobremesas que \"Enganam\" o Cérebro", id: 'bonus3' },
    { title: "Manual da Economia no Mercado", id: 'bonus4' },
]

export function ResultsPageClient({ results }: ResultsPageClientProps) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 60000); // 60 seconds
    return () => clearTimeout(timer);
  }, []);

  const carouselImages = [
    'carousel1', 'carousel2', 'carousel3', 'carousel4', 'carousel5', 'carousel6', 'carousel7'
  ].map(id => PlaceHolderImages.find(p => p.id === id)).filter(Boolean) as any[];


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-primary/10 py-12 md:py-20">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-3xl md:text-5xl font-bold font-headline text-primary-foreground mb-4">DIAGNÓSTICO CONFIRMADO</h1>
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
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Sua Análise Personalizada</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-lg text-foreground/90">
                            <p>Eu sei exatamente o que você pensou quando viu o resultado desse quiz.</p>
                            <p className="italic">"{results.diagnosis}"</p>
                            <p>Você pensou em todas as vezes que recusou um jantar com amigos para não sair da dieta. Pensou nas horas de esteira, nos chás amargos e na frustração de subir na balança e ver o peso subindo. É uma sensação horrível que eu também já senti.</p>
                            <p className="font-semibold">Mas existe uma maneira de consertar isso. E não é parando de comer.</p>
                            <p>Pelo contrário: você precisa comer. Mas precisa comer os nutrientes certos, na combinação exata, para formatar o seu paladar e obrigar o seu corpo a usar a gordura estocada como combustível novamente.</p>
                        </CardContent>
                    </Card>

                    {/* Chart */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Seu Metabolismo: Antes e Depois</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="w-full h-[300px]">
                                <ResponsiveContainer>
                                    <BarChart data={chartData}>
                                        <XAxis dataKey="name" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}} />
                                        <Bar dataKey="Nível de Inflamação" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                     {/* Offer */}
                    <Card className="shadow-lg bg-primary/5 border-primary">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl text-primary-foreground">O que você recebe ao desbloquear seu acesso:</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="space-y-2 text-lg">
                                <li className="flex items-start"><CheckCircle className="h-6 w-6 text-primary mr-2 mt-1 shrink-0"/> <span><span className="font-bold">Receitas que Enganam seu Cérebro:</span> 200+ opções deliciosas.</span></li>
                                <li className="flex items-start"><CheckCircle className="h-6 w-6 text-primary mr-2 mt-1 shrink-0"/> <span><span className="font-bold">O Detox de Gorduras:</span> Um plano para limpar seu corpo.</span></li>
                                <li className="flex items-start"><CheckCircle className="h-6 w-6 text-primary mr-2 mt-1 shrink-0"/> <span><span className="font-bold">A Ativação da Queima Noturna:</span> Emagreça enquanto dorme.</span></li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Sidebar with recommendations */}
                <aside className="space-y-8">
                     <Card className="shadow-lg bg-accent/10 border-accent sticky top-8">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl text-accent-foreground flex items-center"><Gift className="mr-2"/> Seus Bônus Exclusivos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-foreground/80">Baseado nas suas respostas, estes são os materiais que mais vão te ajudar:</p>
                            <ul className="space-y-3">
                                {bonusContent.map(bonus => (
                                    <li key={bonus.id} className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0"/>
                                        <span className={`font-medium ${results.recommendations.recommendedBonusContent.includes(bonus.title) ? 'text-foreground' : 'text-muted-foreground'}`}>{bonus.title}</span>
                                    </li>
                                ))}
                            </ul>
                             <p className="mt-4 text-sm text-foreground/70 italic">{results.recommendations.reasoning}</p>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </section>

        {/* Action Section */}
        <section className="bg-primary text-primary-foreground py-12 md:py-20">
            <div className="container mx-auto px-4 text-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">A ÚNICA BARREIRA ENTRE VOCÊ E SEU NOVO CORPO FOI REMOVIDA</h2>
                <p className="text-lg max-w-3xl mx-auto">Eu decidi remover a única barreira que restava entre você e o corpo que você merece: o dinheiro. Mas atenção: essa é uma Condição de Exceção. Assim que o lote de Black Friday encerrar, o valor voltará ao normal sem aviso prévio.</p>
                <div className="h-20 flex items-center justify-center">
                    {showButton ? (
                        <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 animate-pulse text-xl py-8 px-12">
                            QUERO ACESSAR COM DESCONTO AGORA
                        </Button>
                    ) : (
                        <div className="text-lg">Assista o vídeo acima... seu acesso será liberado em breve.</div>
                    )}
                </div>
                 <div className="flex items-center justify-center space-x-2 text-lg">
                    <ShieldCheck className="h-8 w-8"/>
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
                     <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Elas Tinham as Mesmas Dificuldades que Você</h2>
                     <p className="text-lg max-w-3xl mx-auto text-muted-foreground">Nossa inteligência artificial identificou um padrão. As suas respostas no quiz foram 97% parecidas com as delas. Elas enfrentavam as mesmas dificuldades que você enfrenta hoje, mas veja o que aconteceu depois que elas se reprogramaram seus cérebros.</p>
                </div>
                <Carousel className="w-full max-w-4xl mx-auto">
                    <CarouselContent>
                        {carouselImages.map((img, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-0 rounded-lg overflow-hidden">
                                     <Image src={img.imageUrl} alt={img.description} width={400} height={400} className="object-cover w-full h-full" data-ai-hint={img.imageHint} />
                                </CardContent>
                            </Card>
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </section>
        
        {/* FAQ Section */}
        <section className="bg-secondary/50 py-12 md:py-24">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Perguntas Frequentes</h2>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-lg text-left">{faq.q}</AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground">
                            {faq.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
      </main>
      <footer className="flex items-center justify-center w-full h-16 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 CorpoLeve. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
