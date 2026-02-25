"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Users,
  ClipboardCheck,
  Calendar,
  Crown,
  Eye,
  Briefcase,
  UserCheck,
} from "lucide-react"
import type { OrgRole } from "@prisma/client"

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

function OrgCard({ org }: { org: OrgData }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      {/* org header row */}
      <button
        className="w-full text-left px-6 py-5 hover:bg-muted/40 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted">
            <Building2 className="h-5 w-5 text-muted-foreground" />
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
              {org.size && (
                <span className="text-xs text-muted-foreground hidden md:inline">
                  · {org.size}
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
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

          <div className="ml-auto flex items-center gap-2 shrink-0">
            <Badge variant="secondary" className="text-xs">
              {org.memberCount} {org.memberCount === 1 ? "member" : "members"}
            </Badge>
            {open ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </button>

      {/* members list */}
      {open && (
        <div className="border-t bg-muted/20">
          {org.members.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              No members in this organization.
            </div>
          ) : (
            <div className="divide-y">
              {org.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/40 transition-colors"
                >
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
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                          unverified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Badge
                      variant={ROLE_CONFIG[member.role].variant}
                      className="text-xs"
                    >
                      {ROLE_CONFIG[member.role].label}
                    </Badge>

                    <span
                      className={[
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                        member.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
                      ].join(" ")}
                    >
                      {member.isActive ? "Active" : "Inactive"}
                    </span>

                    <span className="text-xs text-muted-foreground hidden lg:block">
                      Joined{" "}
                      {new Date(member.joinedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
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
