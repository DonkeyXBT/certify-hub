import { db } from "@/lib/db"

export async function getControlImplementations(orgId: string) {
  return db.controlImplementation.findMany({
    where: { orgId },
    include: {
      control: {
        include: { clause: { select: { number: true, title: true } } },
      },
    },
    orderBy: { control: { number: "asc" } },
  })
}

export async function getControlImplementationById(id: string) {
  return db.controlImplementation.findUnique({
    where: { id },
    include: {
      control: { include: { clause: true, requirements: true } },
      evidences: true,
      riskMappings: { include: { risk: true } },
    },
  })
}
