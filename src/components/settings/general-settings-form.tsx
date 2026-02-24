"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateOrganization } from "@/lib/actions/organization"
import { format } from "date-fns"

interface GeneralSettingsFormProps {
  orgId: string
  orgSlug: string
  name: string
  industry: string | null
  size: string | null
  createdAt: Date
}

export function GeneralSettingsForm({
  orgId,
  orgSlug,
  name,
  industry,
  size,
  createdAt,
}: GeneralSettingsFormProps) {
  const [isPending, startTransition] = useTransition()

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const result = (await updateOrganization(formData)) as any
      if (result?.error) {
        toast.error(typeof result.error === "string" ? result.error : "Failed to update")
      } else {
        toast.success("Settings saved")
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Organization Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="space-y-4">
          <input type="hidden" name="orgId" value={orgId} />
          <input type="hidden" name="orgSlug" value={orgSlug} />

          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input id="name" name="name" defaultValue={name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" defaultValue={orgSlug} disabled />
            <p className="text-xs text-muted-foreground">
              The URL-friendly identifier for your organization. This cannot be
              changed.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                name="industry"
                defaultValue={industry ?? ""}
                placeholder="e.g. Technology, Healthcare, Finance"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Organization Size</Label>
              <Input
                id="size"
                name="size"
                defaultValue={size ?? ""}
                placeholder="e.g. 1-50, 51-200, 201-500"
              />
            </div>
          </div>
          <Separator />
          <div className="text-sm text-muted-foreground">
            Created: {format(createdAt, "MMMM d, yyyy")}
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
