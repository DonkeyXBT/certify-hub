"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, UserRoundPlus } from "lucide-react"
import { addUserToOrg, createUserAndAddToOrg } from "@/lib/actions/members"

interface AddMemberFormProps {
  orgId: string
  orgSlug: string
}

export function AddMemberForm({ orgId, orgSlug }: AddMemberFormProps) {
  const [isPending, startTransition] = useTransition()

  function onAddExisting(formData: FormData) {
    startTransition(async () => {
      const result = (await addUserToOrg(formData)) as any
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Member added successfully")
        const form = document.getElementById("add-existing-form") as HTMLFormElement
        form?.reset()
      }
    })
  }

  function onCreateNew(formData: FormData) {
    startTransition(async () => {
      const result = (await createUserAndAddToOrg(formData)) as any
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Account created — verification email sent")
        const form = document.getElementById("create-account-form") as HTMLFormElement
        form?.reset()
      }
    })
  }

  return (
    <Tabs defaultValue="create" className="w-full">
      <TabsList>
        <TabsTrigger value="create">Create New Account</TabsTrigger>
        <TabsTrigger value="existing">Add Existing User</TabsTrigger>
      </TabsList>

      <TabsContent value="create" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create New Account</CardTitle>
            <CardDescription>
              Create a new user account. They will receive a verification email to set their password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="create-account-form" action={onCreateNew} className="space-y-4">
              <input type="hidden" name="orgId" value={orgId} />
              <input type="hidden" name="orgSlug" value={orgSlug} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="create-name">Full Name</Label>
                  <Input
                    id="create-name"
                    name="name"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-email">Email Address</Label>
                  <Input
                    id="create-email"
                    name="email"
                    type="email"
                    placeholder="user@company.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-role">Role</Label>
                <Select name="role" defaultValue="VIEWER">
                  <SelectTrigger id="create-role" className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrator</SelectItem>
                    <SelectItem value="AUDITOR">Auditor</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="VIEWER">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={isPending}>
                <UserRoundPlus className="mr-2 h-4 w-4" />
                {isPending ? "Creating..." : "Create Account & Send Invite"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="existing" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add Existing User</CardTitle>
            <CardDescription>
              Add a user who already has a verified account to this organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="add-existing-form" action={onAddExisting} className="space-y-4">
              <input type="hidden" name="orgId" value={orgId} />
              <input type="hidden" name="orgSlug" value={orgSlug} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="add-email">Email Address</Label>
                  <Input
                    id="add-email"
                    name="email"
                    type="email"
                    placeholder="user@company.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-role">Role</Label>
                  <Select name="role" defaultValue="VIEWER">
                    <SelectTrigger id="add-role" className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Administrator</SelectItem>
                      <SelectItem value="AUDITOR">Auditor</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="VIEWER">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" disabled={isPending}>
                <UserPlus className="mr-2 h-4 w-4" />
                {isPending ? "Adding..." : "Add Member"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
