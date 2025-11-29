

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
                const OptionContent = (
                  <>
                    {hasAvatars && (
                      <div className="mb-4">
                        <Image
                          src={option.avatar!}
                          alt={option.label}
                          width={128}
                          height={128}
                          className="mx-auto rounded-full aspect-square object-cover shadow-md"
                        />
                      </div>
                    )}
                    <div className={cn("flex items-center space-x-4", hasAvatars && "justify-center")}>
                      <RadioGroupItem value={option.value} id={`q${currentStep}-o${index}`} className="h-5 w-5 flex-shrink-0 border-primary/50" />
                      <Label htmlFor={`q${currentStep}-o${index}`} className={cn("font-medium text-foreground/80 flex-1 cursor-pointer", hasAvatars ? "text-center text-sm md:text-base" : "text-base md:text-lg")}>
                        {option.label}
                      </Label>
                    </div>
                  </>
                );

                return (
                  <div 
                    key={index}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className={cn(
                      "rounded-xl border bg-secondary/30 p-4 md:p-5 transition-all duration-300 has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:shadow-lg has-[:checked]:scale-105",
                      "hover:border-primary/50 hover:bg-primary/5 hover:shadow-md",
                      "opacity-0 translate-y-4 animate-fade-in-up",
                      isAnimatingOut ? 'opacity-0 translate-x-12' : '',
                       hasAvatars ? 'flex flex-col items-center justify-start space-y-0' : 'flex items-center space-x-4'
                    )}
                  >
                    {hasAvatars ? (
                        <Label htmlFor={`q${currentStep}-o${index}`} className="w-full cursor-pointer">{OptionContent}</Label>
                    ) : (
                      OptionContent
                    )}
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
