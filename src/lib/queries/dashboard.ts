import { db } from "@/lib/db"

export interface DashboardStats {
  controlImplementation: {
    total: number
    implemented: number
    rate: number
  }
  latestAssessment: {
    name: string | null
    frameworkName: string | null
    score: number | null
  }
  risks: {
    total: number
    byLevel: {
      CRITICAL: number
      HIGH: number
      MEDIUM: number
      LOW: number
    }
  }
  tasks: {
    total: number
    todo: number
    inProgress: number
    inReview: number
    completed: number
    overdue: number
    cancelled: number
  }
  audits: {
    planned: number
    inProgress: number
    upcoming: Array<{
      id: string
      title: string
      type: string
      status: string
      startDate: Date | null
    }>
  }
  recentActivity: Array<{
    id: string
    action: string
    entityType: string
    entityId: string
    userName: string | null
    userEmail: string | null
    createdAt: Date
  }>
}

export async function getDashboardStats(orgId: string): Promise<DashboardStats> {
  const [
    totalControls,
    implementedControls,
    latestAssessment,
    risks,
    tasks,
    plannedAudits,
    inProgressAudits,
    upcomingAudits,
    recentLogs,
  ] = await Promise.all([
    db.controlImplementation.count({ where: { orgId } }),
    db.controlImplementation.count({
      where: { orgId, status: "FULLY_IMPLEMENTED" },
    }),
    db.assessment.findFirst({
      where: { orgId, status: "COMPLETED" },
      include: { framework: true },
      orderBy: { updatedAt: "desc" },
    }),
    db.risk.findMany({
      where: { orgId, deletedAt: null, status: { not: "CLOSED" } },
      select: { residualLevel: true },
    }),
    db.task.findMany({
      where: { orgId, deletedAt: null },
      select: { status: true, dueDate: true },
    }),
    db.audit.count({
      where: { orgId, deletedAt: null, status: "PLANNED" },
    }),
    db.audit.count({
      where: { orgId, deletedAt: null, status: "IN_PROGRESS" },
    }),
    db.audit.findMany({
      where: {
        orgId,
        deletedAt: null,
        status: { in: ["PLANNED", "IN_PROGRESS"] },
      },
      orderBy: { startDate: "asc" },
      take: 5,
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        startDate: true,
      },
    }),
    db.auditLog.findMany({
      where: { orgId },
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ])

  const implRate =
    totalControls > 0
      ? Math.round((implementedControls / totalControls) * 100)
      : 0

  const risksByLevel = risks.reduce<DashboardStats["risks"]["byLevel"]>(
    (acc, risk) => {
      const level = risk.residualLevel as keyof DashboardStats["risks"]["byLevel"]
      acc[level] = (acc[level] || 0) + 1
      return acc
    },
    { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 }
  )

  const now = new Date()
  const pastDueCount = tasks.filter(
    (t) =>
      t.dueDate &&
      t.dueDate < now &&
      t.status !== "COMPLETED" &&
      t.status !== "CANCELLED" &&
      t.status !== "OVERDUE"
  ).length

  const tasksByStatus = tasks.reduce(
    (acc, task) => {
      const status = task.status as keyof typeof acc
      if (status in acc) {
        acc[status] = acc[status] + 1
      }
      return acc
    },
    {
      TODO: 0,
      IN_PROGRESS: 0,
      IN_REVIEW: 0,
      COMPLETED: 0,
      OVERDUE: 0,
      CANCELLED: 0,
    }
  )

  return {
    controlImplementation: {
      total: totalControls,
      implemented: implementedControls,
      rate: implRate,
    },
    latestAssessment: {
      name: latestAssessment?.name ?? null,
      frameworkName: latestAssessment?.framework?.name ?? null,
      score: latestAssessment?.overallScore ?? null,
    },
    risks: {
      total: risks.length,
      byLevel: risksByLevel,
    },
    tasks: {
      total: tasks.length,
      todo: tasksByStatus.TODO,
      inProgress: tasksByStatus.IN_PROGRESS,
      inReview: tasksByStatus.IN_REVIEW,
      completed: tasksByStatus.COMPLETED,
      overdue: tasksByStatus.OVERDUE + pastDueCount,
      cancelled: tasksByStatus.CANCELLED,
    },
    audits: {
      planned: plannedAudits,
      inProgress: inProgressAudits,
      upcoming: upcomingAudits,
    },
    recentActivity: recentLogs.map((log) => ({
      id: log.id,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      userName: log.user?.name ?? null,
      userEmail: log.user?.email ?? null,
      createdAt: log.createdAt,
    })),
  }
}
