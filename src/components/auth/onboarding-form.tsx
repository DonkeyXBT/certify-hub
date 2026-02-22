"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createOrganization } from "@/lib/actions/organization"

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Education",
  "Government",
  "Consulting",
  "Retail",
  "Energy",
  "Other",
]

const companySizes = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
]

export function OnboardingForm() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createOrganization(formData)
      if (result?.error) {
        const msg = typeof result.error === "string"
          ? result.error
          : Object.values(result.error).flat().join(", ")
        toast.error(msg)
      }
    })
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Organization name</Label>
        <Input id="name" name="name" placeholder="Acme Corp" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Select name="industry">
          <SelectTrigger>
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            {industries.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="size">Company size</Label>
        <Select name="size">
          <SelectTrigger>
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            {companySizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size} employees
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating..." : "Create organization"}
      </Button>
    </form>
  )
}
