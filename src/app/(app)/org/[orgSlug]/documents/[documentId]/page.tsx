import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { getDocumentById } from "@/lib/queries/documents"
import { PageHeader } from "@/components/layout/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowLeft, FileText, History, CheckCircle } from "lucide-react"
import { format } from "date-fns"

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ orgSlug: string; documentId: string }>
}) {
  const { orgSlug, documentId } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  const document = await getDocumentById(documentId, org.id)
  if (!document) notFound()

  const activeVersion = document.versions.find((v) => v.isActive)

  return (
    <div className="space-y-6">
      <PageHeader
        title={document.title}
        description={document.description ?? undefined}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href={`/org/${orgSlug}/documents`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Documents
            </Link>
          </Button>
        }
      />

      {/* Document metadata */}
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={document.status} variant="document" />
        {document.category && (
          <Badge variant="outline">{document.category}</Badge>
        )}
        {activeVersion && (
          <span className="text-sm text-muted-foreground">
            Version {activeVersion.versionNumber}
          </span>
        )}
        {document.nextReview && (
          <span className="text-sm text-muted-foreground">
            Next review: {format(document.nextReview, "MMM d, yyyy")}
          </span>
        )}
      </div>

      {/* Document details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Document Info
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Status</div>
              <div>
                <StatusBadge status={document.status} variant="document" />
              </div>
              <div className="text-muted-foreground">Category</div>
              <div>{document.category ?? "—"}</div>
              <div className="text-muted-foreground">Review Cycle</div>
              <div>
                {document.reviewCycle
                  ? `${document.reviewCycle} days`
                  : "—"}
              </div>
              <div className="text-muted-foreground">Created</div>
              <div>{format(document.createdAt, "MMM d, yyyy")}</div>
              <div className="text-muted-foreground">Updated</div>
              <div>{format(document.updatedAt, "MMM d, yyyy")}</div>
            </div>
            {document.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {document.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {activeVersion && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current Version</CardTitle>
              <CardDescription>
                Version {activeVersion.versionNumber}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">File</div>
                <div className="truncate">{activeVersion.fileName}</div>
                {activeVersion.fileSize && (
                  <>
                    <div className="text-muted-foreground">Size</div>
                    <div>
                      {(activeVersion.fileSize / 1024).toFixed(1)} KB
                    </div>
                  </>
                )}
                <div className="text-muted-foreground">Uploaded</div>
                <div>{format(activeVersion.createdAt, "MMM d, yyyy")}</div>
              </div>
              {activeVersion.changelog && (
                <div className="pt-2">
                  <div className="text-sm text-muted-foreground mb-1">
                    Changelog
                  </div>
                  <p className="text-sm whitespace-pre-wrap">
                    {activeVersion.changelog}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Version history */}
      {document.versions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Version History
              </div>
            </CardTitle>
            <CardDescription>
              {document.versions.length} version{document.versions.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Changelog</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {document.versions.map((version) => (
                  <TableRow key={version.id}>
                    <TableCell className="font-mono text-sm">
                      v{version.versionNumber}
                    </TableCell>
                    <TableCell className="truncate max-w-[200px]">
                      {version.fileName}
                    </TableCell>
                    <TableCell>
                      {version.isActive ? (
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                          Active
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(version.createdAt, "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="truncate max-w-[300px]">
                      {version.changelog ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Approval history */}
      {document.approvals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Approval History
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Step</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Comments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {document.approvals.map((approval) => (
                  <TableRow key={approval.id}>
                    <TableCell>{approval.stepOrder}</TableCell>
                    <TableCell>{approval.user.name ?? approval.user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {approval.action.replace(/_/g, " ").toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(approval.createdAt, "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="truncate max-w-[300px]">
                      {approval.comments ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
