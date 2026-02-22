import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { getAssessmentsByOrg } from "@/lib/queries/assessments"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EmptyState } from "@/components/shared/empty-state"
import { ClipboardCheck, Plus } from "lucide-react"
import { format } from "date-fns"

export default async function AssessmentsPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  const assessments = await getAssessmentsByOrg(org.id)

  const statusColors: Record<string, string> = {
    NOT_STARTED: "secondary",
    IN_PROGRESS: "default",
    COMPLETED: "outline",
    ARCHIVED: "destructive",
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessments"
        description="Gap analysis and compliance assessments"
        actions={
          <Button asChild>
            <Link href={`/org/${orgSlug}/assessments/new`}><Plus className="mr-2 h-4 w-4" />New Assessment</Link>
          </Button>
        }
      />
      {assessments.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title="No assessments yet" description="Create your first assessment to evaluate compliance." action={<Button asChild><Link href={`/org/${orgSlug}/assessments/new`}>Create Assessment</Link></Button>} />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Framework</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <Link href={`/org/${orgSlug}/assessments/${a.id}`} className="font-medium hover:underline">{a.name}</Link>
                  </TableCell>
                  <TableCell>{a.framework.name}</TableCell>
                  <TableCell><Badge variant={statusColors[a.status] as "default" | "secondary" | "outline" | "destructive"}>{a.status.replace(/_/g, " ")}</Badge></TableCell>
                  <TableCell>{a.overallScore ? `${Math.round(a.overallScore)}%` : "—"}</TableCell>
                  <TableCell>{a.startDate ? format(a.startDate, "MMM d, yyyy") : "—"}</TableCell>
                  <TableCell>{format(a.updatedAt, "MMM d, yyyy")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
