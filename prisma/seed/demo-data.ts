import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const DEMO_PASSWORD = "password123"

export async function seedDemoData(prisma: PrismaClient) {
  const hashedPassword = await hash(DEMO_PASSWORD, 12)

  // Create demo users
  const admin = await prisma.user.upsert({
    where: { email: "admin@certifyhub.demo" },
    update: {},
    create: {
      name: "Alice Admin",
      email: "admin@certifyhub.demo",
      hashedPassword,
    },
  })

  const auditor = await prisma.user.upsert({
    where: { email: "auditor@certifyhub.demo" },
    update: {},
    create: {
      name: "Bob Auditor",
      email: "auditor@certifyhub.demo",
      hashedPassword,
    },
  })

  const manager = await prisma.user.upsert({
    where: { email: "manager@certifyhub.demo" },
    update: {},
    create: {
      name: "Carol Manager",
      email: "manager@certifyhub.demo",
      hashedPassword,
    },
  })

  const viewer = await prisma.user.upsert({
    where: { email: "viewer@certifyhub.demo" },
    update: {},
    create: {
      name: "Dave Viewer",
      email: "viewer@certifyhub.demo",
      hashedPassword,
    },
  })

  // Create demo organization
  const org = await prisma.organization.upsert({
    where: { slug: "acme-corp" },
    update: {},
    create: {
      name: "Acme Corp",
      slug: "acme-corp",
      industry: "Technology",
      size: "51-200",
    },
  })

  // Assign memberships (one per role)
  const members = [
    { userId: admin.id, role: "ADMIN" as const },
    { userId: auditor.id, role: "AUDITOR" as const },
    { userId: manager.id, role: "MANAGER" as const },
    { userId: viewer.id, role: "VIEWER" as const },
  ]

  for (const m of members) {
    await prisma.membership.upsert({
      where: { userId_orgId: { userId: m.userId, orgId: org.id } },
      update: {},
      create: {
        userId: m.userId,
        orgId: org.id,
        role: m.role,
        isActive: true,
      },
    })
  }

  console.log("Demo accounts created:")
  console.log("  admin@certifyhub.demo   / password123  (ADMIN)")
  console.log("  auditor@certifyhub.demo / password123  (AUDITOR)")
  console.log("  manager@certifyhub.demo / password123  (MANAGER)")
  console.log("  viewer@certifyhub.demo  / password123  (VIEWER)")
  console.log(`  Organization: Acme Corp (slug: acme-corp)`)
}
