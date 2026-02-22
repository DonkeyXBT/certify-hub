import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { getSoAEntries, getFrameworkForSoA } from "@/lib/queries/soa"
import { PageHeader } from "@/components/layout/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyState } from "@/components/shared/empty-state"
import { FileCheck } from "lucide-react"

const implStatusColorMap: Record<string, string> = {
  NOT_IMPLEMENTED: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  PLANNED: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
  PARTIALLY_IMPLEMENTED: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
  FULLY_IMPLEMENTED: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
  NOT_APPLICABLE: "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400",
}

export default async function SoAPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  const framework = await getFrameworkForSoA(org.id)

  if (!framework) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Statement of Applicability"
          description="Declare which controls apply to your organization"
        />
        <EmptyState
          icon={FileCheck}
          title="No ISO 27001 framework found"
          description="The Statement of Applicability requires a published ISO 27001 framework. Please ensure one is available."
        />
      </div>
    )
  }

  const entries = await getSoAEntries(org.id, framework.id)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Statement of Applicability"
        description={`${framework.name} (${framework.version}) -- Declare which controls apply to your organization`}
      />

      {entries.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title="No SoA entries"
          description="Statement of Applicability entries have not been created yet. Generate them from the framework controls."
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Control Number</TableHead>
                <TableHead>Control Title</TableHead>
                <TableHead>Applicability</TableHead>
                <TableHead>Justification</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-mono text-sm">
                    {entry.control.number}
                  </TableCell>
                  <TableCell className="font-medium">
                    {entry.control.title}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        entry.applicability === "APPLICABLE"
                          ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400"
                      }
                    >
                      {entry.applicability === "APPLICABLE"
                        ? "Applicable"
                        : "Not Applicable"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {entry.justification ?? "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={entry.implStatus}
                      colorMap={implStatusColorMap}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
