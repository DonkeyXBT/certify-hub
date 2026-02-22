"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { saveAssessmentResponse, completeAssessment } from "@/lib/actions/assessments"
import { toast } from "sonner"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"

interface AssessmentWizardProps {
  assessment: any
  orgSlug: string
}

type FlatControl = {
  id: string
  number: string
  title: string
  clauseNumber: string
  clauseTitle: string
  clauseId: string
}

function flattenClauses(clauses: any[]): FlatControl[] {
  const result: FlatControl[] = []
  function process(clause: any) {
    if (clause.controls?.length > 0) {
      for (const ctrl of clause.controls) {
        result.push({ id: ctrl.id, number: ctrl.number, title: ctrl.title, clauseNumber: clause.number, clauseTitle: clause.title, clauseId: clause.id })
      }
    }
    if (clause.children?.length > 0) {
      for (const child of clause.children) process(child)
    }
  }
  for (const c of clauses) process(c)
  return result
}

export function AssessmentWizard({ assessment, orgSlug }: AssessmentWizardProps) {
  const allControls = flattenClauses(assessment.framework?.clauses ?? [])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPending, startTransition] = useTransition()

  const current = allControls[currentIndex]
  if (!current) return <div>No controls found in this framework.</div>

  const existingResponse = assessment.responses.find((r: any) => r.controlId === current.id)
  const [complianceStatus, setComplianceStatus] = useState(existingResponse?.complianceStatus ?? "NOT_ASSESSED")
  const [maturityLevel, setMaturityLevel] = useState(String(existingResponse?.maturityLevel ?? ""))
  const [gaps, setGaps] = useState(existingResponse?.gaps ?? "")
  const [recommendations, setRecommendations] = useState(existingResponse?.recommendations ?? "")

  const progress = Math.round(((currentIndex + 1) / allControls.length) * 100)
  const answeredCount = assessment.responses.length

  function saveAndNext() {
    startTransition(async () => {
      const fd = new FormData()
      fd.set("assessmentId", assessment.id)
      fd.set("controlId", current.id)
      fd.set("clauseId", current.clauseId)
      fd.set("complianceStatus", complianceStatus)
      if (maturityLevel) fd.set("maturityLevel", maturityLevel)
      if (gaps) fd.set("gaps", gaps)
      if (recommendations) fd.set("recommendations", recommendations)
      const result = await saveAssessmentResponse(fd) as any
      if (result?.error) {
        toast.error(String(result.error))
        return
      }
      if (currentIndex < allControls.length - 1) {
        setCurrentIndex(currentIndex + 1)
        const next = allControls[currentIndex + 1]
        const nextResp = assessment.responses.find((r: any) => r.controlId === next.id)
        setComplianceStatus(nextResp?.complianceStatus ?? "NOT_ASSESSED")
        setMaturityLevel(String(nextResp?.maturityLevel ?? ""))
        setGaps(nextResp?.gaps ?? "")
        setRecommendations(nextResp?.recommendations ?? "")
      }
      toast.success("Response saved")
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
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Control {currentIndex + 1} of {allControls.length}</span>
        <span>{answeredCount} answered</span>
      </div>
      <Progress value={progress} />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{current.clauseNumber}</Badge>
            <span className="text-sm text-muted-foreground">{current.clauseTitle}</span>
          </div>
          <CardTitle className="text-lg">{current.number} — {current.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Compliance Status</Label>
            <Select value={complianceStatus} onValueChange={setComplianceStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="NOT_ASSESSED">Not Assessed</SelectItem>
                <SelectItem value="NON_COMPLIANT">Non-Compliant</SelectItem>
                <SelectItem value="PARTIALLY_COMPLIANT">Partially Compliant</SelectItem>
                <SelectItem value="COMPLIANT">Compliant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Maturity Level (1-5)</Label>
            <Select value={maturityLevel} onValueChange={setMaturityLevel}>
              <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((l) => (
                  <SelectItem key={l} value={String(l)}>{l} — {["Initial", "Managed", "Defined", "Quantitatively Managed", "Optimizing"][l - 1]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Identified Gaps</Label>
            <Textarea value={gaps} onChange={(e) => setGaps(e.target.value)} placeholder="Describe any gaps..." />
          </div>
          <div className="space-y-2">
            <Label>Recommendations</Label>
            <Textarea value={recommendations} onChange={(e) => setRecommendations(e.target.value)} placeholder="Recommended actions..." />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0}>
          <ChevronLeft className="mr-2 h-4 w-4" />Previous
        </Button>
        <div className="flex gap-2">
          <Button onClick={saveAndNext} disabled={isPending}>
            {isPending ? "Saving..." : currentIndex < allControls.length - 1 ? (<>Save & Next<ChevronRight className="ml-2 h-4 w-4" /></>) : "Save"}
          </Button>
          {currentIndex === allControls.length - 1 && (
            <Button variant="default" onClick={handleComplete} disabled={isPending}>
              <Check className="mr-2 h-4 w-4" />Complete Assessment
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
