import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getOrganizationBySlug } from "@/lib/queries/organization"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default async function NewAuditPage({
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
        title="Plan Audit"
        description="Schedule and configure a new compliance audit"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Audit Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="e.g. ISO 27001 Internal Audit Q1 2026" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Audit Type</Label>
              <Select>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INTERNAL">Internal</SelectItem>
                  <SelectItem value="EXTERNAL">External</SelectItem>
                  <SelectItem value="SURVEILLANCE">Surveillance</SelectItem>
                  <SelectItem value="CERTIFICATION">Certification</SelectItem>
                  <SelectItem value="RECERTIFICATION">Recertification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportDate">Report Date</Label>
              <Input id="reportDate" type="date" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="scope">Scope</Label>
            <Textarea
              id="scope"
              placeholder="Define the scope of this audit..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="objectives">Objectives</Label>
            <Textarea
              id="objectives"
              placeholder="Define the audit objectives..."
              rows={3}
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button>Create Audit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
