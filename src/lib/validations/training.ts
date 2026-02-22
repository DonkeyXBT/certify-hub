import { z } from "zod"

export const trainingProgramSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  frequency: z.string().optional(),
  isMandatory: z.boolean().default(false),
  validityPeriod: z.number().optional(),
  passingScore: z.number().min(0).max(100).optional(),
})
