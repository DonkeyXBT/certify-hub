import { db } from "@/lib/db"

export async function getOrganizationBySlug(slug: string) {
  return db.organization.findUnique({
    where: { slug, deletedAt: null },
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      industry: true,
      size: true,
      settings: true,
      createdAt: true,
    },
  })
}

export async function getUserOrganizations(userId: string) {
  const memberships = await db.membership.findMany({
    where: {
      userId,
      isActive: true,
      org: {
        deletedAt: null,
      },
    },
    include: {
      org: {
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          industry: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  return memberships.map((m) => ({
    ...m.org,
    role: m.role,
  }))
}

export async function getUserMembership(userId: string, orgId: string) {
  return db.membership.findUnique({
    where: {
      userId_orgId: {
        userId,
        orgId,
      },
    },
    select: {
      id: true,
      role: true,
      isActive: true,
    },
  })
}
