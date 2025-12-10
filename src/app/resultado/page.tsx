'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CheckCircle2, XCircle, Flame, Brain, Utensils, Leaf, ShieldCheck, Gift, AlertTriangle, Check, Zap, Star, Lock, CreditCard } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Autoplay from "embla-carousel-autoplay"
import { gtmEvent } from '@/components/analytics/google-tag-manager';
import { useSearchParams } from 'next/navigation';
import Loading from '../loading';

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

function StickyCTA({ checkoutUrl, onPurchase }: { checkoutUrl: string, onPurchase: () => void }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 md:hidden animate-slide-up">
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <p className="text-xs text-muted-foreground line-through">De R$ 147,00</p>
                    <p className="text-lg font-black text-primary leading-none">R$ 47,90</p>
                </div>
                <Link href={checkoutUrl} onClick={onPurchase} className="flex-1">
                    <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg animate-pulse">
                        QUERO EMAGRECER
                    </Button>
                </Link>
            </div>
        </div>
    );
}

function ResultsPageClient() {
    const [today, setToday] = useState('');
    const [showStickyCTA, setShowStickyCTA] = useState(false);

    useEffect(() => {
        const date = new Date();
        const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        setToday(formattedDate);

        // Fire view event
        gtmEvent('sales_page_view', {
            page_title: 'Resultado - Protocolo'
        });

        const handleScroll = () => {
            // Show sticky CTA after scrolling past the first screen (approx 600px)
            if (window.scrollY > 600) {
                setShowStickyCTA(true);
            } else {
                setShowStickyCTA(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const transformationImages = [
        'carousel1', 'carousel2', 'carousel3', 'carousel4', 'carousel5', 'carousel6', 'carousel7'
    ].map(id => PlaceHolderImages.find(p => p.id === id)).filter(Boolean) as any[];

    const foodImages = [
        'food1', 'food2', 'food3', 'food4', 'food5', 'food6', 'food7', 'food8'
    ].map(id => PlaceHolderImages.find(p => p.id === id)).filter(Boolean) as any[];

    const foodAutoplay = useRef(
        Autoplay({ delay: 2000, stopOnInteraction: false })
    );

    const socialProofAutoplay = useRef(
        Autoplay({ delay: 3000, stopOnInteraction: false })
    );

    const checkoutUrl = "https://www.ggcheckout.com/checkout/v2/XbM3xPUK4EeHhHwn4Kzs";

    const handlePurchaseClick = (location: string) => {
        gtmEvent('sales_cta_click', {
            value: 47.90,
            currency: 'BRL',
            location: location
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-background font-sans pb-20 md:pb-0">
            <main className="flex-1">

                {/* Section 1: Analysis Results (Hook) */}
                <section className="py-8 md:py-12 bg-secondary/20">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground">Sua análise personalizada revelou:</h2>
                        </div>

                        <Card className="border-none shadow-xl bg-card overflow-hidden">
                            <div className="bg-primary/10 p-4 border-b border-primary/20">
                                <h3 className="text-xl font-bold text-primary flex items-center justify-center gap-2">
                                    <Zap className="w-6 h-6" /> Seu perfil indica:
                                </h3>
                            </div>
                            <CardContent className="p-6 md:p-8 space-y-8">

                                {/* Visual Diagnosis: Metabolic Thermometer */}
                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                    <h4 className="font-bold text-lg text-center mb-4 text-slate-700">Saúde Metabólica Atual</h4>
                                    <div className="relative pt-6 pb-2">
                                        <div className="h-4 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded-full w-full"></div>
                                        <div className="absolute top-0 left-[20%] -translate-x-1/2 flex flex-col items-center">
                                            <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded mb-1 shadow-sm">VOCÊ</div>
                                            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-600"></div>
                                        </div>
                                        <div className="flex justify-between text-xs font-medium text-slate-500 mt-2">
                                            <span>Crítico</span>
                                            <span>Alerta</span>
                                            <span>Ideal</span>
                                        </div>
                                    </div>
                                    <p className="text-center text-sm text-red-600 font-medium mt-3 bg-red-50 py-2 rounded-lg">
                                        ⚠️ Seu metabolismo está operando com apenas 30% da capacidade.
                                    </p>
                                </div>

                                <ul className="space-y-4">
                                    <li className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border/50 shadow-sm">
                                        <div className="bg-red-100 p-2 rounded-full shrink-0">
                                            <AlertTriangle className="w-6 h-6 text-red-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-foreground">Metabolismo Lento</h4>
                                            <p className="text-muted-foreground">Dificuldade de processar carboidratos refinados.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border/50 shadow-sm">
                                        <div className="bg-red-100 p-2 rounded-full shrink-0">
                                            <Flame className="w-6 h-6 text-red-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-foreground">Inflamação Silenciosa</h4>
                                            <p className="text-muted-foreground">Tendência à inflamação sistêmica que bloqueia a queima de gordura.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border/50 shadow-sm">
                                        <div className="bg-red-100 p-2 rounded-full shrink-0">
                                            <ShieldCheck className="w-6 h-6 text-red-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-foreground">Modo de Defesa</h4>
                                            <p className="text-muted-foreground">Seu corpo está estocando gordura como mecanismo de proteção.</p>
                                        </div>
                                    </li>
                                </ul>

                                <div className="bg-accent/10 p-6 rounded-xl border border-accent/30 text-center">
                                    <h4 className="text-xl font-bold text-accent-foreground mb-2 flex items-center justify-center gap-2">
                                        <Brain className="w-6 h-6" /> Traduzindo:
                                    </h4>
                                    <p className="text-lg text-foreground/80 leading-relaxed">
                                        <span className="font-bold">Não é falta de esforço.</span> Seu corpo está inflamado e viciado.
                                        É por isso que dietas comuns e exercícios extremos não funcionam para você.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Section 2: Exclusive Plan (Solution) */}
                <section className="py-8 md:py-12 bg-background">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-5xl font-headline font-black text-primary mt-4">Seu Plano Exclusivo</h2>
                            <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">Criamos o protocolo ideal para o seu perfil.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-6">
                                <p className="text-lg text-foreground/90">
                                    Um plano alimentar com <span className="font-bold bg-yellow-100 px-1">200 receitas simples, gostosas e acessíveis</span> — desenvolvidas para:
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        "Desinflamar suas células",
                                        "Reduzir o vício em açúcar e industrializados",
                                        "Reprogramar seu metabolismo",
                                        "Eliminar a fome emocional",
                                        "Emagrecer naturalmente (2 a 3kg nos primeiros 7 dias)"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-lg font-medium">
                                            <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-secondary/30 p-8 rounded-2xl space-y-4 border border-secondary">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-500 rounded-full p-1">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-lg font-bold text-foreground">Sem treinos exaustivos</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-500 rounded-full p-1">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-lg font-bold text-foreground">Sem dieta restritiva</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-500 rounded-full p-1">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-lg font-bold text-foreground">Sem cortar suas comidas preferidas</span>
                                </div>
                                <div className="mt-6 pt-6 border-t border-secondary-foreground/10">
                                    <p className="text-sm text-center text-muted-foreground italic">
                                        "O método que se adapta a você, não o contrário."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: What You Will Eat (Visuals) */}
                <section className="py-8 md:py-12 bg-primary/5">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-5xl font-headline font-black text-foreground mt-4">O Que Você Vai Comer</h2>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-10 items-center">
                            <div className="order-2 lg:order-1">
                                <Carousel
                                    opts={{ align: "start", loop: true }}
                                    plugins={[foodAutoplay.current]}
                                    className="w-full max-w-md mx-auto"
                                >
                                    <CarouselContent>
                                        {foodImages.map((img, index) => (
                                            <CarouselItem key={index}>
                                                <div className="p-1">
                                                    <Card className="border-none shadow-lg">
                                                        <CardContent className="flex aspect-square items-center justify-center p-0 rounded-xl overflow-hidden">
                                                            <Image src={img.imageUrl} alt={img.description} width={500} height={500} className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" />
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <div className="flex justify-center mt-4 gap-2">
                                        <CarouselPrevious className="static translate-y-0" />
                                        <CarouselNext className="static translate-y-0" />
                                    </div>
                                </Carousel>
                            </div>
                            <div className="order-1 lg:order-2 space-y-6">
                                <h3 className="text-2xl font-bold text-primary">Exemplos de receitas incluídas:</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-border/50">
                                        <div className="bg-orange-100 p-2 rounded-full">
                                            <Utensils className="w-6 h-6 text-orange-600" />
                                        </div>
                                        <span className="text-lg font-bold">Café da Manhã Anti-inflamatório</span>
                                    </li>
                                    <li className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-border/50">
                                        <div className="bg-green-100 p-2 rounded-full">
                                            <Leaf className="w-6 h-6 text-green-600" />
                                        </div>
                                        <span className="text-lg font-bold">Almoço Metabólico</span>
                                    </li>
                                    <li className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-border/50">
                                        <div className="bg-purple-100 p-2 rounded-full">
                                            <Utensils className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <span className="text-lg font-bold">Jantar Detox</span>
                                    </li>
                                    <li className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-border/50">
                                        <div className="bg-yellow-100 p-2 rounded-full">
                                            <Zap className="w-6 h-6 text-yellow-600" />
                                        </div>
                                        <span className="text-lg font-bold">Suco Tira-Fome</span>
                                    </li>
                                    <li className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-border/50">
                                        <div className="bg-pink-100 p-2 rounded-full">
                                            <Gift className="w-6 h-6 text-pink-600" />
                                        </div>
                                        <span className="text-lg font-bold">Sobremesas que "enganam" o cérebro</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 4: Social Proof */}
                <section className="py-8 md:py-12 bg-secondary/20">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-5xl font-headline font-black text-foreground mt-4">Mulheres Reais</h2>
                            <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
                                Elas estavam como você. Hoje, vivem leves e livres.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/50 mb-8 text-center max-w-3xl mx-auto">
                            <p className="text-lg md:text-xl font-medium text-foreground">
                                📊 Seus sintomas foram <span className="font-bold text-primary">97% parecidos</span> com os de mais de 10.000 alunas que já transformaram seus corpos com o protocolo.
                            </p>
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
                                            <Card className="border-none shadow-md">
                                                <CardContent className="flex aspect-square items-center justify-center p-0 rounded-lg overflow-hidden">
                                                    <Image src={img.imageUrl} alt={img.description} width={400} height={400} className="object-cover w-full h-full" />
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

                {/* Section 5: Bonuses (Value Stacking) */}
                <section className="py-8 md:py-12 bg-background">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-5xl font-headline font-black text-foreground mt-4">Seus BÔNUS Exclusivos de Black Friday</h2>
                            <p className="text-xl text-destructive font-bold mt-2 animate-pulse">Só disponíveis até hoje, 23:59</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-card border-primary/20 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-bl-lg">
                                    GRÁTIS
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold text-primary flex items-start gap-2">
                                        <Gift className="w-6 h-6 shrink-0" /> Guia Anti-Falso Saudável
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground mb-2">A lista de compras secreta com alimentos acessíveis que realmente ajudam a emagrecer.</p>
                                    <p className="text-sm font-bold text-gray-400 line-through">Valor: R$ 19,90</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-card border-primary/20 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-bl-lg">
                                    GRÁTIS
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold text-primary flex items-start gap-2">
                                        <Gift className="w-6 h-6 shrink-0" /> Antídoto de Emergência
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground mb-2">3 bebidas naturais para limpar seus receptores de açúcar e cortar a vontade de doce.</p>
                                    <p className="text-sm font-bold text-gray-400 line-through">Valor: R$ 27,90</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-card border-primary/20 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-bl-lg">
                                    GRÁTIS
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold text-primary flex items-start gap-2">
                                        <Gift className="w-6 h-6 shrink-0" /> Sobremesas que Enganam o Cérebro
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground mb-2">Doces que dão prazer sem disparar a insulina.</p>
                                    <p className="text-sm font-bold text-gray-400 line-through">Valor: R$ 17,90</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-card border-primary/20 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-bl-lg">
                                    GRÁTIS
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold text-primary flex items-start gap-2">
                                        <Gift className="w-6 h-6 shrink-0" /> Manual da Economia no Mercado
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground mb-2">Substituições baratas com o mesmo efeito desinflamatório.</p>
                                    <p className="text-sm font-bold text-gray-400 line-through">Valor: R$ 9,90</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="mt-8 text-center bg-green-50 p-4 rounded-xl border border-green-200">
                            <p className="text-lg text-green-800">
                                <span className="font-bold">Total em Bônus:</span> <span className="line-through opacity-70">R$ 75,60</span> <span className="font-black text-xl ml-2">GRÁTIS HOJE</span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 6: What You Will Receive */}
                <section className="py-8 md:py-12 bg-primary text-primary-foreground">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-5xl font-headline font-black text-white mt-4">O Que Você Vai Receber</h2>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20 shadow-2xl">
                            <ul className="space-y-4">
                                {[
                                    "200 Receitas desinflamatórias",
                                    "Cardápios prontos semanais",
                                    "Lista de compras práticas",
                                    "Guia anti-vício em doces",
                                    "Receitas rápidas (20 minutos ou menos)",
                                    "Acesso vitalício + atualizações"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-xl font-bold text-white">
                                        <div className="bg-white rounded-full p-1 shrink-0">
                                            <Check className="w-5 h-5 text-primary" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Section 7: OFFER SECTION (Grand Finale) */}
                <section className="py-12 md:py-16 bg-gradient-to-b from-background to-secondary/20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            {/* Mockup Image */}
                            <div className="mb-8 relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 h-20 bottom-0 top-auto"></div>
                                <Image
                                    src="https://i.imgur.com/2SvkrU6.jpeg"
                                    alt="Protocolo 200 Receitas Completo"
                                    width={800}
                                    height={400}
                                    className="mx-auto rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Offer Card */}
                            <div className="relative z-20 -mt-12">
                                <div className="bg-[#ef4444] text-white font-bold text-xl md:text-2xl py-3 rounded-t-xl shadow-lg uppercase tracking-wide flex justify-between items-center px-4 md:px-8">
                                    <span>OFERTA BLACK FRIDAY ({today})</span>
                                    <span className="bg-[#22c55e] text-white px-3 py-1 rounded-full text-sm md:text-base animate-pulse">70% OFF</span>
                                </div>
                                <Card className="border-4 border-[#22c55e] bg-[#fdfbf7] shadow-2xl rounded-b-xl rounded-t-none overflow-hidden">
                                    <CardContent className="p-8 md:p-12 space-y-6">
                                        <h3 className="text-3xl md:text-5xl font-headline font-black text-[#15803d] leading-tight">
                                            Acesso Imediato ao Protocolo
                                        </h3>

                                        <div className="space-y-2">
                                            <p className="text-3xl md:text-4xl font-bold text-gray-400 line-through decoration-red-500 decoration-2">
                                                De R$147,00
                                            </p>
                                            <p className="text-xl text-gray-600 font-medium">Por apenas</p>
                                            <div className="flex items-center justify-center gap-1 text-[#15803d]">
                                                <span className="text-6xl md:text-8xl font-black tracking-tighter">R$47</span>
                                                <span className="text-4xl md:text-5xl font-bold mt-2">,90</span>
                                            </div>
                                            <p className="text-sm text-gray-500">ou 5x de R$ 10,36</p>
                                        </div>

                                        <Link href={checkoutUrl} onClick={() => handlePurchaseClick('main_offer')}>
                                            <Button size="lg" className="w-full max-w-md bg-[#22c55e] hover:bg-[#16a34a] text-white text-xl md:text-2xl font-bold py-4 md:py-6 rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300 whitespace-normal h-auto leading-tight uppercase tracking-wide">
                                                Quero comprar com desconto
                                            </Button>
                                        </Link>

                                        {/* Trust Badges */}
                                        <div className="flex flex-col items-center gap-4 pt-4 border-t border-gray-200">
                                            <div className="flex items-center gap-4 opacity-70 grayscale hover:grayscale-0 transition-all">
                                                <div className="flex items-center gap-1"><ShieldCheck className="w-5 h-5" /> Compra Segura</div>
                                                <div className="flex items-center gap-1"><Zap className="w-5 h-5" /> Acesso Imediato</div>
                                                <div className="flex items-center gap-1"><Lock className="w-5 h-5" /> Dados Protegidos</div>
                                            </div>
                                            <p className="text-xs text-gray-400">Pagamento processado por plataforma segura. Seus dados estão protegidos.</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 8: Guarantee */}
                <section className="py-12 md:py-16 bg-background">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <div className="mb-6 flex justify-center">
                            <ShieldCheck className="w-20 h-20 text-primary" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-headline font-black text-foreground mb-6">Garantia Incondicional</h2>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                            Tenho tanta certeza de que este método vai funcionar para o seu perfil que faço questão de te dar uma garantia incondicional.
                            Se você não gostar, ou achar que não é para você, eu devolvo 100% do seu dinheiro. Sem perguntas e objeções.
                        </p>
                    </div>
                </section>

                {/* Section 9: FAQ */}
                <section className="bg-secondary/10 py-12 md:py-16">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight sm:text-5xl font-headline text-center mb-12">Perguntas Frequentes</h2>
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem value={`item-${index}`} key={index} className="bg-card border-none rounded-xl shadow-sm mb-4 px-6">
                                    <AccordionTrigger className="text-lg text-left font-semibold hover:no-underline py-6">{faq.q}</AccordionTrigger>
                                    <AccordionContent className="text-base text-muted-foreground pb-6 leading-relaxed">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                        <div className="text-center mt-12">
                            <Link href={checkoutUrl} onClick={() => handlePurchaseClick('faq_section')}>
                                <Button asChild size="lg" className="w-full max-w-md bg-accent hover:bg-accent/90 text-accent-foreground text-xl md:text-2xl font-bold py-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform whitespace-normal h-auto leading-tight">
                                    ESTOU PREPARADA PARA COMPRAR
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="flex items-center justify-center w-full h-20 border-t border-primary/10 bg-background">
                <p className="text-sm text-muted-foreground">&copy; 2024 CorpoLeve. Todos os direitos reservados.</p>
            </footer>

            {showStickyCTA && <StickyCTA checkoutUrl={checkoutUrl} onPurchase={() => handlePurchaseClick('sticky_footer')} />}
        </div>
    );
}

export default function ResultadoPage() {
    return (
        <Suspense fallback={<Loading />}>
            <ResultsPageClient />
        </Suspense>
    );
}
