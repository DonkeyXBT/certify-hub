import { z } from "zod"

// ─── Audit Type Options ─────────────────────────────────────────────────────

export const AUDIT_TYPES = [
  { label: "Internal", value: "INTERNAL" },
  { label: "External", value: "EXTERNAL" },
  { label: "Surveillance", value: "SURVEILLANCE" },
  { label: "Certification", value: "CERTIFICATION" },
  { label: "Recertification", value: "RECERTIFICATION" },
] as const

// ─── Finding Severity Options ───────────────────────────────────────────────

export const FINDING_SEVERITIES = [
  { label: "Observation", value: "OBSERVATION" },
  { label: "Opportunity for Improvement", value: "OPPORTUNITY_FOR_IMPROVEMENT" },
  { label: "Minor Nonconformity", value: "MINOR_NONCONFORMITY" },
  { label: "Major Nonconformity", value: "MAJOR_NONCONFORMITY" },
] as const

// ─── Finding Status Options ─────────────────────────────────────────────────

export const FINDING_STATUSES = [
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Corrective Action Taken", value: "CORRECTIVE_ACTION_TAKEN" },
  { label: "Verified", value: "VERIFIED" },
  { label: "Closed", value: "CLOSED" },
] as const

// ─── Compliance Status Options ──────────────────────────────────────────────

export const COMPLIANCE_STATUSES = [
  { label: "Not Assessed", value: "NOT_ASSESSED" },
  { label: "Non-Compliant", value: "NON_COMPLIANT" },
  { label: "Partially Compliant", value: "PARTIALLY_COMPLIANT" },
  { label: "Compliant", value: "COMPLIANT" },
] as const

// ─── Create Audit Schema ────────────────────────────────────────────────────

export const createAuditSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be at most 200 characters")
    .trim(),
  type: z.enum(["INTERNAL", "EXTERNAL", "SURVEILLANCE", "CERTIFICATION", "RECERTIFICATION"], {
    message: "Please select an audit type",
  }),
  scope: z
    .string()
    .max(2000, "Scope must be at most 2000 characters")
    .optional(),
  objectives: z
    .string()
    .max(2000, "Objectives must be at most 2000 characters")
    .optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  teamMemberIds: z.array(z.string()).optional(),
  frameworkId: z.string().optional(),
})

export type CreateAuditInput = z.infer<typeof createAuditSchema>

// ─── Update Audit Schema ────────────────────────────────────────────────────

export const updateAuditSchema = createAuditSchema.partial()

export type UpdateAuditInput = z.infer<typeof updateAuditSchema>

// ─── Checklist Item Schema ──────────────────────────────────────────────────

export const updateChecklistItemSchema = z.object({
  complianceStatus: z.enum(["NOT_ASSESSED", "NON_COMPLIANT", "PARTIALLY_COMPLIANT", "COMPLIANT"]),
  notes: z.string().max(2000, "Notes must be at most 2000 characters").optional(),
})

export type UpdateChecklistItemInput = z.infer<typeof updateChecklistItemSchema>

// ─── Create Finding Schema ──────────────────────────────────────────────────

export const createFindingSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be at most 200 characters")
    .trim(),
  description: z
    .string()
    .max(2000, "Description must be at most 2000 characters")
    .optional(),
  severity: z.enum(
    ["OBSERVATION", "OPPORTUNITY_FOR_IMPROVEMENT", "MINOR_NONCONFORMITY", "MAJOR_NONCONFORMITY"],
    { message: "Please select a severity" },
  ),
  rootCause: z
    .string()
    .max(2000, "Root cause must be at most 2000 characters")
    .optional(),
  evidence: z
    .string()
    .max(2000, "Evidence must be at most 2000 characters")
    .optional(),
  dueDate: z.coerce.date().optional(),
})

export type CreateFindingInput = z.infer<typeof createFindingSchema>

// ─── Update Finding Schema ──────────────────────────────────────────────────

export const updateFindingSchema = createFindingSchema.partial().extend({
  status: z
    .enum(["OPEN", "IN_PROGRESS", "CORRECTIVE_ACTION_TAKEN", "VERIFIED", "CLOSED"])
    .optional(),
})

export type UpdateFindingInput = z.infer<typeof updateFindingSchema>
