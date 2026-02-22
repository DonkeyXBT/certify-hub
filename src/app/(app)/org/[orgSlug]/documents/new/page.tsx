import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default async function NewDocumentPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const org = await getOrganizationBySlug(orgSlug)
  if (!org) redirect("/onboarding")

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Document"
        description="Upload a new compliance document"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Document Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="e.g. Information Security Policy" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this document..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" placeholder="e.g. Policy, Procedure, Standard" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">File Upload</Label>
            <Input id="file" type="file" />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button>Create Document</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
