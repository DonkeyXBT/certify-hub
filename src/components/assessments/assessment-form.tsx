"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { createAssessment } from "@/lib/actions/assessments"

interface Framework {
  id: string
  name: string
  code: string
  version: string
}

interface AssessmentFormProps {
  orgId: string
  orgSlug: string
  frameworks: Framework[]
}

export function AssessmentForm({ orgId, orgSlug, frameworks }: AssessmentFormProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createAssessment(orgSlug, formData)
      if (result?.error) {
        toast.error(result.error)
      }
    })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={onSubmit} className="space-y-4 max-w-lg">
          <div className="space-y-2">
            <Label htmlFor="name">Assessment name</Label>
            <Input id="name" name="name" placeholder="Q1 2026 ISO 27001 Assessment" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="frameworkId">Framework</Label>
            <Select name="frameworkId" required>
              <SelectTrigger>
                <SelectValue placeholder="Select framework" />
              </SelectTrigger>
              <SelectContent>
                {frameworks.map((f) => (
                  <SelectItem key={f.id} value={f.id}>{f.name} ({f.version})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Assessment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
