"use client";

import { useState, useTransition, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { quizQuestions, Trigger } from './quiz-questions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Loader2, MessageSquareQuote, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { gtmEvent } from '../analytics/google-tag-manager';
import { useRouter } from 'next/navigation';

const smartProgress = (current: number, total: number): number => {
    if (current < total * 0.5) {
      return (current / (total * 0.5)) * 60;
    } else if (current < total - 1) {
      return 60 + ((current - total * 0.5) / (total * 0.5 - 1)) * 30;
    } else {
      return 100;
    }
};

const TriggerDisplay = ({ trigger, onContinue }: { trigger: Trigger; onContinue: () => void; }) => {
  return (
    <div className="w-full text-center flex flex-col items-center justify-center space-y-4 p-4 animate-fade-in">
        {trigger.text && <p className="text-lg md:text-xl text-foreground/90">{trigger.text}</p>}
        {trigger.socialProof && (
            <Card className="w-full max-w-md bg-primary/10 border-primary/20 p-4">
                <CardContent className="p-0 flex flex-col items-center gap-2">
                    <MessageSquareQuote className="w-8 h-8 text-primary" />
                    <p className="text-center italic text-foreground">"{trigger.socialProof.quote}"</p>
                    <p className="font-semibold text-primary">- {trigger.socialProof.author}</p>
                </CardContent>
            </Card>
        )}
        {trigger.graph && (
            <Card className="w-full max-w-md bg-secondary/30 p-4">
                 <CardHeader className="p-2">
                    <CardTitle className="text-base font-bold text-center">{trigger.graph.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Image src={trigger.graph.imageUrl} alt={trigger.graph.title} width={400} height={200} className="rounded-md mx-auto" />
                    <p className="text-center text-sm text-muted-foreground mt-2">{trigger.graph.legend}</p>
                </CardContent>
            </Card>
        )}
        <Button onClick={onContinue} className="mt-6">
            Continuar
        </Button>
    </div>
  )
}

export function QuizForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string[] }>({});
  const [isPending, startTransition] = useTransition();
  const [animationState, setAnimationState] = useState<'enter' | 'exit'>('enter');
  const [showTrigger, setShowTrigger] = useState<Trigger | null>(null);
  const router = useRouter();

  const totalQuestions = quizQuestions.length;
  const progress = useMemo(() => smartProgress(currentStep + 1, totalQuestions), [currentStep, totalQuestions]);
  const currentQuestion = quizQuestions[currentStep];

  useEffect(() => {
    setAnimationState('enter');
    setShowTrigger(null);

    // Save answers to sessionStorage
    sessionStorage.setItem('quizAnswers', JSON.stringify(Object.values(answers).flat()));

  }, [currentStep, answers]);

  const handleNext = () => {
    setAnimationState('exit');
    setTimeout(() => {
      if (currentStep < totalQuestions - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        startTransition(() => {
          router.push(`/analise`);
        });
      }
    }, 400); // Animation duration
  }

  const handleResponse = (value: string | string[]) => {
    const responseArray = Array.isArray(value) ? value : [value];
    const newAnswers = { ...answers, [currentStep]: responseArray };
    setAnswers(newAnswers);

    gtmEvent('quiz_step', {
      step_number: currentStep + 1,
      step_title: currentQuestion.question,
      response: responseArray.join(', '),
    });

    if (currentQuestion.trigger) {
      setShowTrigger(currentQuestion.trigger);
    } else {
      handleNext();
    }
  };

  const handleMultiChoiceChange = (checked: boolean, value: string) => {
    const currentSelection = answers[currentStep] || [];
    let newSelection;
    if (checked) {
      newSelection = [...currentSelection, value];
    } else {
      newSelection = currentSelection.filter(item => item !== value);
    }
    setAnswers({ ...answers, [currentStep]: newSelection });
  };
  
  const hasImageOptions = currentQuestion.options.some(opt => opt.avatar);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary/50 to-background p-4 overflow-hidden">
      <Card className="w-full max-w-2xl shadow-2xl rounded-2xl border-none bg-card/80 backdrop-blur-sm">
        <CardHeader className="p-4 md:p-6">
          <Progress value={progress} className="w-full mb-6 h-2 [&>*]:bg-primary" />
          <div className="relative flex flex-col items-center justify-center min-h-[14rem] md:min-h-[18rem]">
            {isPending ? (
              <div className="flex flex-col items-center justify-center space-y-4 h-64 animate-fade-in">
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                  <p className="text-lg md:text-xl text-muted-foreground">Finalizando...</p>
              </div>
            ) : showTrigger ? (
              <TriggerDisplay trigger={showTrigger} onContinue={handleNext} />
            ) : (
            <div className={cn(
              "w-full px-4 text-center flex flex-col items-center justify-center space-y-4",
               animationState === 'enter' ? 'quiz-item-enter' : 'quiz-item-exit'
            )}>
              <CardTitle 
                className="text-xl md:text-2xl lg:text-3xl font-bold font-headline text-foreground flex items-center justify-center py-4"
              >
                {currentQuestion.question}
              </CardTitle>
            </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 md:px-8 pb-8 min-h-[200px]">
           {!isPending && !showTrigger && (
             <>
              {currentQuestion.type === 'single-choice' && (
                <RadioGroup
                  key={currentStep}
                  onValueChange={(value) => handleResponse(value)}
                  className={cn(
                    "gap-4",
                    hasImageOptions ? "grid grid-cols-2" : "grid grid-cols-1"
                  )}
                >
                  {currentQuestion.options.map((option, index) => {
                    const id = `q${currentStep}-o${index}`;
                    if (hasImageOptions) {
                      return (
                         <div key={index} className="relative animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                          <RadioGroupItem value={option.value} id={id} className="sr-only peer" />
                          <Label htmlFor={id} className="block w-full h-full cursor-pointer rounded-xl overflow-hidden aspect-[3/4] transition-all duration-300 border-2 border-transparent peer-aria-checked:border-primary peer-aria-checked:scale-105 shadow-md hover:shadow-xl">
                              <Image 
                                src={option.avatar!} 
                                alt={option.label}
                                width={300}
                                height={400}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60 text-white flex items-center justify-between">
                                  <span className="font-semibold text-sm sm:text-base">{option.label}</span>
                                  <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center transition-transform peer-aria-checked:rotate-90">
                                      <ChevronRight className="w-5 h-5 text-white" />
                                  </div>
                              </div>
                          </Label>
                        </div>
                      )
                    }
                    return (
                      <div 
                        key={index}
                        style={{ animationDelay: `${index * 100}ms` }}
                        className="rounded-xl border bg-card p-4 md:p-5 transition-all duration-300 has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:shadow-lg hover:border-primary/50 hover:bg-primary/5 hover:shadow-md flex animate-fade-in-up"
                      >
                        <RadioGroupItem value={option.value} id={id} className="h-5 w-5" />
                        <Label htmlFor={id} className="w-full h-full cursor-pointer flex items-center text-center gap-4 ml-4">
                          <span className="font-medium text-foreground/90 text-sm md:text-base flex-grow text-left">{option.label}</span>
                        </Label>
                      </div>
                    )
                  })}
                </RadioGroup>
              )}

              {currentQuestion.type === 'multiple-choice' && (
                <div className="space-y-4">
                  {currentQuestion.options.map((option, index) => {
                     const id = `q${currentStep}-o${index}`;
                     const isChecked = answers[currentStep]?.includes(option.value);
                     return (
                      <div 
                        key={index}
                        style={{ animationDelay: `${index * 100}ms` }}
                        className={cn(
                          "rounded-xl border bg-card p-4 md:p-5 transition-all duration-300 flex items-center animate-fade-in-up",
                          "hover:border-primary/50 hover:bg-primary/5 hover:shadow-md",
                          isChecked && "border-primary bg-primary/10 shadow-lg"
                        )}
                      >
                         <Checkbox
                            id={id}
                            checked={isChecked}
                            onCheckedChange={(checked) => handleMultiChoiceChange(!!checked, option.value)}
                            className="h-6 w-6"
                         />
                         <Label htmlFor={id} className="ml-4 w-full h-full cursor-pointer font-medium text-foreground/90 text-sm md:text-base">
                          {option.label}
                         </Label>
                      </div>
                     )
                  })}
                  <Button 
                    onClick={() => handleResponse(answers[currentStep] || [])}
                    disabled={!answers[currentStep] || answers[currentStep].length === 0}
                    className="w-full mt-6"
                  >
                    Continuar
                  </Button>
                </div>
              )}
             </>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
