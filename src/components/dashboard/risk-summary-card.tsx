import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

const RISK_LEVEL_CONFIG = {
  CRITICAL: { label: "Critical", color: "bg-red-500", textColor: "text-red-700 dark:text-red-400" },
  HIGH: { label: "High", color: "bg-orange-500", textColor: "text-orange-700 dark:text-orange-400" },
  MEDIUM: { label: "Medium", color: "bg-yellow-500", textColor: "text-yellow-700 dark:text-yellow-400" },
  LOW: { label: "Low", color: "bg-green-500", textColor: "text-green-700 dark:text-green-400" },
} as const

type RiskLevelKey = keyof typeof RISK_LEVEL_CONFIG

export async function RiskSummaryCard({ orgId }: { orgId: string }) {
  const risks = await db.risk.findMany({
    where: { orgId, deletedAt: null, status: { not: "CLOSED" } },
    select: { residualLevel: true },
  })

  const grouped = risks.reduce<Record<RiskLevelKey, number>>(
    (acc, risk) => {
      const level = risk.residualLevel as RiskLevelKey
      acc[level] = (acc[level] || 0) + 1
      return acc
    },
    { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 }
  )

  const totalRisks = risks.length

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">Risk Summary</CardTitle>
          <CardDescription>{totalRisks} open {totalRisks === 1 ? "risk" : "risks"}</CardDescription>
        </div>
        <AlertTriangle className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {totalRisks === 0 ? (
          <p className="text-sm text-muted-foreground">No open risks identified.</p>
        ) : (
          <div className="space-y-3">
            {(Object.keys(RISK_LEVEL_CONFIG) as RiskLevelKey[]).map((level) => {
              const config = RISK_LEVEL_CONFIG[level]
              const count = grouped[level]
              const percentage = totalRisks > 0 ? Math.round((count / totalRisks) * 100) : 0

              return (
                <div key={level} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${config.textColor}`}>{config.label}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all ${config.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
