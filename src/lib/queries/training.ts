import { db } from "@/lib/db"

export async function getTrainingPrograms(orgId: string) {
  return db.trainingProgram.findMany({
    where: { orgId },
    include: {
      records: {
        select: { id: true, status: true, userId: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getTrainingProgramById(programId: string) {
  return db.trainingProgram.findUnique({
    where: { id: programId },
    include: {
      records: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  })
}

export async function getTrainingMatrix(orgId: string) {
  const programs = await db.trainingProgram.findMany({
    where: { orgId },
    select: { id: true, title: true },
  })

  const members = await db.membership.findMany({
    where: { orgId, isActive: true },
    include: { user: { select: { id: true, name: true, email: true } } },
  })

  const records = await db.trainingRecord.findMany({
    where: { program: { orgId } },
    select: { programId: true, userId: true, status: true, score: true },
  })

  return { programs, members, records }
}
