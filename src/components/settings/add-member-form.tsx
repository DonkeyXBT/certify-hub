"use client"

import { useState, useTransition } from "react"
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
  const [showPassword, setShowPassword] = useState(false)

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
        toast.success("Account created and member added successfully")
        const form = document.getElementById("create-account-form") as HTMLFormElement
        form?.reset()
      }
    })
  }

  return (
    <Tabs defaultValue="existing" className="w-full">
      <TabsList>
        <TabsTrigger value="existing">Add Existing User</TabsTrigger>
        <TabsTrigger value="create">Create New Account</TabsTrigger>
      </TabsList>

      <TabsContent value="existing" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add Existing User</CardTitle>
            <CardDescription>
              Add a user who already has an account to this organization.
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

      <TabsContent value="create" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create New Account</CardTitle>
            <CardDescription>
              Create a new user account and add them to this organization.
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="create-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="create-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-role">Role</Label>
                  <Select name="role" defaultValue="VIEWER">
                    <SelectTrigger id="create-role" className="w-full">
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
                <UserRoundPlus className="mr-2 h-4 w-4" />
                {isPending ? "Creating..." : "Create Account & Add"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
