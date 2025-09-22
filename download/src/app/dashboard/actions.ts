
"use server";

import {
  admissionEligibilitySummary,
  type AdmissionEligibilitySummaryOutput,
} from "@/ai/flows/admission-eligibility-summary";
import {
  scoreVerificationAnalysis,
  type ScoreVerificationOutput,
} from "@/ai/flows/score-verification-analysis";
import { z } from "zod";
import { activityLog } from "@/lib/activity-log";

const admissionSchema = z.object({
  predictedScore: z.coerce.number().min(0).max(100),
  academicBackground: z.string().min(20, { message: "Please provide more detail." }),
  extracurricularActivities: z.string().min(20, { message: "Please provide more detail." }),
  personalStatement: z.string().min(50, { message: "Statement must be at least 50 characters." }),
});

const verificationSchema = z.object({
    scoreData: z.string().min(1, { message: "Score data cannot be empty." }),
    applicantResponses: z.string().min(20, { message: "Please provide more detail." }),
    applicantBackground: z.string().min(20, { message: "Please provide more detail." }),
});

export async function getAdmissionSummary(
  values: z.infer<typeof admissionSchema>
): Promise<{ data: AdmissionEligibilitySummaryOutput | null; error: string | null }> {
  activityLog.info({ role: 'admin', action: 'get_admission_summary_start', details: { predictedScore: values.predictedScore } });
  const validatedFields = admissionSchema.safeParse(values);

  if (!validatedFields.success) {
    const error = "Invalid input: " + validatedFields.error.flatten().fieldErrors[Object.keys(validatedFields.error.flatten().fieldErrors)[0]];
    activityLog.error({ role: 'admin', action: 'get_admission_summary_validation_error', details: { error } });
    return {
      data: null,
      error,
    };
  }

  try {
    const result = await admissionEligibilitySummary(validatedFields.data);
    activityLog.info({ role: 'admin', action: 'get_admission_summary_success', details: { predictedScore: values.predictedScore } });
    return { data: result, error: null };
  } catch (e: any) {
    console.error(e);
    activityLog.error({ role: 'admin', action: 'get_admission_summary_ai_error', details: { error: e.message } });
    return { data: null, error: "An AI processing error occurred. Please try again." };
  }
}

export async function getScoreVerification(
  values: z.infer<typeof verificationSchema>
): Promise<{ data: ScoreVerificationOutput | null; error: string | null }> {
    activityLog.info({ role: 'admin', action: 'get_score_verification_start' });
    const validatedFields = verificationSchema.safeParse(values);

    if (!validatedFields.success) {
        const error = "Invalid input: " + validatedFields.error.flatten().fieldErrors[Object.keys(validatedFields.error.flatten().fieldErrors)[0]];
        activityLog.error({ role: 'admin', action: 'get_score_verification_validation_error', details: { error } });
        return {
            data: null,
            error,
        };
    }
  
    try {
      const result = await scoreVerificationAnalysis(validatedFields.data);
      activityLog.info({ role: 'admin', action: 'get_score_verification_success', details: { isValid: result.isValid } });
      return { data: result, error: null };
    } catch (e: any) {
      console.error(e);
      activityLog.error({ role: 'admin', action: 'get_score_verification_ai_error', details: { error: e.message } });
      return { data: null, error: "An AI processing error occurred. Please try again." };
    }
}
