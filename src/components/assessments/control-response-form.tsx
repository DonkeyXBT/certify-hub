"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { saveAssessmentResponse } from "@/lib/actions/assessments"
import {
  COMPLIANCE_STATUS_OPTIONS,
  MATURITY_LEVELS,
} from "@/lib/validations/assessment"
import type { FlatControl } from "@/lib/utils/assessment-helpers"

// ─── Types ──────────────────────────────────────────────────────────────────

interface ControlResponseFormProps {
  assessmentId: string
  control: FlatControl
  existingResponse: {
    complianceStatus: string
    maturityLevel: number | null
    gaps: string | null
    recommendations: string | null
    notes: string | null
  } | null
  isCompleted: boolean
}

// ─── Schema ─────────────────────────────────────────────────────────────────

const responseFormSchema = z.object({
  complianceStatus: z.enum([
    "NOT_ASSESSED",
    "NON_COMPLIANT",
    "PARTIALLY_COMPLIANT",
    "COMPLIANT",
  ]),
  maturityLevel: z.string().optional(),
  gaps: z.string().max(5000).optional(),
  recommendations: z.string().max(5000).optional(),
  notes: z.string().max(5000).optional(),
})

type ResponseFormValues = z.infer<typeof responseFormSchema>

// ─── Component ──────────────────────────────────────────────────────────────

export function ControlResponseForm({
  assessmentId,
  control,
  existingResponse,
  isCompleted,
}: ControlResponseFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<ResponseFormValues>({
    resolver: zodResolver(responseFormSchema),
    defaultValues: {
      complianceStatus:
        (existingResponse?.complianceStatus as ResponseFormValues["complianceStatus"]) ??
        "NOT_ASSESSED",
      maturityLevel: existingResponse?.maturityLevel
        ? String(existingResponse.maturityLevel)
        : "",
      gaps: existingResponse?.gaps ?? "",
      recommendations: existingResponse?.recommendations ?? "",
      notes: existingResponse?.notes ?? "",
    },
  })

  function onSubmit(data: ResponseFormValues) {
    startTransition(async () => {
      const fd = new FormData()
      fd.set("assessmentId", assessmentId)
      fd.set("controlId", control.id)
      fd.set("clauseId", control.clauseId)
      fd.set("complianceStatus", data.complianceStatus)
      if (data.maturityLevel) fd.set("maturityLevel", data.maturityLevel)
      if (data.gaps) fd.set("gaps", data.gaps)
      if (data.recommendations) fd.set("recommendations", data.recommendations)
      if (data.notes) fd.set("notes", data.notes)

      const result = (await saveAssessmentResponse(fd)) as any
      if (result?.error) {
        const msg =
          typeof result.error === "string"
            ? result.error
            : Object.values(result.error).flat().join(", ")
        toast.error(msg)
      } else {
        toast.success("Response saved")
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{control.clauseNumber}</Badge>
          <span className="text-sm text-muted-foreground">
            {control.clauseTitle}
          </span>
        </div>
        <CardTitle className="text-lg">
          {control.number} — {control.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isCompleted && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              This assessment is completed. Saving changes will reopen it for
              editing.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="complianceStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compliance Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COMPLIANCE_STATUS_OPTIONS.map((opt) => (
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
                name="maturityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maturity Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MATURITY_LEVELS.map((level) => (
                          <SelectItem
                            key={level.value}
                            value={String(level.value)}
                          >
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="gaps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identified Gaps</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe any gaps found..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recommendations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recommendations</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Recommended actions to address gaps..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes or observations..."
                      className="min-h-[60px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Response"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
