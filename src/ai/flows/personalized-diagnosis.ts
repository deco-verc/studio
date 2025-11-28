// src/ai/flows/personalized-diagnosis.ts
'use server';

/**
 * @fileOverview A personalized diagnosis AI agent based on quiz answers.
 *
 * - personalizedDiagnosis - A function that handles the personalized diagnosis process.
 * - PersonalizedDiagnosisInput - The input type for the personalizedDiagnosis function.
 * - PersonalizedDiagnosisOutput - The return type for the personalizedDiagnosis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedDiagnosisInputSchema = z.object({
  quizAnswers: z.array(
    z.string().describe('The answers to the quiz questions.')
  ).describe('An array containing the answers to the quiz questions.'),
});
export type PersonalizedDiagnosisInput = z.infer<typeof PersonalizedDiagnosisInputSchema>;

const PersonalizedDiagnosisOutputSchema = z.object({
  diagnosis: z.string().describe('A personalized diagnosis based on the quiz answers, explaining how the food industry might have negatively impacted the user\u2019s metabolism and overall health.'),
});
export type PersonalizedDiagnosisOutput = z.infer<typeof PersonalizedDiagnosisOutputSchema>;

export async function personalizedDiagnosis(input: PersonalizedDiagnosisInput): Promise<PersonalizedDiagnosisOutput> {
  return personalizedDiagnosisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedDiagnosisPrompt',
  input: {schema: PersonalizedDiagnosisInputSchema},
  output: {schema: PersonalizedDiagnosisOutputSchema},
  prompt: `You are an AI assistant that provides personalized diagnoses based on quiz answers. Your diagnosis should explain how the food industry might have negatively impacted the user’s metabolism and overall health. Use a tone that is both informative and empathetic. The user's answers are:

{{#each quizAnswers}}
{{@index}}. {{this}}
{{/each}}`,
});

const personalizedDiagnosisFlow = ai.defineFlow(
  {
    name: 'personalizedDiagnosisFlow',
    inputSchema: PersonalizedDiagnosisInputSchema,
    outputSchema: PersonalizedDiagnosisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
