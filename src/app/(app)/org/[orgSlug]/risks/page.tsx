import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { getRisks } from "@/lib/queries/risks"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/shared/status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyState } from "@/components/shared/empty-state"
import { AlertTriangle, Plus } from "lucide-react"
import { format } from "date-fns"

export default async function RisksPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  const risks = await getRisks(org.id)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Risk Register"
        description="Identify, assess, and manage organizational risks"
        actions={
          <Button asChild>
            <Link href={`/org/${orgSlug}/risks/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Risk
            </Link>
          </Button>
        }
      />

      {risks.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No risks identified"
          description="Start building your risk register by adding your first risk."
          action={
            <Button asChild>
              <Link href={`/org/${orgSlug}/risks/new`}>Add Risk</Link>
            </Button>
          }
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Inherent Level</TableHead>
                <TableHead>Residual Level</TableHead>
                <TableHead>Treatment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Review Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {risks.map((risk) => (
                <TableRow key={risk.id}>
                  <TableCell>
                    <Link
                      href={`/org/${orgSlug}/risks/${risk.id}`}
                      className="font-medium hover:underline"
                    >
                      {risk.title}
                    </Link>
                  </TableCell>
                  <TableCell>{risk.category?.name ?? "—"}</TableCell>
                  <TableCell>
                    <StatusBadge status={risk.inherentLevel} variant="risk" />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={risk.residualLevel} variant="risk" />
                  </TableCell>
                  <TableCell className="capitalize">
                    {risk.treatment.toLowerCase()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={risk.status}
                      colorMap={{
                        IDENTIFIED: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300",
                        ANALYSED: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
                        TREATMENT_PLANNED: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
                        TREATMENT_IN_PROGRESS: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
                        TREATED: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
                        CLOSED: "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400",
                        MONITORING: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {risk.reviewDate
                      ? format(risk.reviewDate, "MMM d, yyyy")
                      : "—"}
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
