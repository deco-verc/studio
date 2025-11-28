
"use client";

import { useState, useTransition, useMemo, useEffect } from 'react';
import { quizQuestions } from './quiz-questions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

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
  const { toast } = useToast();

  const totalQuestions = quizQuestions.length;
  const progress = useMemo(() => smartProgress(currentStep + 1, totalQuestions), [currentStep, totalQuestions]);
  const currentQuestion = quizQuestions[currentStep];

  const handleValueChange = (value: string) => {
    const newAnswers = { ...answers, [currentStep]: value };
    setAnswers(newAnswers);

    setTimeout(() => {
        if (currentStep < totalQuestions - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Last question, submit the form
            startTransition(async () => {
                const answerArray = Object.values(newAnswers);
                if(answerArray.length === totalQuestions) {
                  await submitQuiz(answerArray);
                } else {
                  // This case should ideally not be hit with this new logic
                  // but as a fallback
                  toast({
                      title: "Por favor, responda todas as perguntas.",
                      variant: "destructive",
                  });
                }
            });
        }
    }, 300); // Short delay for UX
  };
  
  useEffect(() => {
    // This effect is kept as a safeguard but primary submission logic is in handleValueChange
    if (isPending && currentStep === totalQuestions -1 && Object.keys(answers).length === totalQuestions) {
       const answerArray = Object.values(answers);
       submitQuiz(answerArray);
    }
  }, [isPending, answers, currentStep, totalQuestions, submitQuiz]);


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-2xl shadow-2xl rounded-2xl">
        <CardHeader>
          <Progress value={progress} className="w-full mb-6 h-2" />
          <CardTitle className="text-2xl md:text-3xl font-bold font-headline text-center text-foreground min-h-[9rem] flex items-center justify-center px-6">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 md:px-8 pb-8">
           {isPending ? (
             <div className="flex flex-col items-center justify-center space-y-4 h-64">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="text-lg md:text-xl text-muted-foreground">Analisando suas respostas...</p>
             </div>
           ) : (
            <RadioGroup
              key={currentStep}
              value={answers[currentStep]}
              onValueChange={handleValueChange}
              className="space-y-4"
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-4 rounded-xl border-2 border-transparent bg-gray-100 dark:bg-gray-800/50 p-4 md:p-5 hover:border-primary hover:bg-primary/5 transition-all duration-300 has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:shadow-lg">
                  <RadioGroupItem value={option.value} id={`q${currentStep}-o${index}`} className="h-5 w-5" />
                  <Label htmlFor={`q${currentStep}-o${index}`} className="text-base md:text-lg font-medium text-foreground/80 flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
