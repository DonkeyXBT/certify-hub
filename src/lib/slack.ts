import { db } from "@/lib/db"

// ─── Types ────────────────────────────────────────────────────────────────────

type Block = Record<string, unknown>

interface SlackMessage {
  text: string
  attachments: Array<{
    color: string
    blocks: Block[]
  }>
}

interface SlackSettings {
  webhookUrl: string | undefined
  notifications: Record<string, boolean>
}

// ─── Config ───────────────────────────────────────────────────────────────────

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://gcrtool.cyfenced.nl"

const COLORS = {
  blue:   "#3b82f6",
  green:  "#22c55e",
  amber:  "#f59e0b",
  orange: "#f97316",
  red:    "#ef4444",
  purple: "#8b5cf6",
  slate:  "#64748b",
  dark:   "#0f172a",
} as const

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getOrgSlackSettings(orgId: string): Promise<SlackSettings> {
  const org = await db.organization.findUnique({
    where: { id: orgId },
    select: { settings: true, name: true },
  })
  const settings = (org?.settings as Record<string, unknown>) ?? {}
  return {
    webhookUrl: settings.slackWebhookUrl as string | undefined,
    notifications: (settings.slackNotifications as Record<string, boolean>) ?? {},
  }
}

async function sendToSlack(webhookUrl: string, payload: SlackMessage) {
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

function formatStatus(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

function priorityColor(priority: string): string {
  return (
    { LOW: COLORS.slate, MEDIUM: COLORS.amber, HIGH: COLORS.orange, CRITICAL: COLORS.red }[
      priority
    ] ?? COLORS.slate
  )
}

function complianceColor(status: string): string {
  return (
    {
      COMPLIANT: COLORS.green,
      PARTIALLY_COMPLIANT: COLORS.amber,
      NON_COMPLIANT: COLORS.red,
      NOT_ASSESSED: COLORS.slate,
    }[status] ?? COLORS.slate
  )
}

function taskStatusColor(status: string): string {
  return (
    {
      TODO: COLORS.slate,
      IN_PROGRESS: COLORS.blue,
      IN_REVIEW: COLORS.purple,
      COMPLETED: COLORS.green,
      CANCELLED: COLORS.slate,
      OVERDUE: COLORS.red,
    }[status] ?? COLORS.slate
  )
}

function complianceBadge(status: string): string {
  return (
    {
      COMPLIANT:           "✅  Compliant",
      PARTIALLY_COMPLIANT: "🟡  Partially Compliant",
      NON_COMPLIANT:       "🔴  Non-Compliant",
      NOT_ASSESSED:        "⬜  Not Assessed",
    }[status] ?? formatStatus(status)
  )
}

function taskStatusBadge(status: string): string {
  return (
    {
      TODO:        "◻  To Do",
      IN_PROGRESS: "🔵  In Progress",
      IN_REVIEW:   "🟣  In Review",
      COMPLETED:   "✅  Completed",
      CANCELLED:   "⛔  Cancelled",
      OVERDUE:     "⚠️  Overdue",
    }[status] ?? formatStatus(status)
  )
}

function priorityBadge(priority: string): string {
  return (
    {
      LOW:      "🟢  Low",
      MEDIUM:   "🟡  Medium",
      HIGH:     "🟠  High",
      CRITICAL: "🔴  Critical",
    }[priority] ?? formatStatus(priority)
  )
}

function scoreBar(score: number): string {
  const filled = Math.round(score / 10)
  const empty = 10 - filled
  return "█".repeat(filled) + "░".repeat(empty) + `  *${score}%*`
}

function nowStr(): string {
  return new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Amsterdam",
  })
}

// Block builders
function header(text: string): Block {
  return { type: "header", text: { type: "plain_text", text, emoji: true } }
}

function section(mrkdwn: string): Block {
  return { type: "section", text: { type: "mrkdwn", text: mrkdwn } }
}

function fields(pairs: [string, string][]): Block {
  return {
    type: "section",
    fields: pairs.map(([label, value]) => ({
      type: "mrkdwn",
      text: `*${label}*\n${value}`,
    })),
  }
}

function context(text: string): Block {
  return {
    type: "context",
    elements: [{ type: "mrkdwn", text }],
  }
}

function button(label: string, url: string, style?: "primary" | "danger"): Block {
  const btn: Record<string, unknown> = {
    type: "button",
    text: { type: "plain_text", text: label, emoji: true },
    url,
  }
  if (style) btn.style = style
  return btn
}

function actions(buttons: Block[]): Block {
  return { type: "actions", elements: buttons }
}

function divider(): Block {
  return { type: "divider" }
}

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

  const url = `${APP_URL}/org/${data.orgSlug}/tasks`
  const dueLine = data.dueDate
    ? data.dueDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "_No due date_"

  const detailFields: [string, string][] = [
    ["Priority", priorityBadge(data.priority)],
    ["Assigned to", data.assigneeName ?? "_Unassigned_"],
    ["Due date", dueLine],
  ]
  if (data.assessmentName) {
    detailFields.push(["Assessment", data.assessmentName])
  }

  await sendToSlack(webhookUrl, {
    text: "",
    attachments: [
      {
        color: priorityColor(data.priority),
        blocks: [
          header("📋  New Task Created"),
          divider(),
          section(`*${data.taskTitle}*`),
          fields(detailFields),
          divider(),
          context(`Created by *${data.creatorName}*  ·  ${nowStr()}  ·  GCR Tool`),
          actions([button("Open Tasks →", url, "primary")]),
        ],
      },
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

  const url = `${APP_URL}/org/${data.orgSlug}/tasks`
  const isCompleted = data.newStatus === "COMPLETED"
  const title = isCompleted ? "✅  Task Completed" : "🔄  Task Status Updated"

  const detailFields: [string, string][] = [
    ["Previous status", taskStatusBadge(data.oldStatus)],
    ["New status", taskStatusBadge(data.newStatus)],
  ]
  if (data.assigneeName) {
    detailFields.push(["Assignee", data.assigneeName])
  }

  await sendToSlack(webhookUrl, {
    text: "",
    attachments: [
      {
        color: taskStatusColor(data.newStatus),
        blocks: [
          header(title),
          divider(),
          section(`*${data.taskTitle}*`),
          fields(detailFields),
          divider(),
          context(`Changed by *${data.changedByName}*  ·  ${nowStr()}  ·  GCR Tool`),
          actions([button("Open Tasks →", url, "primary")]),
        ],
      },
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

  const url = `${APP_URL}/org/${data.orgSlug}/assessments/${data.assessmentId}`

  const blocks: Block[] = [
    header("📝  Control Response Recorded"),
    divider(),
    section(`*${data.assessmentName}*`),
    fields([
      ["Control", `\`${data.controlRef}\`  ${data.controlTitle}`],
      ["Compliance status", complianceBadge(data.complianceStatus)],
    ]),
  ]

  if (data.gaps) {
    const truncated =
      data.gaps.length > 280 ? data.gaps.slice(0, 280) + "…" : data.gaps
    blocks.push(
      section(`*Gaps identified*\n>${truncated}`)
    )
  }

  blocks.push(
    divider(),
    context(`Saved by *${data.savedByName}*  ·  ${nowStr()}  ·  GCR Tool`),
    actions([button("Open Assessment →", url, "primary")])
  )

  await sendToSlack(webhookUrl, {
    text: "",
    attachments: [{ color: complianceColor(data.complianceStatus), blocks }],
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

  const url = `${APP_URL}/org/${data.orgSlug}/assessments/${data.assessmentId}`
  const scoreColor =
    data.overallScore >= 80 ? COLORS.green
    : data.overallScore >= 50 ? COLORS.amber
    : COLORS.red

  await sendToSlack(webhookUrl, {
    text: "",
    attachments: [
      {
        color: scoreColor,
        blocks: [
          header("🏁  Assessment Completed"),
          divider(),
          section(`*${data.assessmentName}*`),
          section(`*Overall Score*\n${scoreBar(data.overallScore)}`),
          fields([
            ["Controls assessed", `${data.totalResponses} responses`],
            ["Result", data.overallScore >= 80 ? "✅  Pass" : data.overallScore >= 50 ? "🟡  Needs Work" : "🔴  Fail"],
          ]),
          divider(),
          context(`Completed by *${data.completedByName}*  ·  ${nowStr()}  ·  GCR Tool`),
          actions([button("View Results →", url, "primary")]),
        ],
      },
    ],
  })
}
