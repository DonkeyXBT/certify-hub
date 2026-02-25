"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Users,
  ClipboardCheck,
  Calendar,
  X,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { OrgRole } from "@prisma/client"
import { adminRemoveMember, adminUpdateMemberRole } from "@/lib/actions/admin"
import { EditOrgDialog } from "./edit-org-dialog"
import { DeleteOrgButton } from "./delete-org-button"
import { AddMemberDialog } from "./add-member-dialog"

interface Member {
  id: string
  name: string | null
  email: string
  role: OrgRole
  isActive: boolean
  joinedAt: Date
  emailVerified: Date | null
}

interface OrgData {
  id: string
  name: string
  slug: string
  industry: string | null
  size: string | null
  createdAt: Date
  memberCount: number
  assessmentCount: number
  members: Member[]
}

const ROLE_CONFIG: Record<OrgRole, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  ADMIN:   { label: "Admin",   variant: "default" },
  MANAGER: { label: "Manager", variant: "secondary" },
  AUDITOR: { label: "Auditor", variant: "outline" },
  VIEWER:  { label: "Viewer",  variant: "outline" },
}

function getInitials(name: string | null, email: string) {
  if (name) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }
  return email.slice(0, 2).toUpperCase()
}

function MemberRow({ member, orgId, orgSlug }: { member: Member; orgId: string; orgSlug: string }) {
  const [isPending, startTransition] = useTransition()

  function handleRoleChange(newRole: string) {
    startTransition(async () => {
      const result = await adminUpdateMemberRole(member.id, orgId, newRole)
      if (result?.error) toast.error(result.error)
      else toast.success("Role updated")
    })
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await adminRemoveMember(member.id, orgId)
      if (result?.error) toast.error(result.error)
      else toast.success("Member removed")
    })
  }

  return (
    <div className="flex items-center gap-4 px-6 py-3 hover:bg-muted/30 transition-colors">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="text-xs">
          {getInitials(member.name, member.email)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">
            {member.name ?? <span className="text-muted-foreground italic">No name</span>}
          </span>
          {!member.emailVerified && (
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium shrink-0">
              unverified
            </span>
          )}
          {!member.isActive && (
            <span className="text-xs text-muted-foreground shrink-0">(inactive)</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{member.email}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Select
          value={member.role}
          onValueChange={handleRoleChange}
          disabled={isPending}
        >
          <SelectTrigger className="h-7 w-[110px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MANAGER">Manager</SelectItem>
            <SelectItem value="AUDITOR">Auditor</SelectItem>
            <SelectItem value="VIEWER">Viewer</SelectItem>
          </SelectContent>
        </Select>

        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
          onClick={handleRemove}
          disabled={isPending}
          title="Remove member"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

function OrgCard({ org }: { org: OrgData }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      {/* org header row */}
      <div className="w-full px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-4 flex-1 min-w-0 text-left"
            onClick={() => setOpen((v) => !v)}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-muted">
              <Building2 className="h-4.5 w-4.5 text-muted-foreground" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold truncate">{org.name}</span>
                <span className="text-xs text-muted-foreground font-mono">{org.slug}</span>
                {org.industry && (
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    · {org.industry}
                  </span>
                )}
              </div>
              <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(org.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {org.memberCount} {org.memberCount === 1 ? "member" : "members"}
                </span>
                <span className="flex items-center gap-1">
                  <ClipboardCheck className="h-3 w-3" />
                  {org.assessmentCount} {org.assessmentCount === 1 ? "assessment" : "assessments"}
                </span>
              </div>
            </div>
          </button>

          <div className="flex items-center gap-1 shrink-0">
            <EditOrgDialog
              orgId={org.id}
              name={org.name}
              industry={org.industry}
              size={org.size}
            />
            <DeleteOrgButton orgId={org.id} orgName={org.name} />
            <button
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle members"
            >
              {open ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* members list */}
      {open && (
        <div className="border-t bg-muted/10">
          <div className="flex items-center justify-between px-6 py-2 border-b bg-muted/20">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Members ({org.members.length})
            </span>
            <AddMemberDialog orgId={org.id} orgName={org.name} />
          </div>

          {org.members.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              No members yet.{" "}
              <span className="text-foreground">Use "Add member" to invite someone.</span>
            </div>
          ) : (
            <div className="divide-y">
              {org.members.map((member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  orgId={org.id}
                  orgSlug={org.slug}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function AdminOrgList({ orgs }: { orgs: OrgData[] }) {
  const [search, setSearch] = useState("")

  const filtered = orgs.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.slug.toLowerCase().includes(search.toLowerCase()) ||
      (o.industry ?? "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <input
        type="search"
        placeholder="Search organizations…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm rounded-lg border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
      />

      {filtered.length === 0 ? (
        <div className="rounded-xl border py-16 text-center text-sm text-muted-foreground">
          No organizations found.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((org) => (
            <OrgCard key={org.id} org={org} />
          ))}
        </div>
      )}
    </div>
  )
}
