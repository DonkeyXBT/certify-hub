"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateBranding } from "@/lib/actions/organization"

interface BrandingFormProps {
  orgId: string
  orgSlug: string
  primaryColor: string | null
  appName: string | null
  logoUrl: string | null
}

export function BrandingForm({
  orgId,
  orgSlug,
  primaryColor,
  appName,
  logoUrl,
}: BrandingFormProps) {
  const [isPending, startTransition] = useTransition()
  const [color, setColor] = useState(primaryColor ?? "#1d4ed8")
  const [previewLogo, setPreviewLogo] = useState(logoUrl ?? "")

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const result = (await updateBranding(formData)) as any
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Branding saved")
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Branding & White Label</CardTitle>
        <CardDescription>
          Customize the look and feel of CertifyHub for your organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="space-y-6">
          <input type="hidden" name="orgId" value={orgId} />
          <input type="hidden" name="orgSlug" value={orgSlug} />

          <div className="space-y-2">
            <Label htmlFor="appName">Custom Application Name</Label>
            <Input
              id="appName"
              name="appName"
              defaultValue={appName ?? ""}
              placeholder="e.g. Acme Compliance Hub"
            />
            <p className="text-xs text-muted-foreground">
              Displayed in the sidebar instead of the organization name. Leave
              empty to use the default.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Primary Brand Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="primaryColor"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded border p-1"
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#1d4ed8"
                className="max-w-[140px] font-mono"
              />
              <div
                className="h-10 flex-1 rounded border"
                style={{ backgroundColor: color }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Used as the primary accent color across the application.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              name="logoUrl"
              defaultValue={logoUrl ?? ""}
              placeholder="https://example.com/logo.png"
              onChange={(e) => setPreviewLogo(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              URL to your organization logo. Displayed in the sidebar and org
              switcher.
            </p>
            {previewLogo && (
              <div className="mt-2 flex items-center gap-3 rounded-lg border p-3">
                <img
                  src={previewLogo}
                  alt="Logo preview"
                  className="h-10 w-10 rounded-lg object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = "none"
                  }}
                />
                <span className="text-sm text-muted-foreground">Logo preview</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Branding"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
