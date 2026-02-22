import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { getAudits } from "@/lib/queries/audits"
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
import { ClipboardList, Plus } from "lucide-react"
import { format } from "date-fns"

export default async function AuditsPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  const audits = await getAudits(org.id)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audits"
        description="Plan, execute, and track compliance audits"
        actions={
          <Button asChild>
            <Link href={`/org/${orgSlug}/audits/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Plan Audit
            </Link>
          </Button>
        }
      />

      {audits.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No audits planned"
          description="Plan your first audit to track compliance activities and findings."
          action={
            <Button asChild>
              <Link href={`/org/${orgSlug}/audits/new`}>Plan Audit</Link>
            </Button>
          }
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audits.map((audit) => (
                <TableRow key={audit.id}>
                  <TableCell>
                    <Link
                      href={`/org/${orgSlug}/audits/${audit.id}`}
                      className="font-medium hover:underline"
                    >
                      {audit.title}
                    </Link>
                  </TableCell>
                  <TableCell className="capitalize">
                    {audit.type.replace(/_/g, " ").toLowerCase()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={audit.status} variant="audit" />
                  </TableCell>
                  <TableCell>
                    {audit.startDate
                      ? format(audit.startDate, "MMM d, yyyy")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {audit.endDate
                      ? format(audit.endDate, "MMM d, yyyy")
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
