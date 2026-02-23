"use client"

import { useState, useMemo } from "react"
import { ClipboardCheck } from "lucide-react"
import { ControlNavigator } from "@/components/assessments/control-navigator"
import { ControlResponseForm } from "@/components/assessments/control-response-form"
import { flattenClauses } from "@/lib/utils/assessment-helpers"
import type { AssessmentWithResponses } from "@/lib/queries/assessments"

interface AssessmentEditorProps {
  assessment: AssessmentWithResponses
  orgSlug: string
}

export function AssessmentEditor({ assessment }: AssessmentEditorProps) {
  const [selectedControlId, setSelectedControlId] = useState<string | null>(
    null
  )

  const controlLookup = useMemo(() => {
    const controls = flattenClauses(assessment.framework?.clauses ?? [])
    return new Map(controls.map((c) => [c.id, c]))
  }, [assessment.framework?.clauses])

  const responseMap = useMemo(() => {
    const map = new Map<
      string,
      {
        complianceStatus: string
        maturityLevel: number | null
        gaps: string | null
        recommendations: string | null
        notes: string | null
      }
    >()
    for (const r of assessment.responses) {
      if (r.controlId) {
        map.set(r.controlId, {
          complianceStatus: r.complianceStatus,
          maturityLevel: r.maturityLevel,
          gaps: r.gaps,
          recommendations: r.recommendations,
          notes: r.notes,
        })
      }
    }
    return map
  }, [assessment.responses])

  const selectedControl = selectedControlId
    ? controlLookup.get(selectedControlId)
    : null

  return (
    <div className="flex gap-6" style={{ minHeight: "600px" }}>
      {/* Left panel: control navigator */}
      <div className="w-80 shrink-0">
        <ControlNavigator
          clauses={assessment.framework?.clauses ?? []}
          responses={responseMap}
          selectedControlId={selectedControlId}
          onSelectControl={setSelectedControlId}
        />
      </div>

      {/* Right panel: response form */}
      <div className="flex-1 min-w-0">
        {selectedControl ? (
          <ControlResponseForm
            key={selectedControlId}
            assessmentId={assessment.id}
            control={selectedControl}
            existingResponse={
              selectedControlId
                ? responseMap.get(selectedControlId) ?? null
                : null
            }
            isCompleted={assessment.status === "COMPLETED"}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 px-4">
            <ClipboardCheck className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-lg">Select a control</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Choose a control from the left panel to view or edit its
              assessment response.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
