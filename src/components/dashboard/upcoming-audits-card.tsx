import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClipboardCheck } from "lucide-react"

const AUDIT_STATUS_VARIANT = {
  PLANNED: "outline" as const,
  IN_PROGRESS: "default" as const,
} as const

const AUDIT_TYPE_LABELS: Record<string, string> = {
  INTERNAL: "Internal",
  EXTERNAL: "External",
  SURVEILLANCE: "Surveillance",
  CERTIFICATION: "Certification",
  RECERTIFICATION: "Recertification",
}

function formatDate(date: Date | null): string {
  if (!date) return "Not scheduled"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export async function UpcomingAuditsCard({ orgId }: { orgId: string }) {
  const audits = await db.audit.findMany({
    where: {
      orgId,
      deletedAt: null,
      status: { in: ["PLANNED", "IN_PROGRESS"] },
    },
    orderBy: { startDate: "asc" },
    take: 5,
    select: {
      id: true,
      title: true,
      type: true,
      status: true,
      startDate: true,
      endDate: true,
    },
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">Upcoming Audits</CardTitle>
          <CardDescription>Planned and in-progress audits</CardDescription>
        </div>
        <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {audits.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming audits scheduled.</p>
        ) : (
          <div className="space-y-4">
            {audits.map((audit) => (
              <div
                key={audit.id}
                className="flex items-start justify-between gap-3 rounded-md border p-3"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-snug">{audit.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {AUDIT_TYPE_LABELS[audit.type] ?? audit.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(audit.startDate)}
                    </span>
                  </div>
                </div>
                <Badge
                  variant={
                    AUDIT_STATUS_VARIANT[audit.status as keyof typeof AUDIT_STATUS_VARIANT] ??
                    "secondary"
                  }
                  className="shrink-0"
                >
                  {audit.status === "IN_PROGRESS" ? "In Progress" : "Planned"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
