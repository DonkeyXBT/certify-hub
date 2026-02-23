/**
 * Upload all published frameworks from Postgres to Vercel Blob.
 *
 * Usage:
 *   npx tsx scripts/upload-frameworks-to-blob.ts
 *
 * Requires BLOB_READ_WRITE_TOKEN and DATABASE_URL in .env
 */

import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { put } from "@vercel/blob"

const prisma = new PrismaClient()

interface BlobClause {
  id: string
  number: string
  title: string
  description: string | null
  isAnnex: boolean
  sortOrder: number
  controls: {
    id: string
    number: string
    title: string
    category: string | null
    objective: string | null
    guidance: string | null
  }[]
  children: BlobClause[]
}

async function buildClauseTree(
  frameworkId: string,
  parentId: string | null
): Promise<BlobClause[]> {
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

  const result: BlobClause[] = []
  for (const clause of clauses) {
    const children = await buildClauseTree(frameworkId, clause.id)
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

async function main() {
  const frameworks = await prisma.framework.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { name: "asc" },
  })

  console.log(`Found ${frameworks.length} published framework(s)`)

  for (const fw of frameworks) {
    console.log(`\nProcessing ${fw.code} (${fw.name})...`)

    const clauses = await buildClauseTree(fw.id, null)
    const data = {
      id: fw.id,
      code: fw.code,
      name: fw.name,
      version: fw.version,
      description: fw.description,
      status: fw.status,
      clauses,
    }

    const controlCount = countControls(clauses)
    const clauseCount = countClauses(clauses)
    console.log(`  ${clauseCount} clauses, ${controlCount} controls`)

    const blob = await put(`frameworks/${fw.code}.json`, JSON.stringify(data), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
    })

    console.log(`  Uploaded to: ${blob.url}`)
  }

  console.log("\nDone!")
}

function countControls(clauses: BlobClause[]): number {
  let count = 0
  for (const c of clauses) {
    count += c.controls.length
    count += countControls(c.children)
  }
  return count
}

function countClauses(clauses: BlobClause[]): number {
  let count = clauses.length
  for (const c of clauses) {
    count += countClauses(c.children)
  }
  return count
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
