import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Building2, Users, ClipboardCheck, UserCheck } from "lucide-react"
import { AdminOrgList } from "@/components/admin/admin-org-list"

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

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const orgs = await getAdminData()

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
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of all organizations and their members on the platform.
        </p>
      </div>

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

      {/* Org list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">
            All Organizations
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({orgs.length})
            </span>
          </h2>
        </div>
        <AdminOrgList orgs={orgs} />
      </div>
    </div>
  )
}
