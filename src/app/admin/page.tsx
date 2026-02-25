import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Building2, Users, ClipboardCheck, UserCheck } from "lucide-react"
import { AdminOrgList } from "@/components/admin/admin-org-list"
import { AdminUserList } from "@/components/admin/admin-user-list"
import { CreateOrgDialog } from "@/components/admin/create-org-dialog"
import { CreateUserDialog } from "@/components/admin/create-user-dialog"

export const metadata = {
  title: "Admin Panel — Certifi by Cyfenced",
}

async function getAdminData() {
  const orgs = await db.organization.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      industry: true,
      size: true,
      createdAt: true,
      memberships: {
        select: {
          role: true,
          isActive: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              emailVerified: true,
            },
          },
        },
        orderBy: [{ role: "asc" }, { createdAt: "asc" }],
      },
      _count: {
        select: { assessments: true },
      },
    },
  })

  return orgs.map((org) => ({
    id: org.id,
    name: org.name,
    slug: org.slug,
    industry: org.industry,
    size: org.size,
    createdAt: org.createdAt,
    assessmentCount: org._count.assessments,
    memberCount: org.memberships.length,
    members: org.memberships.map((m) => ({
      id: m.user.id,
      name: m.user.name,
      email: m.user.email,
      emailVerified: m.user.emailVerified,
      role: m.role,
      isActive: m.isActive,
      joinedAt: m.createdAt,
    })),
  }))
}

async function getAllUsers() {
  const users = await db.user.findMany({
    orderBy: [{ isSuperAdmin: "desc" }, { createdAt: "asc" }],
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      isSuperAdmin: true,
      createdAt: true,
      memberships: {
        where: { isActive: true },
        select: {
          role: true,
          org: { select: { name: true } },
        },
      },
    },
  })

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    emailVerified: u.emailVerified,
    isSuperAdmin: u.isSuperAdmin,
    createdAt: u.createdAt,
    orgs: u.memberships.map((m) => ({ name: m.org.name, role: m.role })),
  }))
}

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const [orgs, allUsers] = await Promise.all([getAdminData(), getAllUsers()])

  const totalMembers = orgs.reduce((sum, o) => sum + o.memberCount, 0)
  const activeMembers = orgs.reduce(
    (sum, o) => sum + o.members.filter((m) => m.isActive).length,
    0
  )
  const totalAssessments = orgs.reduce((sum, o) => sum + o.assessmentCount, 0)

  const stats = [
    {
      label: "Organizations",
      value: orgs.length,
      icon: Building2,
      description: "Total active organizations",
    },
    {
      label: "Members",
      value: totalMembers,
      icon: Users,
      description: "Total memberships across all orgs",
    },
    {
      label: "Active Members",
      value: activeMembers,
      icon: UserCheck,
      description: "Members with active access",
    },
    {
      label: "Assessments",
      value: totalAssessments,
      icon: ClipboardCheck,
      description: "Total assessments created",
    },
  ]

  return (
    <div className="space-y-10">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold tabular-nums">{stat.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Organizations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">
              Organizations
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({orgs.length})
              </span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage organizations and their members.
            </p>
          </div>
          <CreateOrgDialog />
        </div>
        <AdminOrgList orgs={orgs} />
      </div>

      {/* Users */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">
              Platform Users
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({allUsers.length})
              </span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage user accounts and super admin access.
            </p>
          </div>
          <CreateUserDialog />
        </div>
        <AdminUserList users={allUsers} currentUserId={session.user.id} />
      </div>
    </div>
  )
}
