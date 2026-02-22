import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { db } from "@/lib/db"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
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
import { FolderArchive, Upload } from "lucide-react"
import { format } from "date-fns"

export default async function EvidencePage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  const evidence = await db.evidence.findMany({
    where: { orgId: org.id, deletedAt: null },
    include: {
      controlImplementation: {
        include: {
          control: {
            select: { number: true, title: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evidence"
        description="Manage evidence artifacts linked to controls"
        actions={
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Evidence
          </Button>
        }
      />

      {evidence.length === 0 ? (
        <EmptyState
          icon={FolderArchive}
          title="No evidence collected"
          description="Upload evidence to support your control implementations and audit activities."
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Control</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Valid</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evidence.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {item.type.replace(/_/g, " ").toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.controlImplementation
                      ? `${item.controlImplementation.control.number} - ${item.controlImplementation.control.title}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {format(item.createdAt, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {item.expiryDate
                      ? format(item.expiryDate, "MMM d, yyyy")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {item.isValid ? (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400"
                      >
                        Valid
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400"
                      >
                        Invalid
                      </Badge>
                    )}
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
