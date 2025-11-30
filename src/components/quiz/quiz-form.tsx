

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
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const { toast } = useToast();

  const totalQuestions = quizQuestions.length;
  const progress = useMemo(() => smartProgress(currentStep + 1, totalQuestions), [currentStep, totalQuestions]);
  const currentQuestion = quizQuestions[currentStep];

  const hasAvatars = useMemo(() => {
    return currentQuestion.options.every(option => 'avatar' in option && option.avatar);
  }, [currentQuestion]);

  const handleValueChange = (value: string) => {
    const newAnswers = { ...answers, [currentStep]: value };
    setAnswers(newAnswers);
    setIsAnimatingOut(true);

    setTimeout(() => {
        if (currentStep < totalQuestions - 1) {
            setCurrentStep(currentStep + 1);
            setIsAnimatingOut(false);
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
                  setIsAnimatingOut(false);
                }
            });
        }
    }, 350);
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background/80 p-4 overflow-hidden">
      <Card className="w-full max-w-2xl shadow-2xl rounded-2xl border-none bg-card">
        <CardHeader className="p-6">
          <Progress value={progress} className="w-full mb-6 h-2" />
          <div className="relative flex items-center justify-center">
            <CardTitle 
              key={currentStep}
              className={cn(
                "text-2xl md:text-3xl font-bold font-headline text-center text-foreground transition-all duration-300 ease-in-out px-4",
                isAnimatingOut ? 'opacity-0 -translate-x-12' : 'opacity-100 translate-x-0'
              )}
            >
              {currentQuestion.question}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 md:px-8 pb-8">
           {isPending ? (
             <div className="flex flex-col items-center justify-center space-y-4 h-64 animate-fade-in">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="text-lg md:text-xl text-muted-foreground">Analisando suas respostas...</p>
             </div>
           ) : (
            <RadioGroup
              key={currentStep}
              value={answers[currentStep]}
              onValueChange={handleValueChange}
              className={cn(
                "space-y-4",
                hasAvatars && "grid grid-cols-2 gap-4 md:gap-6"
              )}
            >
              {currentQuestion.options.map((option, index) => {
                const id = `q${currentStep}-o${index}`;
                return (
                  <div 
                    key={index}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className={cn(
                      "rounded-xl border bg-secondary/30 p-4 md:p-5 transition-all duration-300 has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:shadow-lg has-[:checked]:scale-105",
                      "hover:border-primary/50 hover:bg-primary/5 hover:shadow-md",
                      "opacity-0 translate-y-4 animate-fade-in-up",
                      isAnimatingOut ? 'opacity-0 translate-x-12' : ''
                    )}
                  >
                    <Label htmlFor={id} className="w-full h-full cursor-pointer">
                      {hasAvatars ? (
                        <div className="flex flex-col items-center justify-start gap-4">
                           {option.avatar && (
                            <div className="relative w-32 h-32">
                              <Image
                                src={option.avatar}
                                alt={option.label}
                                fill
                                className="rounded-full object-cover shadow-md"
                              />
                            </div>
                          )}
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value={option.value} id={id} className="h-5 w-5 flex-shrink-0 border-primary/50" />
                            <span className="font-medium text-foreground/80 text-center text-sm md:text-base">
                              {option.label}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-4">
                           <RadioGroupItem value={option.value} id={id} className="h-5 w-5 flex-shrink-0 border-primary/50" />
                           <span className="font-medium text-foreground/80 flex-1 text-base md:text-lg">
                            {option.label}
                           </span>
                        </div>
                      )}
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
