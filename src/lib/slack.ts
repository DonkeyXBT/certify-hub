import { db } from "@/lib/db"

type SlackBlock = Record<string, unknown>

interface SlackPayload {
  text: string
  blocks?: SlackBlock[]
}

interface SlackSettings {
  webhookUrl: string | undefined
  notifications: Record<string, boolean>
}

async function getOrgSlackSettings(orgId: string): Promise<SlackSettings> {
  const org = await db.organization.findUnique({
    where: { id: orgId },
    select: { settings: true },
  })
  const settings = (org?.settings as Record<string, unknown>) ?? {}
  return {
    webhookUrl: settings.slackWebhookUrl as string | undefined,
    notifications: (settings.slackNotifications as Record<string, boolean>) ?? {},
  }
}

async function sendToSlack(webhookUrl: string, payload: SlackPayload) {
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      console.error(`[Slack] Failed: ${res.status} ${await res.text()}`)
    }
  } catch (err) {
    console.error("[Slack] Error sending notification:", err)
  }
}

function divider(): SlackBlock {
  return { type: "divider" }
}

function statusEmoji(status: string): string {
  const map: Record<string, string> = {
    TODO: "📋",
    IN_PROGRESS: "🔄",
    IN_REVIEW: "👀",
    COMPLETED: "✅",
    CANCELLED: "❌",
    OVERDUE: "⚠️",
    COMPLIANT: "✅",
    PARTIALLY_COMPLIANT: "🟡",
    NON_COMPLIANT: "🔴",
    NOT_ASSESSED: "⬜",
    LOW: "🟢",
    MEDIUM: "🟡",
    HIGH: "🟠",
    CRITICAL: "🔴",
  }
  return map[status] ?? "•"
}

function formatStatus(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://gcrtool.cyfenced.nl"

// ─── Task Created ─────────────────────────────────────────────────────────────

export async function notifyTaskCreated(
  orgId: string,
  data: {
    taskTitle: string
    creatorName: string
    assigneeName?: string
    priority: string
    dueDate?: Date | null
    assessmentName?: string
    orgSlug: string
  }
) {
  const { webhookUrl, notifications } = await getOrgSlackSettings(orgId)
  if (!webhookUrl || notifications.taskCreated === false) return

  const tasksUrl = `${APP_URL}/org/${data.orgSlug}/tasks`

  const fields: SlackBlock[] = [
    { type: "mrkdwn", text: `*Task*\n${data.taskTitle}` },
    {
      type: "mrkdwn",
      text: `*Priority*\n${statusEmoji(data.priority)} ${formatStatus(data.priority)}`,
    },
    { type: "mrkdwn", text: `*Created by*\n${data.creatorName}` },
    {
      type: "mrkdwn",
      text: `*Assigned to*\n${data.assigneeName ?? "_Unassigned_"}`,
    },
  ]
  if (data.dueDate) {
    fields.push({
      type: "mrkdwn",
      text: `*Due Date*\n${data.dueDate.toLocaleDateString("en-GB")}`,
    })
  }
  if (data.assessmentName) {
    fields.push({
      type: "mrkdwn",
      text: `*Assessment*\n${data.assessmentName}`,
    })
  }

  await sendToSlack(webhookUrl, {
    text: `New task created: "${data.taskTitle}" by ${data.creatorName}`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*📋 New Task Created*\n<${tasksUrl}|View Tasks>`,
        },
      },
      divider(),
      { type: "section", fields },
    ],
  })
}

// ─── Task Status Changed ──────────────────────────────────────────────────────

export async function notifyTaskStatusChanged(
  orgId: string,
  data: {
    taskTitle: string
    oldStatus: string
    newStatus: string
    changedByName: string
    assigneeName?: string
    orgSlug: string
  }
) {
  const { webhookUrl, notifications } = await getOrgSlackSettings(orgId)
  if (!webhookUrl || notifications.taskStatusChanged === false) return

  const tasksUrl = `${APP_URL}/org/${data.orgSlug}/tasks`
  const isCompleted = data.newStatus === "COMPLETED"
  const header = isCompleted ? `*✅ Task Completed*` : `*🔄 Task Status Changed*`

  const fields: SlackBlock[] = [
    { type: "mrkdwn", text: `*Task*\n${data.taskTitle}` },
    {
      type: "mrkdwn",
      text: `*Status*\n${statusEmoji(data.oldStatus)} ${formatStatus(data.oldStatus)} → ${statusEmoji(data.newStatus)} ${formatStatus(data.newStatus)}`,
    },
    { type: "mrkdwn", text: `*Changed by*\n${data.changedByName}` },
  ]
  if (data.assigneeName) {
    fields.push({ type: "mrkdwn", text: `*Assignee*\n${data.assigneeName}` })
  }

  await sendToSlack(webhookUrl, {
    text: `Task "${data.taskTitle}" moved to ${formatStatus(data.newStatus)} by ${data.changedByName}`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${header}\n<${tasksUrl}|View Tasks>`,
        },
      },
      divider(),
      { type: "section", fields },
    ],
  })
}

// ─── Assessment Control Saved ─────────────────────────────────────────────────

export async function notifyControlSaved(
  orgId: string,
  data: {
    assessmentName: string
    assessmentId: string
    controlRef: string
    controlTitle: string
    complianceStatus: string
    savedByName: string
    gaps?: string | null
    orgSlug: string
  }
) {
  const { webhookUrl, notifications } = await getOrgSlackSettings(orgId)
  if (!webhookUrl || notifications.assessmentControlSaved === false) return

  const assessmentUrl = `${APP_URL}/org/${data.orgSlug}/assessments/${data.assessmentId}`

  const blocks: SlackBlock[] = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*📋 Control Response Saved*\n<${assessmentUrl}|View Assessment>`,
      },
    },
    divider(),
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Assessment*\n${data.assessmentName}` },
        {
          type: "mrkdwn",
          text: `*Control*\n${data.controlRef} — ${data.controlTitle}`,
        },
        {
          type: "mrkdwn",
          text: `*Status*\n${statusEmoji(data.complianceStatus)} ${formatStatus(data.complianceStatus)}`,
        },
        { type: "mrkdwn", text: `*Saved by*\n${data.savedByName}` },
      ],
    },
  ]

  if (data.gaps) {
    const truncated =
      data.gaps.length > 300
        ? data.gaps.slice(0, 300) + "..."
        : data.gaps
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Gaps identified*\n${truncated}`,
      },
    })
  }

  await sendToSlack(webhookUrl, {
    text: `${data.savedByName} saved control ${data.controlRef} as ${formatStatus(data.complianceStatus)} in "${data.assessmentName}"`,
    blocks,
  })
}

// ─── Assessment Completed ─────────────────────────────────────────────────────

export async function notifyAssessmentCompleted(
  orgId: string,
  data: {
    assessmentName: string
    assessmentId: string
    overallScore: number
    completedByName: string
    totalResponses: number
    orgSlug: string
  }
) {
  const { webhookUrl, notifications } = await getOrgSlackSettings(orgId)
  if (!webhookUrl || notifications.assessmentCompleted === false) return

  const assessmentUrl = `${APP_URL}/org/${data.orgSlug}/assessments/${data.assessmentId}`
  const scoreEmoji =
    data.overallScore >= 80 ? "🟢" : data.overallScore >= 50 ? "🟡" : "🔴"

  await sendToSlack(webhookUrl, {
    text: `Assessment "${data.assessmentName}" completed with score ${data.overallScore}% by ${data.completedByName}`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*🏁 Assessment Completed*\n<${assessmentUrl}|View Results>`,
        },
      },
      divider(),
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Assessment*\n${data.assessmentName}` },
          {
            type: "mrkdwn",
            text: `*Overall Score*\n${scoreEmoji} *${data.overallScore}%*`,
          },
          {
            type: "mrkdwn",
            text: `*Controls Assessed*\n${data.totalResponses}`,
          },
          { type: "mrkdwn", text: `*Completed by*\n${data.completedByName}` },
        ],
      },
    ],
  })
}
