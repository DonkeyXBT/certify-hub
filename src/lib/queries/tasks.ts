import { db } from "@/lib/db"

export async function getTasks(orgId: string) {
  return db.task.findMany({
    where: { orgId, deletedAt: null },
    include: {
      assignee: { select: { id: true, name: true, email: true, image: true } },
      creator: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getTaskById(taskId: string) {
  return db.task.findUnique({
    where: { id: taskId },
    include: {
      assignee: { select: { id: true, name: true, email: true, image: true } },
      creator: { select: { id: true, name: true } },
      risk: { select: { id: true, title: true } },
      controlImplementation: { include: { control: { select: { number: true, title: true } } } },
      capa: { select: { id: true, title: true } },
    },
  })
}

export async function getTasksByStatus(orgId: string) {
  const tasks = await getTasks(orgId)
  return {
    TODO: tasks.filter((t) => t.status === "TODO"),
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
    IN_REVIEW: tasks.filter((t) => t.status === "IN_REVIEW"),
    COMPLETED: tasks.filter((t) => t.status === "COMPLETED"),
  }
}

const kanbanInclude = {
  assignee: { select: { id: true, name: true, email: true, image: true } },
  creator: { select: { id: true, name: true } },
  risk: { select: { id: true, title: true } },
  controlImplementation: {
    include: { control: { select: { id: true, number: true, title: true } } },
  },
  capa: { select: { id: true, title: true } },
} as const

export async function getTasksForKanban(orgId: string) {
  return db.task.findMany({
    where: { orgId, deletedAt: null },
    include: kanbanInclude,
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  })
}

export type KanbanTask = Awaited<ReturnType<typeof getTasksForKanban>>[number]

/** General tasks — tasks not linked to any assessment */
export async function getGeneralTasksForKanban(orgId: string) {
  return db.task.findMany({
    where: { orgId, assessmentId: null, deletedAt: null },
    include: kanbanInclude,
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  })
}

/** Tasks for a specific assessment */
export async function getTasksForKanbanByAssessment(
  orgId: string,
  assessmentId: string
) {
  return db.task.findMany({
    where: { orgId, assessmentId, deletedAt: null },
    include: kanbanInclude,
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  })
}

/** Active assessments that have generated tasks */
export async function getActiveAssessmentsWithTasks(orgId: string) {
  return db.assessment.findMany({
    where: {
      orgId,
      status: "IN_PROGRESS",
      tasks: { some: { deletedAt: null } },
    },
    select: {
      id: true,
      name: true,
      framework: { select: { code: true, name: true } },
      _count: { select: { tasks: { where: { deletedAt: null } } } },
    },
    orderBy: { updatedAt: "desc" },
  })
}

export type ActiveAssessmentWithTasks = Awaited<
  ReturnType<typeof getActiveAssessmentsWithTasks>
>[number]
