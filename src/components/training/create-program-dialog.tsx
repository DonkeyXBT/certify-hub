"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createTrainingProgram } from "@/lib/actions/training"

interface CreateProgramDialogProps {
  orgId: string
  orgSlug: string
}

export function CreateProgramDialog({
  orgId,
  orgSlug,
}: CreateProgramDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isMandatory, setIsMandatory] = useState(false)

  function onSubmit(formData: FormData) {
    formData.set("isMandatory", isMandatory.toString())
    startTransition(async () => {
      const result = (await createTrainingProgram(formData)) as any
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Training program created")
        setOpen(false)
        setIsMandatory(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Program
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Training Program</DialogTitle>
          <DialogDescription>
            Set up a new training program for your team.
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit} className="space-y-4">
          <input type="hidden" name="orgId" value={orgId} />
          <input type="hidden" name="orgSlug" value={orgSlug} />

          <div className="space-y-2">
            <Label htmlFor="program-title">Title *</Label>
            <Input
              id="program-title"
              name="title"
              placeholder="e.g. Information Security Awareness"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="program-description">Description</Label>
            <Textarea
              id="program-description"
              name="description"
              placeholder="Describe the training program objectives..."
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select name="frequency">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ONE_TIME">One-time</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                  <SelectItem value="SEMI_ANNUAL">Semi-annual</SelectItem>
                  <SelectItem value="ANNUAL">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="program-validity">Validity (days)</Label>
              <Input
                id="program-validity"
                name="validityPeriod"
                type="number"
                min={1}
                placeholder="e.g. 365"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="program-score">Passing Score (%)</Label>
            <Input
              id="program-score"
              name="passingScore"
              type="number"
              min={0}
              max={100}
              placeholder="e.g. 80"
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="program-mandatory"
              checked={isMandatory}
              onCheckedChange={setIsMandatory}
            />
            <Label htmlFor="program-mandatory">Mandatory training</Label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Program"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
