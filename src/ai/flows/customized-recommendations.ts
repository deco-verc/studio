'use server';

/**
 * @fileOverview Generates customized recommendations for recipes and bonus content based on user quiz responses.
 *
 * - generateCustomizedRecommendations - A function that generates the recommendations.
 * - CustomizedRecommendationsInput - The input type for the generateCustomizedRecommendations function.
 * - CustomizedRecommendationsOutput - The return type for the generateCustomizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomizedRecommendationsInputSchema = z.object({
  quizResponses: z.array(z.string()).describe('An array of the user\'s responses to the quiz questions.'),
});
export type CustomizedRecommendationsInput = z.infer<typeof CustomizedRecommendationsInputSchema>;

const CustomizedRecommendationsOutputSchema = z.object({
  recommendedRecipes: z.array(z.string()).describe('An array of recommended recipe names.'),
  recommendedBonusContent: z.array(z.string()).describe('An array of recommended bonus content titles.'),
  reasoning: z.string().describe('Explanation of why these recommendations were made.'),
});
export type CustomizedRecommendationsOutput = z.infer<typeof CustomizedRecommendationsOutputSchema>;

export async function generateCustomizedRecommendations(
  input: CustomizedRecommendationsInput
): Promise<CustomizedRecommendationsOutput> {
  return customizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customizedRecommendationsPrompt',
  input: {schema: CustomizedRecommendationsInputSchema},
  output: {schema: CustomizedRecommendationsOutputSchema},
  prompt: `You are an expert weight loss coach who provides personalized recommendations based on a user's quiz responses.

  Analyze the following quiz responses:
  {{#each quizResponses}}
  - {{{this}}}
  {{/each}}

  Based on these responses, recommend specific recipes from our collection of 200 recipes (provide recipe names).
  Also, recommend bonus content from the following options:
  - O Guia \"Anti-Falso Saudável\"
  - O Antídoto de Emergência
  - Sobremesas que \"Enganam\" o Cérebro
  - Manual da Economia no Mercado

  Provide a brief explanation of why you are recommending these recipes and bonus content. Focus on how they address the user's specific challenges and preferences as indicated in their quiz responses.

  Format your response as a JSON object that matches the output schema.`,
});

const customizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'customizedRecommendationsFlow',
    inputSchema: CustomizedRecommendationsInputSchema,
    outputSchema: CustomizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
