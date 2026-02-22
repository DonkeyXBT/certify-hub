import { z } from "zod"

export const riskFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be at most 200 characters")
    .trim(),
  description: z.string().max(5000, "Description is too long").optional(),
  categoryId: z.string().optional(),
  owner: z.string().max(200).optional(),
  inherentLikelihood: z.enum(
    ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
  ),
  inherentImpact: z.enum(
    ["NEGLIGIBLE", "MINOR", "MODERATE", "MAJOR", "CATASTROPHIC"]
  ),
  treatment: z.enum(["ACCEPT", "MITIGATE", "TRANSFER", "AVOID"]),
  treatmentPlan: z.string().max(5000, "Treatment plan is too long").optional(),
  reviewDate: z.string().optional(),
})

export type RiskFormInput = z.infer<typeof riskFormSchema>

export const LIKELIHOOD_OPTIONS = [
  { label: "Very Low", value: "VERY_LOW" },
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" },
  { label: "Very High", value: "VERY_HIGH" },
] as const

export const IMPACT_OPTIONS = [
  { label: "Negligible", value: "NEGLIGIBLE" },
  { label: "Minor", value: "MINOR" },
  { label: "Moderate", value: "MODERATE" },
  { label: "Major", value: "MAJOR" },
  { label: "Catastrophic", value: "CATASTROPHIC" },
] as const

export const TREATMENT_OPTIONS = [
  { label: "Accept", value: "ACCEPT" },
  { label: "Mitigate", value: "MITIGATE" },
  { label: "Transfer", value: "TRANSFER" },
  { label: "Avoid", value: "AVOID" },
] as const

export const RISK_STATUS_OPTIONS = [
  { label: "Identified", value: "IDENTIFIED" },
  { label: "Analysed", value: "ANALYSED" },
  { label: "Treatment Planned", value: "TREATMENT_PLANNED" },
  { label: "Treatment in Progress", value: "TREATMENT_IN_PROGRESS" },
  { label: "Treated", value: "TREATED" },
  { label: "Closed", value: "CLOSED" },
  { label: "Monitoring", value: "MONITORING" },
] as const
