import { db } from "@/lib/db"

export async function getSoAEntries(orgId: string, frameworkId: string) {
  return db.soAEntry.findMany({
    where: {
      orgId,
      frameworkId,
    },
    include: {
      control: {
        include: {
          clause: {
            select: {
              id: true,
              number: true,
              title: true,
              isAnnex: true,
            },
          },
        },
      },
    },
    orderBy: {
      control: {
        number: "asc",
      },
    },
  })
}

export type SoAEntryWithControl = Awaited<
  ReturnType<typeof getSoAEntries>
>[number]

export async function getAnnexControls(frameworkId: string) {
  return db.control.findMany({
    where: {
      clause: {
        frameworkId,
        isAnnex: true,
      },
    },
    include: {
      clause: {
        select: {
          id: true,
          number: true,
          title: true,
          isAnnex: true,
        },
      },
    },
    orderBy: { number: "asc" },
  })
}

export type AnnexControl = Awaited<
  ReturnType<typeof getAnnexControls>
>[number]

export async function getFrameworkForSoA(orgId: string) {
  // Find the ISO 27001 framework for SoA
  const framework = await db.framework.findFirst({
    where: {
      code: {
        contains: "27001",
      },
      status: "PUBLISHED",
    },
    select: {
      id: true,
      code: true,
      name: true,
      version: true,
    },
  })

  return framework
}
