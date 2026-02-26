import { z } from "zod"

// Remediation 3: Shared safe-name refinement — reject HTML special characters in
// all user-controlled name fields to prevent injection at the data layer.
const safeOrgNameField = z
  .string()
  .min(2, "Organization name must be at least 2 characters")
  .max(100, "Organization name must be at most 100 characters")
  .trim()
  .refine(
    (v) => !/[<>"'&]/.test(v),
    "Organization name must not contain HTML special characters (< > \" ' &)"
  )

export const createOrganizationSchema = z.object({
  name: safeOrgNameField,
  industry: z.string().min(1, "Please select an industry"),
  size: z.string().min(1, "Please select a company size"),
})

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>

export const updateOrganizationSchema = z.object({
  name: safeOrgNameField,
  industry: z.string().optional(),
  size: z.string().optional(),
})

export const brandingSchema = z.object({
  primaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color")
    .optional()
    .or(z.literal("")),
  // Remediation 3: Reject HTML injection in the custom app name branding field.
  appName: z
    .string()
    .max(50)
    .refine(
      (v) => !/[<>"'&]/.test(v),
      "App name must not contain HTML special characters (< > \" ' &)"
    )
    .optional()
    .or(z.literal("")),
  // Remediation 3 & 5: Validate logoUrl to only allow http/https (no javascript: URIs).
  logoUrl: z
    .string()
    .url("Must be a valid URL")
    .refine(
      (v) => v.startsWith("https://") || v.startsWith("http://"),
      "Logo URL must use http or https"
    )
    .optional()
    .or(z.literal("")),
})

export const INDUSTRY_OPTIONS = [
  { label: "Technology", value: "technology" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Finance & Banking", value: "finance" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Retail & E-commerce", value: "retail" },
  { label: "Education", value: "education" },
  { label: "Government", value: "government" },
  { label: "Energy & Utilities", value: "energy" },
  { label: "Telecommunications", value: "telecommunications" },
  { label: "Professional Services", value: "professional-services" },
  { label: "Non-profit", value: "non-profit" },
  { label: "Other", value: "other" },
] as const

export const COMPANY_SIZE_OPTIONS = [
  { label: "1-10 employees", value: "1-10" },
  { label: "11-50 employees", value: "11-50" },
  { label: "51-200 employees", value: "51-200" },
  { label: "201-500 employees", value: "201-500" },
  { label: "501-1000 employees", value: "501-1000" },
  { label: "1001-5000 employees", value: "1001-5000" },
  { label: "5000+ employees", value: "5000+" },
] as const
