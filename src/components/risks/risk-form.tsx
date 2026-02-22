"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import {
  riskFormSchema,
  type RiskFormInput,
  LIKELIHOOD_OPTIONS,
  IMPACT_OPTIONS,
  TREATMENT_OPTIONS,
} from "@/lib/validations/risk"
import {
  calculateRiskScore,
  getRiskLevel,
  getRiskColorClass,
  getRiskLevelLabel,
} from "@/lib/utils/risk-calculator"
import type { RiskLikelihood, RiskImpact } from "@prisma/client"

import { createRisk, updateRisk } from "@/lib/actions/risks"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/shared/date-picker"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ─── Types ──────────────────────────────────────────────────────────────────

interface RiskCategory {
  id: string
  name: string
  color: string
}

interface RiskFormProps {
  categories: RiskCategory[]
  initialData?: {
    id: string
    title: string
    description: string | null
    categoryId: string | null
    owner: string | null
    inherentLikelihood: string
    inherentImpact: string
    treatment: string
    treatmentPlan: string | null
    reviewDate: Date | null
  }
}

// ─── Component ──────────────────────────────────────────────────────────────

export function RiskForm({ categories, initialData }: RiskFormProps) {
  const [isPending, startTransition] = React.useTransition()
  const [serverError, setServerError] = React.useState<string | null>(null)

  const isEditing = !!initialData

  const form = useForm<RiskFormInput>({
    resolver: zodResolver(riskFormSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      categoryId: initialData?.categoryId ?? "",
      owner: initialData?.owner ?? "",
      inherentLikelihood:
        (initialData?.inherentLikelihood as RiskFormInput["inherentLikelihood"]) ?? "MEDIUM",
      inherentImpact:
        (initialData?.inherentImpact as RiskFormInput["inherentImpact"]) ?? "MODERATE",
      treatment:
        (initialData?.treatment as RiskFormInput["treatment"]) ?? "MITIGATE",
      treatmentPlan: initialData?.treatmentPlan ?? "",
      reviewDate: initialData?.reviewDate
        ? initialData.reviewDate.toISOString().split("T")[0]
        : "",
    },
  })

  // Watch likelihood and impact for auto-calculation
  const watchedLikelihood = form.watch("inherentLikelihood")
  const watchedImpact = form.watch("inherentImpact")

  const calculatedScore = React.useMemo(() => {
    if (!watchedLikelihood || !watchedImpact) return null
    const score = calculateRiskScore(
      watchedLikelihood as RiskLikelihood,
      watchedImpact as RiskImpact
    )
    const level = getRiskLevel(score)
    return { score, level }
  }, [watchedLikelihood, watchedImpact])

  function onSubmit(data: RiskFormInput) {
    setServerError(null)
    const formData = new FormData()

    formData.set("title", data.title)
    if (data.description) formData.set("description", data.description)
    if (data.categoryId) formData.set("categoryId", data.categoryId)
    if (data.owner) formData.set("owner", data.owner)
    formData.set("inherentLikelihood", data.inherentLikelihood)
    formData.set("inherentImpact", data.inherentImpact)
    formData.set("treatment", data.treatment)
    if (data.treatmentPlan) formData.set("treatmentPlan", data.treatmentPlan)
    if (data.reviewDate) formData.set("reviewDate", data.reviewDate)

    startTransition(async () => {
      const result = isEditing
        ? await updateRisk(initialData.id, formData)
        : await createRisk(formData)

      if (result?.error) {
        const messages = Object.values(result.error).flat()
        setServerError(messages.join(", "))
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {serverError && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        {/* ── Basic Information ─────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Data breach via third-party vendor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the risk, its causes, and potential consequences..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner</FormLabel>
                    <FormControl>
                      <Input placeholder="Risk owner name or role" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Risk Assessment ──────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inherent Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="inherentLikelihood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Likelihood</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select likelihood" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LIKELIHOOD_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How likely is this risk to occur?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inherentImpact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Impact</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select impact" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {IMPACT_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      What is the potential impact if this risk materializes?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Auto-calculated score */}
            {calculatedScore && (
              <div className="flex items-center gap-3 rounded-lg border p-4 bg-muted/30">
                <div className="text-sm font-medium text-muted-foreground">
                  Inherent Risk:
                </div>
                <div className="text-lg font-bold">{calculatedScore.score}</div>
                <Badge
                  variant="outline"
                  className={getRiskColorClass(calculatedScore.level)}
                >
                  {getRiskLevelLabel(calculatedScore.level)}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Treatment ────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk Treatment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="treatment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treatment Strategy</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select treatment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TREATMENT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="treatmentPlan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treatment Plan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the actions planned to treat this risk..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reviewDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) =>
                        field.onChange(
                          date ? date.toISOString().split("T")[0] : ""
                        )
                      }
                      placeholder="Select review date"
                    />
                  </FormControl>
                  <FormDescription>
                    When should this risk be next reviewed?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* ── Submit ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Risk" : "Create Risk"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
