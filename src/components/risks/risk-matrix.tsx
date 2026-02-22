"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface Risk {
  id: string
  title: string
  residualLikelihood: string
  residualImpact: string
}

interface RiskMatrixProps {
  risks: Risk[]
  onCellClick?: (likelihood: string, impact: string) => void
}

const LIKELIHOOD_VALUES: Record<string, number> = {
  VERY_LOW: 1, LOW: 2, MEDIUM: 3, HIGH: 4, VERY_HIGH: 5,
}
const IMPACT_VALUES: Record<string, number> = {
  NEGLIGIBLE: 1, MINOR: 2, MODERATE: 3, MAJOR: 4, CATASTROPHIC: 5,
}

const LIKELIHOOD_LABELS = ["VERY_HIGH", "HIGH", "MEDIUM", "LOW", "VERY_LOW"]
const IMPACT_LABELS = ["NEGLIGIBLE", "MINOR", "MODERATE", "MAJOR", "CATASTROPHIC"]

function getCellColor(likelihood: number, impact: number): string {
  const score = likelihood * impact
  if (score >= 16) return "bg-red-500 text-white"
  if (score >= 10) return "bg-orange-500 text-white"
  if (score >= 5) return "bg-yellow-400 text-black"
  return "bg-green-500 text-white"
}

function formatLabel(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

export function RiskMatrix({ risks, onCellClick }: RiskMatrixProps) {
  const risksByCell: Record<string, Risk[]> = {}
  for (const risk of risks) {
    const key = `${risk.residualLikelihood}-${risk.residualImpact}`
    if (!risksByCell[key]) risksByCell[key] = []
    risksByCell[key].push(risk)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Risk Heat Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-xs font-medium text-muted-foreground w-24">Likelihood / Impact</th>
                {IMPACT_LABELS.map((impact) => (
                  <th key={impact} className="p-2 text-xs font-medium text-center">{formatLabel(impact)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LIKELIHOOD_LABELS.map((likelihood) => (
                <tr key={likelihood}>
                  <td className="p-2 text-xs font-medium text-right pr-3">{formatLabel(likelihood)}</td>
                  {IMPACT_LABELS.map((impact) => {
                    const key = `${likelihood}-${impact}`
                    const cellRisks = risksByCell[key] || []
                    const lVal = LIKELIHOOD_VALUES[likelihood]
                    const iVal = IMPACT_VALUES[impact]

                    return (
                      <td key={key} className="p-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className={`w-full h-12 rounded text-sm font-bold transition-transform hover:scale-105 ${getCellColor(lVal, iVal)}`}
                              onClick={() => onCellClick?.(likelihood, impact)}
                            >
                              {cellRisks.length || ""}
                            </button>
                          </TooltipTrigger>
                          {cellRisks.length > 0 && (
                            <TooltipContent>
                              <div className="text-xs space-y-1">
                                {cellRisks.map((r) => <div key={r.id}>{r.title}</div>)}
                              </div>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
