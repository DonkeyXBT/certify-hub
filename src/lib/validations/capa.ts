import { z } from "zod"

export const capaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.enum(["CORRECTIVE", "PREVENTIVE"]).default("CORRECTIVE"),
  source: z.string().optional(),
  dueDate: z.string().optional(),
})
