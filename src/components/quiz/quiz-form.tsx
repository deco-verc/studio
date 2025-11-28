
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
  const progress = useMemo(() => smartProgress(currentStep, totalQuestions), [currentStep, totalQuestions]);
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
    }, 200); // Short delay for UX
  };
  
  useEffect(() => {
    if (isPending && currentStep === totalQuestions -1 && Object.keys(answers).length === totalQuestions) {
       const answerArray = Object.values(answers);
       submitQuiz(answerArray);
    }
  }, [isPending, answers, currentStep, totalQuestions, submitQuiz]);


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <Progress value={progress} className="w-full mb-4 h-2" />
          <CardTitle className="text-2xl font-headline text-center min-h-[6rem] flex items-center justify-center">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
           {isPending ? (
             <div className="flex flex-col items-center justify-center space-y-4 h-48">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg text-muted-foreground">Analisando suas respostas...</p>
             </div>
           ) : (
            <RadioGroup
              key={currentStep}
              value={answers[currentStep]}
              onValueChange={handleValueChange}
              className="space-y-4"
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value={option.value} id={`q${currentStep}-o${index}`} />
                  <Label htmlFor={`q${currentStep}-o${index}`} className="text-base flex-1 cursor-pointer">
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

