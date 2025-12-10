import { PlaceHolderImages } from '@/lib/placeholder-images';

export type QuizOption = {
  label: string;
  value: string;
  avatar?: string;
  icon?: string;
};

export type Trigger = {
  text: string;
  socialProof?: {
    quote: string;
    author: string;
  };
  graph?: {
    title: string;
    type?: 'image' | 'comparison';
    imageUrl?: string;
    data?: { name: string; value: number; label: string; type: 'negative' | 'positive' }[];
    legend: string;
  }
};

// ... (lines 23-183 remain unchanged, I will target the specific block for question 12)




export type QuizQuestion = {
  id: number;
  question: string;
  type: 'single-choice' | 'multiple-choice';
  options: QuizOption[];
  trigger?: Trigger;
};

const femaleAvatar = PlaceHolderImages.find(p => p.id === 'female-avatar');
const maleAvatar = PlaceHolderImages.find(p => p.id === 'male-avatar');
const age18_29 = PlaceHolderImages.find(p => p.id === 'age-18-29');
const age30_45 = PlaceHolderImages.find(p => p.id === 'age-30-45');
const age46_60 = PlaceHolderImages.find(p => p.id === 'age-46-60');
const age60plus = PlaceHolderImages.find(p => p.id === 'age-60-plus');

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Qual é o seu sexo?",
    type: 'single-choice',
    options: [
      { label: "Feminino", value: "Feminino", avatar: femaleAvatar?.imageUrl },
      { label: "Masculino", value: "Masculino", avatar: maleAvatar?.imageUrl },
    ],
  },
  {
    id: 2,
    question: "Qual a sua idade?",
    type: 'single-choice',
    options: [
      { label: "18-29", value: "18-29", avatar: age18_29?.imageUrl },
      { label: "30-45", value: "30-45", avatar: age30_45?.imageUrl },
      { label: "46-60", value: "46-60", avatar: age46_60?.imageUrl },
      { label: "60+", value: "60+", avatar: age60plus?.imageUrl },
    ],
  },
  {
    id: 3,
    question: "Quão insatisfeita você está com o seu corpo hoje?",
    type: 'single-choice',
    options: [
      { label: "Totalmente Insatisfeita", value: "Totalmente Insatisfeita", icon: "Frown" },
      { label: "Muito Insatisfeita", value: "Muito Insatisfeita", icon: "Meh" },
      { label: "Pouco insatisfeita", value: "Pouco insatisfeita", icon: "Smile" },
      { label: "Poderia ser melhor", value: "Poderia ser melhor", icon: "SmilePlus" },
    ],
    trigger: {
      text: "💡 92% das mulheres estão na mesma situação, completamente insatisfeitas. Mas esse é o primeiro passo, fique até o final para mudar essa realidade."
    }
  },
  {
    id: 4,
    question: "Quando você se olha no espelho hoje, qual é o primeiro sentimento?",
    type: 'single-choice',
    options: [
      { label: "Decepção com meu corpo", value: "Decepção com meu corpo", icon: "HeartCrack" },
      { label: "Tristeza com minha aparência", value: "Tristeza com minha aparência", icon: "Sad" },
      { label: "Cansaço de tentar e não conseguir", value: "Cansaço de tentar e não conseguir", icon: "Battery" },
      { label: "Sei que preciso mudar, mas não sei por onde começar", value: "Sei que preciso mudar, mas não sei por onde começar", icon: "HelpCircle" },
    ],
    trigger: {
      text: "Esse sentimento é mais comum do que você imagina — e é exatamente o primeiro sinal de que seu corpo está pedindo ajuda."
    }
  },
  {
    id: 5,
    question: "Há quanto tempo você se sente assim?",
    type: 'single-choice',
    options: [
      { label: "Menos de 3 meses", value: "Menos de 3 meses", icon: "CalendarClock" },
      { label: "3 a 6 meses", value: "3 a 6 meses", icon: "CalendarClock" },
      { label: "1 ano ou mais", value: "1 ano ou mais", icon: "Calendar" },
      { label: "Já faz tanto tempo que perdi a conta", value: "Já faz tanto tempo que perdi a conta", icon: "CalendarHeart" },
    ],
  },
  {
    id: 6,
    question: "O que mais te incomoda fisicamente hoje?",
    type: 'single-choice',
    options: [
      { label: "Barriga inchada", value: "Barriga inchada", icon: "Flame" },
      { label: "Rosto mais cheio", value: "Rosto mais cheio", icon: "User" },
      { label: "Roupas apertando", value: "Roupas apertando", icon: "Shirt" },
      { label: "Sensação de estar maior do que antes", value: "Sensação de estar maior do que antes", icon: "Expand" },
    ],
  },
  {
    id: 7,
    question: "Qual dessas situações acontece com você no dia a dia?",
    type: 'multiple-choice',
    options: [
      { label: "Como sem fome e nem percebo", value: "Como sem fome e nem percebo", icon: "UtensilsCrossed" },
      { label: "Uso comida como recompensa", value: "Uso comida como recompensa", icon: "Gift" },
      { label: "Pulo refeições e depois exagero", value: "Pulo refeições e depois exagero", icon: "FastForward" },
      { label: "Como industrializados pela praticidade", value: "Como industrializados pela praticidade", icon: "Package" },
    ],
  },
  {
    id: 8,
    question: "Esses hábitos acontecem com mais frequência em qual momento?",
    type: 'single-choice',
    options: [
      { label: "Final da tarde", value: "Final da tarde", icon: "Sunset" },
      { label: "À noite", value: "À noite", icon: "Moon" },
      { label: "Quando estou sozinha", value: "Quando estou sozinha", icon: "User" },
      { label: "Quando estou estressada", value: "Quando estou estressada", icon: "BrainCircuit" },
    ],
    trigger: {
      text: "O horário/situação que você selecionou é onde o hormônio do estresse (Cortisol) costuma \"sequestrar\" sua força de vontade. A culpa não é sua, é química.",
      socialProof: {
        quote: "A maior mudança pra mim foi à noite. Antes, eu comia sem pensar tudo que via pela frente. Com o protocolo, em 7 dias eu já não sentia aquela fome desesperadora, foi minha mudança de chave.",
        author: "Luciana, 36 anos"
      }
    }
  },
  {
    id: 9,
    question: "Você acredita que seu ganho de peso está ligado a:",
    type: 'multiple-choice',
    options: [
      { label: "Comer por emoção", value: "Comer por emoção", icon: "SmilePlus" },
      { label: "Comer compulsivamente", value: "Comer compulsivamente", icon: "Cookie" },
      { label: "Efeito sanfona (dietas ioiô)", value: "Efeito sanfona", icon: "Repeat" },
      { label: "Inchaço/digestão lenta", value: "Inchaço/digestão lenta", icon: "Bot" },
      { label: "Falta de constância por causa da ansiedade", value: "Falta de constância por ansiedade", icon: "Waves" },
    ],
  },
  {
    id: 10,
    question: "Quando bate aquela vontade de comer o que engorda… o que geralmente acontece?",
    type: 'single-choice',
    options: [
      { label: "Como mesmo assim e depois me arrependo", value: "Como e me arrependo", icon: "HeartCrack" },
      { label: "Tento resistir, mas sempre cedo", value: "Tento resistir, mas cedo", icon: "ShieldOff" },
      { label: "Como sem perceber", value: "Como sem perceber", icon: "EyeOff" },
      { label: "Às vezes consigo evitar, mas é difícil", value: "Consigo evitar, mas é difícil", icon: "Shield" },
    ],
  },
  {
    id: 11,
    question: "O que mais te atrapalha na hora de tentar emagrecer?",
    type: 'multiple-choice',
    options: [
      { label: "Falta de tempo para preparar algo saudável", value: "Falta de tempo", icon: "Clock" },
      { label: "Fome e ansiedade durante as dietas", value: "Fome e ansiedade", icon: "Waves" },
      { label: "Comida sem sabor me faz desistir", value: "Comida sem sabor", icon: "ThumbsDown" },
      { label: "Não sei o que comer no dia a dia", value: "Não sei o que comer", icon: "HelpCircle" },
    ],
  },
  {
    id: 12,
    question: "O que você já tentou e NÃO funcionou?",
    type: 'multiple-choice',
    options: [
      { label: "Academia", value: "Academia", icon: "Dumbbell" },
      { label: "Chá emagrecedor", value: "Chá emagrecedor", icon: "Coffee" },
      { label: "Dietas restritivas", value: "Dietas restritivas", icon: "MinusCircle" },
      { label: "Remédios para emagrecer", value: "Remédios para emagrecer", icon: "Pilcrow" },
      { label: "Jejum intermitente", value: "Jejum intermitente", icon: "Clock" },
    ],
    trigger: {
      text: "",
      graph: {
        title: "Comparação de Eficiência:",
        type: 'comparison',
        data: [
          { name: 'Tradicionais', value: 20, label: 'Falhos', type: 'negative' },
          { name: 'Protocolo', value: 95, label: 'Eficiente', type: 'positive' }
        ],
        legend: "Enquanto métodos tradicionais falham em 80% dos casos, nosso protocolo age na raiz do problema."
      }
    }
  },
  {
    id: 13,
    question: "Quando você tenta e acaba desistindo, o que sente?",
    type: 'single-choice',
    options: [
      { label: "Culpa por não conseguir", value: "Culpa", icon: "UserX" },
      { label: "Frustração por voltar ao mesmo ponto", value: "Frustração", icon: "RotateCcw" },
      { label: "Sensação de estar perdendo a batalha", value: "Perdendo a batalha", icon: "Swords" },
      { label: "Medo de nunca conseguir mudar", value: "Medo de nunca conseguir", icon: "HeartCrack" },
    ],
  },
  {
    id: 14,
    question: "Quando sente que perdeu o controle sobre o que come, o que mais te preocupa?",
    type: 'single-choice',
    options: [
      { label: "Continuar engordando aos poucos", value: "Continuar engordando", icon: "TrendingUp" },
      { label: "Chegar num ponto que não consiga mais voltar", value: "Não conseguir voltar", icon: "Anchor" },
      { label: "Afetar minha saúde", value: "Afetar a saúde", icon: "HeartPulse" },
      { label: "Perder a confiança em mim mesma", value: "Perder a autoconfiança", icon: "ShieldOff" },
    ],
    trigger: {
      text: "🧬 FATO CIENTÍFICO: A sensação de \"perda de controle\" que você descreveu é o sintoma #1 de um Metabolismo Viciado. Vamos investigar a causa agora..."
    }
  },
  {
    id: 15,
    question: "Você sente que seu corpo parece viciado em certos alimentos — como se seu cérebro fosse programado pra desejar o que te faz engordar?",
    type: 'single-choice',
    options: [
      { label: "Sim, é exatamente assim", value: "Sim, é exatamente assim", icon: "Brain" },
      { label: "Às vezes tenho essa sensação", value: "Às vezes sinto isso", icon: "BrainCircuit" },
      { label: "Nunca pensei assim, mas faz sentido", value: "Faz sentido", icon: "Lightbulb" },
      { label: "Eu acho que é isso mesmo", value: "Acho que é isso", icon: "Check" },
    ],
  },
  {
    id: 16,
    question: "Já tentou cortar açúcar ou aquelas comidas que você sabe que fazem mal, mas seu corpo pede mesmo assim e sentiu ansiedade, irritação ou compulsão?",
    type: 'single-choice',
    options: [
      { label: "Sim, fico até de mau humor", value: "Sim, fico de mau humor", icon: "Angry" },
      { label: "Me sinto ansiosa e como mais ainda", value: "Fico ansiosa e como mais", icon: "Waves" },
      { label: "Sim, por isso sempre desisto", value: "Sim, por isso desisto", icon: "Flag" },
      { label: "Nunca tentei cortar totalmente", value: "Nunca tentei cortar", icon: "Slash" },
    ],
  },
  {
    id: 17,
    question: "Sabia que até alimentos “light e fit” podem ativar o mesmo vício que te faz engordar?",
    type: 'single-choice',
    options: [
      { label: "Eu compro achando que são saudáveis e continuo inchada", value: "Compro light/fit e continuo inchada", icon: "Bot" },
      { label: "Já suspeitei, mas não sabia que era tão sério", value: "Suspeitava, mas não sabia a gravidade", icon: "AlertTriangle" },
      { label: "Não sabia disso, tô chocada", value: "Não sabia, chocada", icon: "Annoyed" },
      { label: "Sempre achei que “light” era saudável", value: "Achava que light era saudável", icon: "Apple" },
    ],
  },
  {
    id: 18,
    question: "Você sabia que a indústria alimentícia usa combinações químicas para te viciar em certos alimentos?",
    type: 'single-choice',
    options: [
      { label: "Sim! Isso explica muita coisa sobre meu peso.", value: "Sim, explica meu peso", icon: "FlaskConical" },
      { label: "Já ouvi falar, mas nunca entendi direito", value: "Ouvi falar, mas não entendi", icon: "Ear" },
      { label: "Não sabia, mas agora tudo faz sentido", value: "Não sabia, mas faz sentido", icon: "Lightbulb" },
      { label: "Nunca pensei nisso desse jeito", value: "Nunca pensei nisso", icon: "Brain" },
    ],
  },
  {
    id: 19,
    question: "Você acredita que existe um “botão interno” que pode desligar a fome emocional, se você souber como ativar?",
    type: 'single-choice',
    options: [
      { label: "Seria um sonho, né?!", value: "Seria um sonho", icon: "Sparkles" },
      { label: "Acho que sim, se for com comida de verdade", value: "Sim, com comida de verdade", icon: "Carrot" },
      { label: "Não sei, mas fiquei curiosa", value: "Não sei, mas fiquei curiosa", icon: "HelpCircle" },
      { label: "Parece impossível, mas queria descobrir", value: "Parece impossível, mas queria descobrir", icon: "Key" },
    ],
  },
  {
    id: 20,
    question: "Por conta do seu peso atual, você sente algum desses sintomas físicos?",
    type: 'multiple-choice',
    options: [
      { label: "Falta de fôlego", value: "Falta de fôlego", icon: "Wind" },
      { label: "Muito suor", value: "Muito suor", icon: "Droplets" },
      { label: "Falta de mobilidade", value: "Falta de mobilidade", icon: "Accessibility" },
      { label: "Acorda cansada", value: "Acorda cansada", icon: "Bed" },
      { label: "Dores no corpo", value: "Dores no corpo", icon: "Bone" },
    ],
  },
  {
    id: 21,
    question: "E emocionalmente... como isso afeta sua vida?",
    type: 'multiple-choice',
    options: [
      { label: "Me sinto mal nas roupas", value: "Sinto-me mal nas roupas", icon: "Shirt" },
      { label: "Afeta meu relacionamento", value: "Afeta meu relacionamento", icon: "HeartHandshake" },
      { label: "Vergonha do meu corpo", value: "Vergonha do corpo", icon: "EyeOff" },
      { label: "Autoestima muito baixa", value: "Autoestima baixa", icon: "BatteryLow" },
      { label: "Me comparo com outras mulheres e fico mal", value: "Comparo-me e fico mal", icon: "Users" },
    ],
    trigger: {
      text: "📌 Mais de 10.000 mulheres marcaram exatamente suas dores — vergonha, baixa autoestima, roupas que não serviam — voltaram a se sentir bonitas seguindo o plano das 200 receitas. Elas começaram exatamente onde você está agora."
    }
  },
  {
    id: 22,
    question: "Se você pudesse mudar UMA coisa no seu corpo nos próximos 7 dias, o que seria?",
    type: 'single-choice',
    options: [
      { label: "Desinchar a barriga", value: "Desinchar a barriga", icon: "ThermometerSnowflake" },
      { label: "Perder 2 a 3kg", value: "Perder 2-3kg", icon: "Scale" },
      { label: "Reduzir a vontade de doce", value: "Reduzir vontade de doce", icon: "Cookie" },
      { label: "Sentir mais leveza e energia", value: "Sentir mais leveza e energia", icon: "Feather" },
    ],
  },
  {
    id: 23,
    question: "O quanto faria diferença ter um cardápio simples, rápido e gostoso que te ajudasse a emagrecer rápido, sem fome, sem esforço mental e sem se sentir viciada em comida?",
    type: 'single-choice',
    options: [
      { label: "Mudaria tudo pra mim", value: "Mudaria tudo", icon: "Sparkles" },
      { label: "Finalmente eu conseguiria seguir algo", value: "Conseguiria seguir", icon: "Trophy" },
      { label: "Seria um alívio enorme", value: "Alívio enorme", icon: "Heart" },
      { label: "É exatamente o que eu procuro há muito tempo", value: "É o que procuro", icon: "Search" },
    ],
    trigger: {
      text: "Você já chegou até aqui. Se tudo que você marcou até agora fez sentido… então esse plano foi feito pra você. Basta só 1 semana pra começar a virar esse jogo."
    }
  },
  {
    id: 24,
    question: "Se eu te mostrasse um plano com 200 receitas simples, rápidas e gostosas — combinadas pra desligar o vício em comida, controlar a fome emocional e te ajudar a emagrecer até 3kg em 7 dias… você toparia testar por 1 semana?",
    type: 'single-choice',
    options: [
      { label: "Sim, parece exatamente o que eu preciso", value: "Sim, preciso disso", icon: "Check" },
      { label: "Com certeza, eu topo!", value: "Com certeza, topo", icon: "CheckCheck" },
      { label: "Isso é exatamente o que eu procuro há muito tempo", value: "É o que procuro", icon: "Star" },
      { label: "Acho que sim, se for fácil de seguir", value: "Sim, se for fácil", icon: "ThumbsUp" },
    ],
  },
];
