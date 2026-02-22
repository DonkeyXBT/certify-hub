import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { getDocuments } from "@/lib/queries/documents"
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
import { FileText, Plus } from "lucide-react"
import { format } from "date-fns"

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  const documents = await getDocuments(org.id)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Manage policies, procedures, and compliance documents"
        actions={
          <Button asChild>
            <Link href={`/org/${orgSlug}/documents/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Document
            </Link>
          </Button>
        }
      />

      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="Upload and manage your compliance documents, policies, and procedures."
          action={
            <Button asChild>
              <Link href={`/org/${orgSlug}/documents/new`}>Add Document</Link>
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
                <TableHead>Status</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Next Review</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <Link
                      href={`/org/${orgSlug}/documents/${doc.id}`}
                      className="font-medium hover:underline"
                    >
                      {doc.title}
                    </Link>
                  </TableCell>
                  <TableCell>{doc.category ?? "—"}</TableCell>
                  <TableCell>
                    <StatusBadge status={doc.status} variant="document" />
                  </TableCell>
                  <TableCell>
                    {doc.currentVersion
                      ? `v${doc.currentVersion.versionNumber}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {doc.nextReview
                      ? format(doc.nextReview, "MMM d, yyyy")
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
