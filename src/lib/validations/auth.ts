import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export type LoginInput = z.infer<typeof loginSchema>

// Remediation 3: Reject HTML special characters in user-controlled name fields
// to prevent injection at the data layer, before any template rendering occurs.
const safeNameField = (label: string) =>
  z
    .string()
    .min(2, `${label} must be at least 2 characters`)
    .max(100, `${label} must be at most 100 characters`)
    .refine(
      (v) => !/[<>"'&]/.test(v),
      `${label} must not contain HTML special characters (< > " ' &)`
    )

export const registerSchema = z
  .object({
    name: safeNameField("Name"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type RegisterInput = z.infer<typeof registerSchema>
