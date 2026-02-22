import { z } from "zod"

// ─── Document Category Options ──────────────────────────────────────────────

export const DOCUMENT_CATEGORIES = [
  { label: "Policy", value: "Policy" },
  { label: "Procedure", value: "Procedure" },
  { label: "Work Instruction", value: "Work Instruction" },
  { label: "Form", value: "Form" },
  { label: "Record", value: "Record" },
  { label: "Manual", value: "Manual" },
  { label: "Other", value: "Other" },
] as const

export const DOCUMENT_CATEGORY_VALUES = DOCUMENT_CATEGORIES.map((c) => c.value)

// ─── Create Document Schema ─────────────────────────────────────────────────

export const createDocumentSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be at most 200 characters")
    .trim(),
  description: z
    .string()
    .max(2000, "Description must be at most 2000 characters")
    .optional(),
  category: z.string().min(1, "Please select a category"),
  reviewCycle: z.coerce
    .number()
    .int()
    .min(1, "Review cycle must be at least 1 month")
    .max(60, "Review cycle must be at most 60 months")
    .optional(),
  tags: z.string().optional(),
  fileUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  fileName: z.string().optional(),
})

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>

// ─── Update Document Schema ─────────────────────────────────────────────────

export const updateDocumentSchema = createDocumentSchema.partial()

export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>

// ─── Add Version Schema ─────────────────────────────────────────────────────

export const addVersionSchema = z.object({
  fileUrl: z.string().url("Please enter a valid file URL"),
  fileName: z.string().min(1, "File name is required"),
  changelog: z
    .string()
    .max(1000, "Changelog must be at most 1000 characters")
    .optional(),
})

export type AddVersionInput = z.infer<typeof addVersionSchema>

// ─── Approval Action Schema ─────────────────────────────────────────────────

export const approvalActionSchema = z.object({
  comments: z
    .string()
    .max(2000, "Comments must be at most 2000 characters")
    .optional(),
})

export type ApprovalActionInput = z.infer<typeof approvalActionSchema>
