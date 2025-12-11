"use client";

import { useState, useTransition, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Image from 'next/image';
import { quizQuestions, Trigger } from './quiz-questions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import * as LucideIcons from 'lucide-react';
import { Loader2, MessageSquareQuote, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { gtmEvent } from '../analytics/google-tag-manager';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/tracking-client';

const smartProgress = (current: number, total: number): number => {
  const realPercentage = current / total;

  if (realPercentage <= 0.5) {
    // Aggressive start: 0% real -> 15% visual, 50% real -> 75% visual
    return 15 + (realPercentage * 120);
  } else {
    // Slower finish: 50% real -> 75% visual, 100% real -> 100% visual
    return 50 + (realPercentage * 50);
  }
};

const TriggerDisplay = ({ trigger, onContinue }: { trigger: Trigger; onContinue: () => void; }) => {
  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in">
      <Card className="border-none shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden ring-1 ring-black/5">
        <div className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />
        <CardContent className="p-6 md:p-8 flex flex-col items-center gap-6">

          {trigger.text && (
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 w-full">
              <p className="text-lg md:text-xl text-slate-700 leading-relaxed text-center font-medium">
                {trigger.text}
              </p>
            </div>
          )}

          {trigger.imageUrl && (
            <div className="w-full rounded-xl overflow-hidden shadow-md">
              <Image
                src={trigger.imageUrl}
                alt="Info"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          )}

          {trigger.socialProof && (
            <div className="w-full bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <MessageSquareQuote className="absolute top-4 left-4 w-8 h-8 text-primary/20" />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <p className="text-center text-lg italic text-slate-600 font-medium leading-relaxed">
                  "{trigger.socialProof.quote}"
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-px w-8 bg-primary/30" />
                  <p className="font-bold text-primary text-sm uppercase tracking-wide">
                    {trigger.socialProof.author}
                  </p>
                  <div className="h-px w-8 bg-primary/30" />
                </div>
              </div>
            </div>
          )}

          {trigger.graph && (
            <div className="w-full space-y-4">
              <h3 className="text-xl font-bold text-center text-slate-800 leading-tight">
                {trigger.graph.title}
              </h3>

              <div className="w-full h-64 bg-slate-50 rounded-xl p-4 border border-slate-100">
                {trigger.graph.type === 'comparison' && trigger.graph.data ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trigger.graph.data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                        dy={10}
                      />
                      <YAxis hide />
                      <Tooltip
                        cursor={{ fill: 'transparent' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-800 text-white text-xs py-1 px-3 rounded shadow-xl">
                                <p className="font-bold">{data.label}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={1500} barSize={60}>
                        {trigger.graph.data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.type === 'positive' ? '#22c55e' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Image
                    src={trigger.graph.imageUrl || ''}
                    alt={trigger.graph.title}
                    width={400}
                    height={200}
                    className="rounded-lg mx-auto object-contain h-full"
                  />
                )}
              </div>

              <p className="text-center text-sm text-slate-500 bg-slate-100/50 py-2 px-4 rounded-lg">
                {trigger.graph.legend}
              </p>
            </div>
          )}

          <Button
            onClick={onContinue}
            className="w-full py-8 text-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
          >
            Continuar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

const AnalysisLoading = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const messages = [
    "🔍 Analisando suas respostas...",
    "✔️ Identificando sintomas de vício alimentar, retenção e resistência à queima de gordura...",
    "📦 Montando o protocolo mais compatível com o seu perfil...",
    "📢 Pronto! Você está a 1 passo de acessar o plano que já ajudou mais de 10.000 mulheres a eliminar de 2 a 3kg em 7 dias.",
    "⚠️ Mas antes de liberar seu acesso, assista esse vídeo rápido até o final. Ele vai te explicar como o seu corpo chegou até aqui — e o que você precisa fazer, a partir de hoje, para destravar seu emagrecimento de forma definitiva."
  ];

  useEffect(() => {
    if (step < messages.length) {
      const delays = [2000, 4000, 3000, 5000, 8000];
      const timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, delays[step]);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [step, onComplete]);

  const currentMessage = messages[Math.min(step, messages.length - 1)];

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-6 text-center animate-fade-in min-h-[300px]">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed max-w-lg animate-fade-in key={step}">
        {currentMessage}
      </p>
    </div>
  );
};

const Icon = ({ name, className }: { name: string; className?: string }) => {
  const LucideIcon = (LucideIcons as any)[name];
  if (!LucideIcon) return null;
  return <LucideIcon className={cn("mr-3", className)} />;
};


export function QuizForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string[] }>({});
  const [isPending, startTransition] = useTransition();

  // State to manage the view: 'question' | 'trigger' | 'loading'
  const [viewState, setViewState] = useState<'question' | 'trigger' | 'loading'>('question');

  // State to manage animation: 'idle' | 'exiting'
  const [animState, setAnimState] = useState<'idle' | 'exiting'>('idle');

  const [activeTrigger, setActiveTrigger] = useState<Trigger | null>(null);
  const router = useRouter();

  const totalQuestions = quizQuestions.length;
  const progress = useMemo(() => smartProgress(currentStep + 1, totalQuestions), [currentStep, totalQuestions]);
  const currentQuestion = quizQuestions[currentStep];

  useEffect(() => {
    // Save answers to sessionStorage
    sessionStorage.setItem('quizAnswers', JSON.stringify(Object.values(answers).flat()));
  }, [answers]);



  useEffect(() => {
    // Fire quiz_start event only once on mount
    trackEvent('QuizStart', {
      total_questions: totalQuestions
    });
  }, []);

  // Track when a new question is viewed
  useEffect(() => {
    if (viewState === 'question') {
      trackEvent('QuizViewStep', {
        step_number: currentStep + 1,
        total_steps: totalQuestions,
        question_title: quizQuestions[currentStep].question
      });
    }
  }, [currentStep, viewState]);

  const advanceStep = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1);
      setViewState('question');
      setAnimState('idle');
    } else {
      setViewState('loading');
      setAnimState('idle');

      // Calculate segment based on answers (simplified logic or just pass answers)
      // For now we just pass that they completed it
      trackEvent('Lead', {
        quiz_result: 'completed',
        total_questions: totalQuestions,
        step: 'quiz_completion',
        segment: 'general' // You could implement logic to determine segment based on answers
      });
    }
  };

  const handleNext = () => {
    if (animState === 'exiting') return; // Prevent double clicks
    setAnimState('exiting');

    setTimeout(() => {
      // If we are currently showing a trigger, we always go to the next question (or finish)
      if (viewState === 'trigger') {
        advanceStep();
      }
      // If we are showing a question
      else if (viewState === 'question') {
        // Check if there is a trigger for this question
        if (currentQuestion.trigger) {
          setActiveTrigger(currentQuestion.trigger);
          setViewState('trigger');
          setAnimState('idle');
        } else {
          advanceStep();
        }
      }
    }, 300); // Match CSS animation duration
  };

  const handleResponse = (value: string | string[]) => {
    const responseArray = Array.isArray(value) ? value : [value];
    setAnswers(prev => ({ ...prev, [currentStep]: responseArray }));

    gtmEvent('quiz_answer_step', {
      step_number: currentStep + 1,
      total_steps: totalQuestions,
      question_title: currentQuestion.question,
      answer_value: responseArray.join(', '),
    });

    handleNext();
  };

  const handleMultiChoiceChange = (checked: boolean, value: string) => {
    const currentSelection = answers[currentStep] || [];
    let newSelection;
    if (checked) {
      newSelection = [...currentSelection, value];
    } else {
      newSelection = currentSelection.filter(item => item !== value);
    }
    setAnswers(prev => ({ ...prev, [currentStep]: newSelection }));
  };

  const hasImageOptions = currentQuestion.options.some(opt => opt.avatar);

  // Unique key to force re-render and animation when content changes
  const contentKey = viewState === 'trigger' ? `trigger-${currentStep}` : `q-${currentStep}`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary/50 to-background p-4 overflow-hidden">
      <Card className="w-full max-w-2xl shadow-2xl rounded-2xl border-none bg-card/80 backdrop-blur-sm">
        <CardHeader className="p-4 md:p-6">
          <Progress value={progress} className="w-full mb-6 h-3 [&>*]:bg-primary rounded-full" />

          <div className="relative flex flex-col items-center justify-center min-h-[10rem] md:min-h-[14rem]">
            {viewState === 'loading' ? (
              <AnalysisLoading onComplete={() => {
                startTransition(() => {
                  router.push(`/analise`);
                });
              }} />
            ) : (
              <div
                key={`${contentKey}-header`}
                className={cn(
                  "w-full px-2 md:px-4 text-center flex flex-col items-center justify-center space-y-4",
                  animState === 'exiting' ? "animate-quiz-exit" : "animate-quiz-enter"
                )}
              >
                {viewState === 'trigger' && activeTrigger ? (
                  <TriggerDisplay trigger={activeTrigger} onContinue={handleNext} />
                ) : (
                  <CardTitle
                    className="text-xl md:text-2xl lg:text-3xl font-bold font-headline text-foreground flex items-center justify-center py-2 leading-tight"
                  >
                    {currentQuestion.question}
                  </CardTitle>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 md:px-8 pb-8 min-h-[200px]">
          {viewState === 'question' && (
            <div
              key={`${contentKey}-options`}
              className={cn(
                "w-full",
                animState === 'exiting' ? "animate-quiz-exit" : "animate-quiz-enter"
              )}
            >
              {currentQuestion.type === 'single-choice' && (
                <div className={cn(
                  "gap-3 md:gap-4",
                  hasImageOptions ? "grid grid-cols-2" : "flex flex-col"
                )}>
                  {currentQuestion.options.map((option, index) => {
                    const id = `q${currentStep}-o${index}`;
                    if (hasImageOptions) {
                      return (
                        <div key={index} className="relative group">
                          <input
                            type="radio"
                            name={`q${currentStep}`}
                            id={id}
                            value={option.value}
                            className="sr-only peer"
                            onChange={() => handleResponse(option.value)}
                          />
                          <Label htmlFor={id} className="block w-full h-full cursor-pointer rounded-xl overflow-hidden aspect-[3/4] transition-all duration-300 border-2 border-transparent peer-checked:border-primary peer-checked:scale-105 peer-checked:shadow-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95">
                            <Image
                              src={option.avatar!}
                              alt={option.label}
                              width={300}
                              height={400}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              priority={currentStep < 3}
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60 text-white flex items-center justify-between backdrop-blur-sm">
                              <span className="font-semibold text-sm sm:text-base leading-tight">{option.label}</span>
                              <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center transition-transform peer-checked:rotate-90">
                                <ChevronRight className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          </Label>
                        </div>
                      )
                    }
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="lg"
                        className="w-full justify-start text-left h-auto min-h-[3.5rem] py-4 px-6 text-base md:text-lg whitespace-normal hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
                        onClick={() => handleResponse(option.value)}
                      >
                        {option.icon && <Icon name={option.icon} className="w-5 h-5 md:w-6 md:h-6 mr-3 shrink-0" />}
                        <span className="flex-1">{option.label}</span>
                      </Button>
                    )
                  })}
                </div>
              )}

              {currentQuestion.type === 'multiple-choice' && (
                <div className="space-y-3 md:space-y-4">
                  {currentQuestion.options.map((option, index) => {
                    const id = `q${currentStep}-o${index}`;
                    const isChecked = answers[currentStep]?.includes(option.value);
                    return (
                      <div
                        key={index}
                        className={cn(
                          "rounded-xl border bg-card p-4 transition-all duration-200 flex items-center cursor-pointer h-auto min-h-[3.5rem]",
                          "hover:border-primary/50 hover:bg-primary/5 hover:shadow-md active:scale-[0.99]",
                          isChecked && "border-primary bg-primary/10 shadow-md ring-1 ring-primary/20"
                        )}
                        onClick={() => handleMultiChoiceChange(!isChecked, option.value)}
                      >
                        <Checkbox
                          id={id}
                          checked={isChecked}
                          onCheckedChange={(checked) => handleMultiChoiceChange(!!checked, option.value)}
                          className="h-5 w-5 md:h-6 md:w-6 pointer-events-none shrink-0"
                        />
                        <Label htmlFor={id} className="ml-4 w-full cursor-pointer font-medium text-foreground/90 text-sm md:text-base flex items-center pointer-events-none whitespace-normal leading-snug">
                          {option.icon && <Icon name={option.icon} className="w-5 h-5 mr-3 shrink-0" />}
                          {option.label}
                        </Label>
                      </div>
                    )
                  })}
                  <Button
                    onClick={() => handleResponse(answers[currentStep] || [])}
                    disabled={!answers[currentStep] || answers[currentStep].length === 0}
                    className="w-full mt-6 py-8 text-xl font-bold uppercase tracking-wide shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95"
                  >
                    Continuar
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
