'use server';

/**
 * @fileOverview An AI agent for score verification analysis.
 *
 * - scoreVerificationAnalysis - A function that handles the score verification analysis process.
 * - ScoreVerificationInput - The input type for the scoreVerificationAnalysis function.
 * - ScoreVerificationOutput - The return type for the scoreVerificationAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScoreVerificationInputSchema = z.object({
  scoreData: z
    .string()
    .describe(
      'The numerical score data of the applicant.'
    ),
  applicantResponses: z.string().describe('The responses provided by the applicant during the application process.'),
  applicantBackground: z.string().describe('Background information about the applicant.'),
});
export type ScoreVerificationInput = z.infer<typeof ScoreVerificationInputSchema>;

const ScoreVerificationOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the score is valid based on the analysis.'),
  analysis: z.string().describe('A detailed analysis of the score validity.'),
});
export type ScoreVerificationOutput = z.infer<typeof ScoreVerificationOutputSchema>;

export async function scoreVerificationAnalysis(input: ScoreVerificationInput): Promise<ScoreVerificationOutput> {
  return scoreVerificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scoreVerificationPrompt',
  input: {schema: ScoreVerificationInputSchema},
  output: {schema: ScoreVerificationOutputSchema},
  prompt: `You are an expert admission analyst specializing in verifying applicant scores and related information.

You will use the information provided to analyze the applicant's score and supporting details to determine the score's validity. You will set the isValid output field appropriately based on your analysis.

Applicant Score Data: {{{scoreData}}}
Applicant Responses: {{{applicantResponses}}}
Applicant Background: {{{applicantBackground}}}`,
});

const scoreVerificationFlow = ai.defineFlow(
  {
    name: 'scoreVerificationFlow',
    inputSchema: ScoreVerificationInputSchema,
    outputSchema: ScoreVerificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
