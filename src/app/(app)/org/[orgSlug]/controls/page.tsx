import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { db } from "@/lib/db"
import { PageHeader } from "@/components/layout/page-header"
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
import { Shield } from "lucide-react"
import { format } from "date-fns"

const effectivenessColorMap: Record<string, string> = {
  NOT_TESTED: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300",
  INEFFECTIVE: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  PARTIALLY_EFFECTIVE: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
  EFFECTIVE: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
}

const implStatusColorMap: Record<string, string> = {
  NOT_IMPLEMENTED: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  PLANNED: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
  PARTIALLY_IMPLEMENTED: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
  FULLY_IMPLEMENTED: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
  NOT_APPLICABLE: "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400",
}

export default async function ControlsPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  const implementations = await db.controlImplementation.findMany({
    where: { orgId: org.id },
    include: {
      control: {
        include: {
          clause: {
            select: { number: true, title: true },
          },
        },
      },
    },
    orderBy: { control: { number: "asc" } },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Controls"
        description="Track control implementation status and effectiveness"
      />

      {implementations.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="No control implementations"
          description="Control implementations will appear here once frameworks are assessed and controls are mapped."
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Control Number</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Effectiveness</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {implementations.map((impl) => (
                <TableRow key={impl.id}>
                  <TableCell className="font-mono text-sm">
                    {impl.control.number}
                  </TableCell>
                  <TableCell className="font-medium">
                    {impl.control.title}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={impl.status}
                      colorMap={implStatusColorMap}
                    />
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={impl.effectiveness}
                      colorMap={effectivenessColorMap}
                    />
                  </TableCell>
                  <TableCell>
                    {format(impl.updatedAt, "MMM d, yyyy")}
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
