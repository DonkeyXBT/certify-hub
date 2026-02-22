import { z } from "zod"

export const createAssessmentSchema = z.object({
  name: z
    .string()
    .min(2, "Assessment name must be at least 2 characters")
    .max(200, "Assessment name must be at most 200 characters")
    .trim(),
  frameworkId: z.string().min(1, "Please select a framework"),
  startDate: z.coerce.date().optional(),
})

export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>

export const updateAssessmentSchema = z.object({
  name: z
    .string()
    .min(2, "Assessment name must be at least 2 characters")
    .max(200, "Assessment name must be at most 200 characters")
    .trim()
    .optional(),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "ARCHIVED"]).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})

export type UpdateAssessmentInput = z.infer<typeof updateAssessmentSchema>

export const saveAssessmentResponseSchema = z.object({
  assessmentId: z.string().min(1),
  clauseId: z.string().optional(),
  controlId: z.string().optional(),
  requirementId: z.string().optional(),
  complianceStatus: z.enum([
    "NOT_ASSESSED",
    "NON_COMPLIANT",
    "PARTIALLY_COMPLIANT",
    "COMPLIANT",
  ]),
  maturityLevel: z.number().int().min(1).max(5).optional(),
  gaps: z.string().max(5000).optional(),
  recommendations: z.string().max(5000).optional(),
  notes: z.string().max(5000).optional(),
})

export type SaveAssessmentResponseInput = z.infer<typeof saveAssessmentResponseSchema>

export const updateSoAEntrySchema = z.object({
  applicability: z.enum(["APPLICABLE", "NOT_APPLICABLE"]),
  justification: z.string().max(2000).optional(),
  implStatus: z
    .enum([
      "NOT_IMPLEMENTED",
      "PLANNED",
      "PARTIALLY_IMPLEMENTED",
      "FULLY_IMPLEMENTED",
      "NOT_APPLICABLE",
    ])
    .optional(),
})

export type UpdateSoAEntryInput = z.infer<typeof updateSoAEntrySchema>

export const COMPLIANCE_STATUS_OPTIONS = [
  { label: "Not Assessed", value: "NOT_ASSESSED" },
  { label: "Non-Compliant", value: "NON_COMPLIANT" },
  { label: "Partially Compliant", value: "PARTIALLY_COMPLIANT" },
  { label: "Compliant", value: "COMPLIANT" },
] as const

export const MATURITY_LEVELS = [
  { label: "1 - Initial", value: 1, description: "Ad hoc, uncontrolled" },
  { label: "2 - Managed", value: 2, description: "Planned and tracked" },
  { label: "3 - Defined", value: 3, description: "Well-characterized and understood" },
  { label: "4 - Quantitatively Managed", value: 4, description: "Measured and controlled" },
  { label: "5 - Optimizing", value: 5, description: "Continuously improving" },
] as const

export const ASSESSMENT_STATUS_OPTIONS = [
  { label: "Not Started", value: "NOT_STARTED" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Archived", value: "ARCHIVED" },
] as const

export const IMPLEMENTATION_STATUS_OPTIONS = [
  { label: "Not Implemented", value: "NOT_IMPLEMENTED" },
  { label: "Planned", value: "PLANNED" },
  { label: "Partially Implemented", value: "PARTIALLY_IMPLEMENTED" },
  { label: "Fully Implemented", value: "FULLY_IMPLEMENTED" },
  { label: "Not Applicable", value: "NOT_APPLICABLE" },
] as const
