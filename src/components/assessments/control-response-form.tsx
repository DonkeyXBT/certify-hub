"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
  Info,
  ChevronDown,
  ChevronUp,
  Target,
  BookOpen,
  CheckCircle2,
  Circle,
  XCircle,
  MinusCircle,
} from "lucide-react"
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
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { saveAssessmentResponse } from "@/lib/actions/assessments"
import { MATURITY_LEVELS } from "@/lib/validations/assessment"
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
  notes: z.string().max(5000).optional(),
  gaps: z.string().max(5000).optional(),
  recommendations: z.string().max(5000).optional(),
})

type ResponseFormValues = z.infer<typeof responseFormSchema>

// ─── Compliance status options ───────────────────────────────────────────────

const COMPLIANCE_OPTIONS: {
  value: ResponseFormValues["complianceStatus"]
  label: string
  description: string
  icon: React.ElementType
  activeClass: string
  inactiveClass: string
}[] = [
  {
    value: "NOT_ASSESSED",
    label: "Not Assessed",
    description: "Not yet evaluated",
    icon: Circle,
    activeClass: "border-gray-400 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
    inactiveClass: "border-border hover:border-gray-400 text-muted-foreground",
  },
  {
    value: "NON_COMPLIANT",
    label: "Non-Compliant",
    description: "Does not meet requirements",
    icon: XCircle,
    activeClass: "border-red-500 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    inactiveClass: "border-border hover:border-red-400 text-muted-foreground",
  },
  {
    value: "PARTIALLY_COMPLIANT",
    label: "Partially Compliant",
    description: "Meets some requirements",
    icon: MinusCircle,
    activeClass: "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    inactiveClass: "border-border hover:border-amber-400 text-muted-foreground",
  },
  {
    value: "COMPLIANT",
    label: "Compliant",
    description: "Fully meets requirements",
    icon: CheckCircle2,
    activeClass: "border-green-500 bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400",
    inactiveClass: "border-border hover:border-green-400 text-muted-foreground",
  },
]

// ─── Component ──────────────────────────────────────────────────────────────

export function ControlResponseForm({
  assessmentId,
  control,
  existingResponse,
  isCompleted,
}: ControlResponseFormProps) {
  const [isPending, startTransition] = useTransition()
  const [guidanceOpen, setGuidanceOpen] = useState(false)

  const form = useForm<ResponseFormValues>({
    resolver: zodResolver(responseFormSchema),
    defaultValues: {
      complianceStatus:
        (existingResponse?.complianceStatus as ResponseFormValues["complianceStatus"]) ??
        "NOT_ASSESSED",
      maturityLevel: existingResponse?.maturityLevel
        ? String(existingResponse.maturityLevel)
        : "",
      notes: existingResponse?.notes ?? "",
      gaps: existingResponse?.gaps ?? "",
      recommendations: existingResponse?.recommendations ?? "",
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
      if (data.notes) fd.set("notes", data.notes)
      if (data.gaps) fd.set("gaps", data.gaps)
      if (data.recommendations) fd.set("recommendations", data.recommendations)

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

  const hasGuidance = control.objective || control.guidance

  return (
    <div className="space-y-4">
      {/* ── Control header ─────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="shrink-0">{control.clauseNumber}</Badge>
            <span className="text-sm text-muted-foreground truncate">
              {control.clauseTitle}
            </span>
          </div>
          <CardTitle className="text-lg leading-snug">
            {control.number} — {control.title}
          </CardTitle>
        </CardHeader>

        {/* Objective — always visible if present */}
        {control.objective && (
          <CardContent className="pt-0 pb-4">
            <div className="flex items-start gap-2 rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-3">
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide mb-1">
                  Objective
                </p>
                <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                  {control.objective}
                </p>
              </div>
            </div>
          </CardContent>
        )}

        {/* Implementation guidance — collapsible */}
        {control.guidance && (
          <CardContent className="pt-0 pb-4">
            <button
              type="button"
              onClick={() => setGuidanceOpen((v) => !v)}
              className="w-full flex items-center justify-between rounded-md border border-border hover:border-primary/40 px-3 py-2 text-sm text-left transition-colors"
            >
              <span className="flex items-center gap-2 font-medium">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                Implementation Guidance
              </span>
              {guidanceOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {guidanceOpen && (
              <div className="mt-2 rounded-md bg-muted/50 border border-border p-3">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                  {control.guidance}
                </p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* ── Response form ──────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-5">
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* Compliance status — visual cards */}
              <FormField
                control={form.control}
                name="complianceStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compliance Status</FormLabel>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {COMPLIANCE_OPTIONS.map((opt) => {
                        const Icon = opt.icon
                        const isActive = field.value === opt.value
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => field.onChange(opt.value)}
                            className={`rounded-md border-2 p-2.5 text-left transition-all ${
                              isActive ? opt.activeClass : opt.inactiveClass
                            }`}
                          >
                            <Icon className="h-4 w-4 mb-1.5" />
                            <div className="text-xs font-semibold leading-tight">
                              {opt.label}
                            </div>
                            <div className="text-xs opacity-70 mt-0.5 leading-tight">
                              {opt.description}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Maturity level */}
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
                          <SelectValue placeholder="Select maturity level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MATURITY_LEVELS.map((level) => (
                          <SelectItem
                            key={level.value}
                            value={String(level.value)}
                          >
                            <span className="font-medium">{level.label}</span>
                            <span className="text-muted-foreground ml-2">
                              — {level.description}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Current situation */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Situation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe how this control is currently handled in your organization — what processes, tools, or policies are in place today..."
                        className="min-h-[90px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Identified gaps */}
              <FormField
                control={form.control}
                name="gaps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identified Gaps</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What is missing or not yet in place? Describe the difference between the current situation and what is required..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Recommendations */}
              <FormField
                control={form.control}
                name="recommendations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recommendations</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What actions should be taken to close the gaps and achieve full compliance?"
                        className="min-h-[80px]"
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
    </div>
  )
}
