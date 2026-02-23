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

export async function getTasksForKanban(orgId: string) {
  return db.task.findMany({
    where: { orgId, deletedAt: null },
    include: {
      assignee: { select: { id: true, name: true, email: true, image: true } },
      creator: { select: { id: true, name: true } },
      risk: { select: { id: true, title: true } },
      controlImplementation: {
        include: { control: { select: { id: true, number: true, title: true } } },
      },
      capa: { select: { id: true, title: true } },
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  })
}

export type KanbanTask = Awaited<ReturnType<typeof getTasksForKanban>>[number]
