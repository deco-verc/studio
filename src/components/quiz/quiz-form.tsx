

"use client";

import { useState, useTransition, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { quizQuestions } from './quiz-questions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { gtmEvent } from '../analytics/google-tag-manager';

type QuizFormProps = {
  submitQuiz: (answers: string[]) => Promise<void>;
};

const smartProgress = (current: number, total: number): number => {
    if (current < total * 0.5) {
      return (current / (total * 0.5)) * 60;
    } else if (current < total - 1) {
      return 60 + ((current - total * 0.5) / (total * 0.5 - 1)) * 30;
    } else {
      return 100;
    }
};

export function QuizForm({ submitQuiz }: QuizFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isPending, startTransition] = useTransition();
  const [animationState, setAnimationState] = useState<'enter' | 'exit'>('enter');
  const { toast } = useToast();

  const totalQuestions = quizQuestions.length;
  const progress = useMemo(() => smartProgress(currentStep + 1, totalQuestions), [currentStep, totalQuestions]);
  const currentQuestion = quizQuestions[currentStep] as (typeof quizQuestions)[0] & { imageBelowTitle?: string };

  const hasAvatars = useMemo(() => {
    return currentQuestion.options.every(option => 'avatar' in option && option.avatar);
  }, [currentQuestion]);
  
  // Effect to reset animation state when question changes
  useEffect(() => {
    setAnimationState('enter');
  }, [currentStep]);

  const handleValueChange = (value: string) => {
    const newAnswers = { ...answers, [currentStep]: value };
    setAnswers(newAnswers);
    setAnimationState('exit');

    gtmEvent('quiz_step', {
      step_number: currentStep + 1,
      step_title: currentQuestion.question,
      response: value,
    });

    setTimeout(() => {
        if (currentStep < totalQuestions - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            startTransition(async () => {
                const answerArray = Object.values(newAnswers);
                if(answerArray.length === totalQuestions) {
                  await submitQuiz(answerArray);
                } else {
                  toast({
                      title: "Por favor, responda todas as perguntas.",
                      variant: "destructive",
                  });
                  // Reset animation if submission fails
                  setAnimationState('enter');
                }
            });
        }
    }, 400); // Duration should match animation duration
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary/50 to-background p-4 overflow-hidden">
      <Card className="w-full max-w-2xl shadow-2xl rounded-2xl border-none bg-card/80 backdrop-blur-sm">
        <CardHeader className="p-4 md:p-6">
          <Progress value={progress} className="w-full mb-6 h-2 [&>*]:bg-primary" />
          <div className="relative flex flex-col items-center justify-center min-h-[14rem] md:min-h-[18rem]">
            {isPending ? (
              <div className="flex flex-col items-center justify-center space-y-4 h-64 animate-fade-in">
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                  <p className="text-lg md:text-xl text-muted-foreground">Analisando suas respostas...</p>
              </div>
            ) : (
            <div className={cn(
              "absolute w-full px-4 text-center space-y-4",
               animationState === 'enter' ? 'quiz-item-enter' : 'quiz-item-exit'
            )}>
              <CardTitle 
                className="text-xl md:text-2xl lg:text-3xl font-bold font-headline text-foreground flex items-center justify-center py-4"
              >
                {currentQuestion.question}
              </CardTitle>
              {currentQuestion.imageBelowTitle && (
                <div className="relative w-full max-w-xs mx-auto rounded-lg overflow-hidden shadow-lg">
                  <Image 
                    src={currentQuestion.imageBelowTitle}
                    alt="Imagem da pergunta"
                    width={300}
                    height={200}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
              )}
            </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 md:px-8 pb-8 min-h-[200px]">
           {!isPending && (
            <RadioGroup
              key={currentStep}
              value={answers[currentStep]}
              onValueChange={handleValueChange}
              className={cn(
                "space-y-4",
                hasAvatars && "grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
              )}
            >
              {currentQuestion.options.map((option, index) => {
                const id = `q${currentStep}-o${index}`;
                return (
                  <div 
                    key={index}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className={cn(
                      "rounded-xl border bg-card p-4 md:p-5 transition-all duration-300 has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:shadow-lg has-[:checked]:scale-105",
                      "hover:border-primary/50 hover:bg-primary/5 hover:shadow-md flex",
                      animationState === 'enter' ? 'opacity-0 translate-y-4 animate-fade-in-up' : 'opacity-0'
                    )}
                  >
                    <RadioGroupItem value={option.value} id={id} className="sr-only" />
                    <Label htmlFor={id} className="w-full h-full cursor-pointer flex flex-col items-center justify-between text-center gap-4">
                      {hasAvatars && option.avatar && (
                        <div className="relative w-32 h-32 md:w-40 md:h-40">
                          <Image
                            src={option.avatar}
                            alt={option.label}
                            fill
                            className="rounded-full object-cover shadow-md"
                            priority={currentStep < 2}
                            sizes="(max-width: 768px) 128px, 160px"
                          />
                        </div>
                      )}
                      
                       <span className="font-medium text-foreground/90 text-sm md:text-base">
                        {option.label}
                       </span>
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
