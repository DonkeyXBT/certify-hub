import { PrismaClient } from "@prisma/client"
import { seedISO27001 } from "./iso27001-clauses"
import { seedISO9001 } from "./iso9001-clauses"
import { seedDemoData } from "./demo-data"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting seed...")
  await seedISO27001(prisma)
  console.log("ISO 27001 seeded")
  await seedISO9001(prisma)
  console.log("ISO 9001 seeded")
  await seedDemoData(prisma)
  console.log("Demo data seeded")
  console.log("Seed completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
