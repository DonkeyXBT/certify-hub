import { z } from "zod"

export const evidenceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.enum(["DOCUMENT", "SCREENSHOT", "LOG", "CERTIFICATE", "POLICY", "PROCEDURE", "RECORD", "EXTERNAL_LINK", "OTHER"]).default("DOCUMENT"),
  controlImplementationId: z.string().optional(),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
  expiryDate: z.string().optional(),
})
