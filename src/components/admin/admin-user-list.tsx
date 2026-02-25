"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ShieldCheck } from "lucide-react"
import type { OrgRole } from "@prisma/client"
import { adminToggleSuperAdmin } from "@/lib/actions/admin"

interface UserOrg {
  name: string
  role: OrgRole
}

interface UserData {
  id: string
  name: string | null
  email: string
  emailVerified: Date | null
  isSuperAdmin: boolean
  createdAt: Date
  orgs: UserOrg[]
}

function getInitials(name: string | null, email: string) {
  if (name) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }
  return email.slice(0, 2).toUpperCase()
}

const ROLE_LABELS: Record<OrgRole, string> = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  AUDITOR: "Auditor",
  VIEWER: "Viewer",
}

function UserRow({
  user,
  currentUserId,
}: {
  user: UserData
  currentUserId: string
}) {
  const [isPending, startTransition] = useTransition()
  const isSelf = user.id === currentUserId

  function handleToggleSuperAdmin(checked: boolean) {
    if (isSelf) {
      toast.error("You cannot change your own super admin status")
      return
    }
    startTransition(async () => {
      const result = await adminToggleSuperAdmin(user.id, checked)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(checked ? "Super admin granted" : "Super admin revoked")
      }
    })
  }

  return (
    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors">
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarFallback className="text-xs">
          {getInitials(user.name, user.email)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium">
            {user.name ?? <span className="text-muted-foreground italic">No name</span>}
          </span>
          {isSelf && (
            <span className="text-xs text-muted-foreground">(you)</span>
          )}
          {user.isSuperAdmin && (
            <Badge className="gap-1 text-xs" variant="secondary">
              <ShieldCheck className="h-3 w-3" />
              Super Admin
            </Badge>
          )}
          {!user.emailVerified && (
            <span className="text-xs text-amber-600 dark:text-amber-400">unverified</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        {user.orgs.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {user.orgs.map((org) => (
              <span
                key={org.name}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground"
              >
                {org.name}
                <span className="text-muted-foreground/60">·</span>
                <span className="text-muted-foreground/80">{ROLE_LABELS[org.role]}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:block">Super admin</span>
          <Switch
            checked={user.isSuperAdmin}
            onCheckedChange={handleToggleSuperAdmin}
            disabled={isPending || isSelf}
            aria-label="Toggle super admin"
          />
        </div>
      </div>
    </div>
  )
}

interface AdminUserListProps {
  users: UserData[]
  currentUserId: string
}

export function AdminUserList({ users, currentUserId }: AdminUserListProps) {
  const [search, setSearch] = useState("")

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.name ?? "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <input
        type="search"
        placeholder="Search users…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm rounded-lg border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
      />

      {filtered.length === 0 ? (
        <div className="rounded-xl border py-12 text-center text-sm text-muted-foreground">
          No users found.
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="divide-y">
            {filtered.map((user) => (
              <UserRow key={user.id} user={user} currentUserId={currentUserId} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
