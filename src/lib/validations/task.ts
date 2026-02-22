import { z } from "zod"

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  assigneeId: z.string().optional(),
  dueDate: z.string().optional(),
  riskId: z.string().optional(),
  controlImplementationId: z.string().optional(),
  capaId: z.string().optional(),
})
