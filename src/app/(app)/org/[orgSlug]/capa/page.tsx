import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { db } from "@/lib/db"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
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
import { Wrench, Plus } from "lucide-react"
import { format } from "date-fns"

export default async function CAPAPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  const capas = await db.cAPA.findMany({
    where: { orgId: org.id, deletedAt: null },
    include: {
      _count: { select: { tasks: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="CAPA"
        description="Corrective and Preventive Actions management"
        actions={
          <Button asChild>
            <Link href={`/org/${orgSlug}/capa/new`}>
              <Plus className="mr-2 h-4 w-4" />
              New CAPA
            </Link>
          </Button>
        }
      />

      {capas.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No CAPAs recorded"
          description="Track corrective and preventive actions to address nonconformities and improve your management system."
          action={
            <Button asChild>
              <Link href={`/org/${orgSlug}/capa/new`}>New CAPA</Link>
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
                <TableHead>Source</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {capas.map((capa) => (
                <TableRow key={capa.id}>
                  <TableCell>
                    <Link
                      href={`/org/${orgSlug}/capa/${capa.id}`}
                      className="font-medium hover:underline"
                    >
                      {capa.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {capa.type.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={capa.status} variant="capa" />
                  </TableCell>
                  <TableCell>{capa.source ?? "—"}</TableCell>
                  <TableCell>
                    {capa.dueDate
                      ? format(capa.dueDate, "MMM d, yyyy")
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
