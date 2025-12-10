import { PlaceHolderImages } from '@/lib/placeholder-images';

export type QuizOption = {
  label: string;
  value: string;
  avatar?: string;
};

export type Trigger = {
  text: string;
  socialProof?: {
    quote: string;
    author: string;
  };
  graph?: {
    title: string;
    imageUrl: string;
    legend: string;
  }
};


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
      { label: "Tenho entre 18 e 29 anos", value: "18-29", avatar: age18_29?.imageUrl },
      { label: "Tenho entre 30 e 45 anos", value: "30-45", avatar: age30_45?.imageUrl },
      { label: "Tenho entre 46 e 60 anos", value: "46-60", avatar: age46_60?.imageUrl },
      { label: "Tenho mais de 60 anos", value: "60+", avatar: age60plus?.imageUrl },
    ],
  },
  {
    id: 3,
    question: "Quão insatisfeita você está com o seu corpo hoje?",
    type: 'single-choice',
    options: [
      { label: "Totalmente Insatisfeita", value: "Totalmente Insatisfeita" },
      { label: "Muito Insatisfeita", value: "Muito Insatisfeita" },
      { label: "Pouco insatisfeita", value: "Pouco insatisfeita" },
      { label: "Poderia ser melhor", value: "Poderia ser melhor" },
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
      { label: "Decepção com meu corpo", value: "Decepção com meu corpo" },
      { label: "Tristeza com minha aparência", value: "Tristeza com minha aparência" },
      { label: "Cansaço de tentar e não conseguir", value: "Cansaço de tentar e não conseguir" },
      { label: "Sei que preciso mudar, mas não sei por onde começar", value: "Sei que preciso mudar, mas não sei por onde começar" },
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
      { label: "Menos de 3 meses", value: "Menos de 3 meses" },
      { label: "3 a 6 meses", value: "3 a 6 meses" },
      { label: "1 ano ou mais", value: "1 ano ou mais" },
      { label: "Já faz tanto tempo que perdi a conta", value: "Já faz tanto tempo que perdi a conta" },
    ],
  },
  {
    id: 6,
    question: "O que mais te incomoda fisicamente hoje?",
    type: 'single-choice',
    options: [
      { label: "Barriga inchada", value: "Barriga inchada" },
      { label: "Rosto mais cheio", value: "Rosto mais cheio" },
      { label: "Roupas apertando", value: "Roupas apertando" },
      { label: "Sensação de estar maior do que antes", value: "Sensação de estar maior do que antes" },
    ],
  },
  {
    id: 7,
    question: "Qual dessas situações acontece com você no dia a dia?",
    type: 'multiple-choice',
    options: [
      { label: "Como sem fome e nem percebo", value: "Como sem fome e nem percebo" },
      { label: "Uso comida como recompensa", value: "Uso comida como recompensa" },
      { label: "Pulo refeições e depois exagero", value: "Pulo refeições e depois exagero" },
      { label: "Como industrializados pela praticidade", value: "Como industrializados pela praticidade" },
    ],
  },
  {
    id: 8,
    question: "Esses hábitos acontecem com mais frequência em qual momento?",
    type: 'single-choice',
    options: [
      { label: "Final da tarde", value: "Final da tarde" },
      { label: "À noite", value: "À noite" },
      { label: "Quando estou sozinha", value: "Quando estou sozinha" },
      { label: "Quando estou estressada", value: "Quando estou estressada" },
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
      { label: "Comer por emoção", value: "Comer por emoção" },
      { label: "Comer compulsivamente", value: "Comer compulsivamente" },
      { label: "Efeito sanfona (dietas ioiô)", value: "Efeito sanfona" },
      { label: "Inchaço/digestão lenta", value: "Inchaço/digestão lenta" },
      { label: "Falta de constância por causa da ansiedade", value: "Falta de constância por ansiedade" },
    ],
  },
  {
    id: 10,
    question: "Quando bate aquela vontade de comer o que engorda… o que geralmente acontece?",
    type: 'single-choice',
    options: [
      { label: "Como mesmo assim e depois me arrependo", value: "Como e me arrependo" },
      { label: "Tento resistir, mas sempre cedo", value: "Tento resistir, mas cedo" },
      { label: "Como sem perceber", value: "Como sem perceber" },
      { label: "Às vezes consigo evitar, mas é difícil", value: "Consigo evitar, mas é difícil" },
    ],
  },
  {
    id: 11,
    question: "O que mais te atrapalha na hora de tentar emagrecer?",
    type: 'multiple-choice',
    options: [
      { label: "Falta de tempo para preparar algo saudável", value: "Falta de tempo" },
      { label: "Fome e ansiedade durante as dietas", value: "Fome e ansiedade" },
      { label: "Comida sem sabor me faz desistir", value: "Comida sem sabor" },
      { label: "Não sei o que comer no dia a dia", value: "Não sei o que comer" },
    ],
  },
  {
    id: 12,
    question: "O que você já tentou e NÃO funcionou?",
    type: 'multiple-choice',
    options: [
      { label: "Academia", value: "Academia" },
      { label: "Chá emagrecedor", value: "Chá emagrecedor" },
      { label: "Dietas restritivas", value: "Dietas restritivas" },
      { label: "Remédios para emagrecer", value: "Remédios para emagrecer" },
      { label: "Jejum intermitente", value: "Jejum intermitente" },
    ],
    trigger: {
      text: "",
      graph: {
        title: "Esses Métodos são falhos, Veja a diferença deles para o protocolo:",
        imageUrl: "https://i.imgur.com/gJZGvjA.png",
        legend: "Esses métodos destroem seu metabolismo e te impedem de emagrecer. O nosso método reeduca seu paladar."
      }
    }
  },
  {
    id: 13,
    question: "Quando você tenta e acaba desistindo, o que sente?",
    type: 'single-choice',
    options: [
      { label: "Culpa por não conseguir", value: "Culpa" },
      { label: "Frustração por voltar ao mesmo ponto", value: "Frustração" },
      { label: "Sensação de estar perdendo a batalha", value: "Perdendo a batalha" },
      { label: "Medo de nunca conseguir mudar", value: "Medo de nunca conseguir" },
    ],
  },
  {
    id: 14,
    question: "Quando sente que perdeu o controle sobre o que come, o que mais te preocupa?",
    type: 'single-choice',
    options: [
      { label: "Continuar engordando aos poucos", value: "Continuar engordando" },
      { label: "Chegar num ponto que não consiga mais voltar", value: "Não conseguir voltar" },
      { label: "Afetar minha saúde", value: "Afetar a saúde" },
      { label: "Perder a confiança em mim mesma", value: "Perder a autoconfiança" },
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
      { label: "Sim, é exatamente assim", value: "Sim, é exatamente assim" },
      { label: "Às vezes tenho essa sensação", value: "Às vezes sinto isso" },
      { label: "Nunca pensei assim, mas faz sentido", value: "Faz sentido" },
      { label: "Eu acho que é isso mesmo", value: "Acho que é isso" },
    ],
  },
  {
    id: 16,
    question: "Já tentou cortar açúcar ou aquelas comidas que você sabe que fazem mal, mas seu corpo pede mesmo assim e sentiu ansiedade, irritação ou compulsão?",
    type: 'single-choice',
    options: [
      { label: "Sim, fico até de mau humor", value: "Sim, fico de mau humor" },
      { label: "Me sinto ansiosa e como mais ainda", value: "Fico ansiosa e como mais" },
      { label: "Sim, por isso sempre desisto", value: "Sim, por isso desisto" },
      { label: "Nunca tentei cortar totalmente", value: "Nunca tentei cortar" },
    ],
  },
  {
    id: 17,
    question: "Sabia que até alimentos “light e fit” podem ativar o mesmo vício que te faz engordar?",
    type: 'single-choice',
    options: [
      { label: "Eu compro achando que são saudáveis e continuo inchada", value: "Compro light/fit e continuo inchada" },
      { label: "Já suspeitei, mas não sabia que era tão sério", value: "Suspeitava, mas não sabia a gravidade" },
      { label: "Não sabia disso, tô chocada", value: "Não sabia, chocada" },
      { label: "Sempre achei que “light” era saudável", value: "Achava que light era saudável" },
    ],
  },
  {
    id: 18,
    question: "Você sabia que a indústria alimentícia usa combinações químicas para te viciar em certos alimentos?",
    type: 'single-choice',
    options: [
      { label: "Sim! Isso explica muita coisa sobre meu peso.", value: "Sim, explica meu peso" },
      { label: "Já ouvi falar, mas nunca entendi direito", value: "Ouvi falar, mas não entendi" },
      { label: "Não sabia, mas agora tudo faz sentido", value: "Não sabia, mas faz sentido" },
      { label: "Nunca pensei nisso desse jeito", value: "Nunca pensei nisso" },
    ],
  },
  {
    id: 19,
    question: "Você acredita que existe um “botão interno” que pode desligar a fome emocional, se você souber como ativar?",
    type: 'single-choice',
    options: [
      { label: "Seria um sonho, né?!", value: "Seria um sonho" },
      { label: "Acho que sim, se for com comida de verdade", value: "Sim, com comida de verdade" },
      { label: "Não sei, mas fiquei curiosa", value: "Não sei, mas fiquei curiosa" },
      { label: "Parece impossível, mas queria descobrir", value: "Parece impossível, mas queria descobrir" },
    ],
  },
  {
    id: 20,
    question: "Por conta do seu peso atual, você sente algum desses sintomas físicos?",
    type: 'multiple-choice',
    options: [
      { label: "Falta de fôlego", value: "Falta de fôlego" },
      { label: "Muito suor", value: "Muito suor" },
      { label: "Falta de mobilidade", value: "Falta de mobilidade" },
      { label: "Acorda cansada", value: "Acorda cansada" },
      { label: "Dores no corpo", value: "Dores no corpo" },
    ],
  },
  {
    id: 21,
    question: "E emocionalmente... como isso afeta sua vida?",
    type: 'multiple-choice',
    options: [
      { label: "Me sinto mal nas roupas", value: "Sinto-me mal nas roupas" },
      { label: "Afeta meu relacionamento", value: "Afeta meu relacionamento" },
      { label: "Vergonha do meu corpo", value: "Vergonha do corpo" },
      { label: "Autoestima muito baixa", value: "Autoestima baixa" },
      { label: "Me comparo com outras mulheres e fico mal", value: "Comparo-me e fico mal" },
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
      { label: "Desinchar a barriga", value: "Desinchar a barriga" },
      { label: "Perder 2 a 3kg", value: "Perder 2-3kg" },
      { label: "Reduzir a vontade de doce", value: "Reduzir vontade de doce" },
      { label: "Sentir mais leveza e energia", value: "Sentir mais leveza e energia" },
    ],
  },
  {
    id: 23,
    question: "O quanto faria diferença ter um cardápio simples, rápido e gostoso que te ajudasse a emagrecer rápido, sem fome, sem esforço mental e sem se sentir viciada em comida?",
    type: 'single-choice',
    options: [
      { label: "Mudaria tudo pra mim", value: "Mudaria tudo" },
      { label: "Finalmente eu conseguiria seguir algo", value: "Conseguiria seguir" },
      { label: "Seria um alívio enorme", value: "Alívio enorme" },
      { label: "É exatamente o que eu procuro há muito tempo", value: "É o que procuro" },
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
      { label: "Sim, parece exatamente o que eu preciso", value: "Sim, preciso disso" },
      { label: "Com certeza, eu topo!", value: "Com certeza, topo" },
      { label: "Isso é exatamente o que eu procuro há muito tempo", value: "É o que procuro" },
      { label: "Acho que sim, se for fácil de seguir", value: "Sim, se for fácil" },
    ],
  },
];
