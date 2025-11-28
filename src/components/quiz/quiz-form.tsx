"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { quizQuestions } from './quiz-questions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type QuizFormProps = {
  submitQuiz: (answers: string[]) => Promise<void>;
};

export function QuizForm({ submitQuiz }: QuizFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const totalQuestions = quizQuestions.length;
  const progress = ((currentStep + 1) / totalQuestions) * 100;
  const currentQuestion = quizQuestions[currentStep];

  const handleValueChange = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentStep]: value }));
  };

  const handleNext = () => {
    if (answers[currentStep] === undefined) {
      toast({
        title: "Por favor, selecione uma resposta.",
        variant: "destructive",
      });
      return;
    }
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.keys(answers).length !== totalQuestions) {
        toast({
            title: "Por favor, responda todas as perguntas.",
            description: "Parece que você pulou uma. Verifique suas respostas antes de continuar.",
            variant: "destructive",
        });
        const firstUnanswered = quizQuestions.findIndex((_, index) => answers[index] === undefined);
        if (firstUnanswered !== -1) {
            setCurrentStep(firstUnanswered);
        }
        return;
    }

    startTransition(async () => {
        const answerArray = Object.values(answers);
        await submitQuiz(answerArray);
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <Progress value={progress} className="w-full mb-4 h-2" />
          <CardTitle className="text-2xl font-headline text-center">Pergunta {currentStep + 1}/{totalQuestions}</CardTitle>
          <CardDescription className="text-center text-lg md:text-xl h-24 flex items-center justify-center">
            {currentQuestion.question}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <RadioGroup
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={handlePrev} disabled={currentStep === 0 || isPending}>
              Anterior
            </Button>
            {currentStep < totalQuestions - 1 ? (
              <Button type="button" onClick={handleNext} disabled={isPending}>
                Próxima
              </Button>
            ) : (
              <Button type="submit" disabled={isPending} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  'Ver meu diagnóstico'
                )}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
