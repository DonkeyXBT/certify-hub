"use client"

import { useState, useTransition, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { saveAssessmentResponse, completeAssessment } from "@/lib/actions/assessments"
import { flattenClauses } from "@/lib/utils/assessment-helpers"
import { toast } from "sonner"
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Target,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  XCircle,
  MinusCircle,
} from "lucide-react"
import { MATURITY_LEVELS } from "@/lib/validations/assessment"

interface AssessmentWizardProps {
  assessment: any
  orgSlug: string
}

const COMPLIANCE_OPTIONS = [
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
    label: "Partial",
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
] as const

export function AssessmentWizard({ assessment }: AssessmentWizardProps) {
  const allControls = flattenClauses(assessment.framework?.clauses ?? [])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [guidanceOpen, setGuidanceOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const current = allControls[currentIndex]

  // Form state — reset when navigating to a different control
  const existingResponse = current
    ? assessment.responses.find((r: any) => r.controlId === current.id)
    : null

  const [complianceStatus, setComplianceStatus] = useState(
    existingResponse?.complianceStatus ?? "NOT_ASSESSED"
  )
  const [maturityLevel, setMaturityLevel] = useState(
    String(existingResponse?.maturityLevel ?? "")
  )
  const [notes, setNotes] = useState(existingResponse?.notes ?? "")
  const [gaps, setGaps] = useState(existingResponse?.gaps ?? "")
  const [recommendations, setRecommendations] = useState(
    existingResponse?.recommendations ?? ""
  )

  // Reset form when navigating controls
  useEffect(() => {
    if (!current) return
    const resp = assessment.responses.find((r: any) => r.controlId === current.id)
    setComplianceStatus(resp?.complianceStatus ?? "NOT_ASSESSED")
    setMaturityLevel(String(resp?.maturityLevel ?? ""))
    setNotes(resp?.notes ?? "")
    setGaps(resp?.gaps ?? "")
    setRecommendations(resp?.recommendations ?? "")
    setGuidanceOpen(false)
  }, [currentIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!current) return <div>No controls found in this framework.</div>

  const progress = Math.round(((currentIndex + 1) / allControls.length) * 100)
  const answeredCount = assessment.responses.length

  function saveAndNavigate(nextIndex: number) {
    startTransition(async () => {
      const fd = new FormData()
      fd.set("assessmentId", assessment.id)
      fd.set("controlId", current.id)
      fd.set("clauseId", current.clauseId)
      fd.set("complianceStatus", complianceStatus)
      if (maturityLevel) fd.set("maturityLevel", maturityLevel)
      if (notes) fd.set("notes", notes)
      if (gaps) fd.set("gaps", gaps)
      if (recommendations) fd.set("recommendations", recommendations)

      const result = (await saveAssessmentResponse(fd)) as any
      if (result?.error) {
        toast.error(String(result.error))
        return
      }
      toast.success("Response saved")
      setCurrentIndex(nextIndex)
    })
  }

  function handleComplete() {
    startTransition(async () => {
      await completeAssessment(assessment.id)
      toast.success("Assessment completed!")
    })
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Control {currentIndex + 1} of {allControls.length}
        </span>
        <span>{answeredCount} answered</span>
      </div>
      <Progress value={progress} />

      {/* Control info card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="shrink-0">
              {current.clauseNumber}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {current.clauseTitle}
            </span>
          </div>
          <CardTitle className="text-lg leading-snug">
            {current.number} — {current.title}
          </CardTitle>
        </CardHeader>

        {/* Objective */}
        {current.objective && (
          <CardContent className="pt-0 pb-4">
            <div className="flex items-start gap-2 rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-3">
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide mb-1">
                  Objective
                </p>
                <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                  {current.objective}
                </p>
              </div>
            </div>
          </CardContent>
        )}

        {/* Guidance — collapsible */}
        {current.guidance && (
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
                  {current.guidance}
                </p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Response form */}
      <Card>
        <CardContent className="pt-5 space-y-5">
          {/* Compliance status — visual cards */}
          <div className="space-y-2">
            <Label>Compliance Status</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {COMPLIANCE_OPTIONS.map((opt) => {
                const Icon = opt.icon
                const isActive = complianceStatus === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setComplianceStatus(opt.value)}
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
          </div>

          {/* Maturity level */}
          <div className="space-y-2">
            <Label>Maturity Level</Label>
            <Select value={maturityLevel} onValueChange={setMaturityLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select maturity level" />
              </SelectTrigger>
              <SelectContent>
                {MATURITY_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={String(level.value)}>
                    <span className="font-medium">{level.label}</span>
                    <span className="text-muted-foreground ml-2">
                      — {level.description}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Current situation */}
          <div className="space-y-2">
            <Label>Current Situation</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe how this control is currently handled in your organization — what processes, tools, or policies are in place today..."
              className="min-h-[80px]"
            />
          </div>

          {/* Gaps */}
          <div className="space-y-2">
            <Label>Identified Gaps</Label>
            <Textarea
              value={gaps}
              onChange={(e) => setGaps(e.target.value)}
              placeholder="What is missing or not yet in place? Describe the difference between the current situation and what is required..."
              className="min-h-[80px]"
            />
          </div>

          {/* Recommendations */}
          <div className="space-y-2">
            <Label>Recommendations</Label>
            <Textarea
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              placeholder="What actions should be taken to close the gaps and achieve full compliance?"
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => saveAndNavigate(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0 || isPending}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <div className="flex gap-2">
          {currentIndex < allControls.length - 1 ? (
            <Button
              onClick={() => saveAndNavigate(currentIndex + 1)}
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save & Next"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => saveAndNavigate(currentIndex)}
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={handleComplete}
                disabled={isPending}
              >
                <Check className="mr-2 h-4 w-4" />
                Complete Assessment
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
