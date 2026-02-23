import { PrismaClient } from "@prisma/client"
import { seedISO27001 } from "./iso27001-clauses"
import { seedISO9001 } from "./iso9001-clauses"
import { seedGDPR } from "./gdpr-clauses"
import { seedNIS2 } from "./nis2-clauses"
import { seedSOC2 } from "./soc2-clauses"
import { seedHIPAA } from "./hipaa-clauses"
import { seedPCIDSS } from "./pcidss-clauses"
import { seedNISTCSF } from "./nist-csf-clauses"
import { seedDORA } from "./dora-clauses"
import { seedISO22301 } from "./iso22301-clauses"
import { seedDemoData } from "./demo-data"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting seed...")
  await seedISO27001(prisma)
  console.log("ISO 27001 seeded")
  await seedISO9001(prisma)
  console.log("ISO 9001 seeded")
  await seedGDPR(prisma)
  console.log("GDPR seeded")
  await seedNIS2(prisma)
  console.log("NIS2 seeded")
  await seedSOC2(prisma)
  console.log("SOC 2 Type II seeded")
  await seedHIPAA(prisma)
  console.log("HIPAA seeded")
  await seedPCIDSS(prisma)
  console.log("PCI DSS seeded")
  await seedNISTCSF(prisma)
  console.log("NIST CSF seeded")
  await seedDORA(prisma)
  console.log("DORA seeded")
  await seedISO22301(prisma)
  console.log("ISO 22301 seeded")
  await seedDemoData(prisma)
  console.log("Demo data seeded")

  // Upload frameworks to Vercel Blob if token is available
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    console.log("\nUploading frameworks to Vercel Blob...")
    const { put } = await import("@vercel/blob")
    const frameworks = await prisma.framework.findMany({
      where: { status: "PUBLISHED" },
    })

    for (const fw of frameworks) {
      const clauses = await buildClauseTree(prisma, fw.id, null)
      const data = {
        id: fw.id,
        code: fw.code,
        name: fw.name,
        version: fw.version,
        description: fw.description,
        status: fw.status,
        clauses,
      }
      const blob = await put(
        `frameworks/${fw.code}.json`,
        JSON.stringify(data),
        {
          access: "private",
          contentType: "application/json",
          addRandomSuffix: false,
          allowOverwrite: true,
        }
      )
      console.log(`  ${fw.code} → ${blob.url}`)
    }
    console.log("Blob upload complete!")
  } else {
    console.log(
      "Skipping blob upload (no BLOB_READ_WRITE_TOKEN in environment)"
    )
  }

  console.log("Seed completed!")
}

async function buildClauseTree(
  prisma: PrismaClient,
  frameworkId: string,
  parentId: string | null
): Promise<any[]> {
  const clauses = await prisma.clause.findMany({
    where: { frameworkId, parentId },
    orderBy: { sortOrder: "asc" },
    include: {
      controls: {
        orderBy: { number: "asc" },
        select: {
          id: true,
          number: true,
          title: true,
          category: true,
          objective: true,
          guidance: true,
        },
      },
    },
  })

  const result: any[] = []
  for (const clause of clauses) {
    const children = await buildClauseTree(prisma, frameworkId, clause.id)
    result.push({
      id: clause.id,
      number: clause.number,
      title: clause.title,
      description: clause.description,
      isAnnex: clause.isAnnex,
      sortOrder: clause.sortOrder,
      controls: clause.controls,
      children,
    })
  }
  return result
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
