"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createAudit(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const orgId = formData.get("orgId") as string
  const title = formData.get("title") as string
  const type = formData.get("type") as string
  const scope = formData.get("scope") as string
  const objectives = formData.get("objectives") as string
  const startDate = formData.get("startDate") as string
  const endDate = formData.get("endDate") as string

  if (!title) return { error: "Title is required" }

  const audit = await db.audit.create({
    data: {
      orgId,
      title,
      type: (type as any) || "INTERNAL",
      scope: scope || null,
      objectives: objectives || null,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      status: "PLANNED",
    },
  })

  revalidatePath(`/org/[orgSlug]/audits`)
  return { id: audit.id }
}

export async function generateChecklist(auditId: string, frameworkId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const controls = await db.control.findMany({
    where: { clause: { frameworkId } },
    include: { clause: true },
    orderBy: { number: "asc" },
  })

  const items = controls.map((c, i) => ({
    auditId,
    clauseReference: `${c.clause.number} - ${c.number}`,
    question: `Verify implementation and effectiveness of: ${c.title}`,
    sortOrder: i,
  }))

  await db.auditChecklistItem.createMany({ data: items })
  revalidatePath(`/org/[orgSlug]/audits`)
  return { count: items.length }
}

export async function updateChecklistItem(itemId: string, data: { complianceStatus?: string; notes?: string }) {
  await db.auditChecklistItem.update({
    where: { id: itemId },
    data: {
      complianceStatus: data.complianceStatus as any,
      notes: data.notes,
    },
  })
  return { success: true }
}

export async function createFinding(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const auditId = formData.get("auditId") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const severity = formData.get("severity") as string
  const dueDate = formData.get("dueDate") as string

  const finding = await db.auditFinding.create({
    data: {
      auditId,
      title,
      description: description || null,
      severity: severity as any,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  })

  revalidatePath(`/org/[orgSlug]/audits`)
  return { id: finding.id }
}

export async function deleteAudit(auditId: string) {
  await db.audit.update({
    where: { id: auditId },
    data: { deletedAt: new Date() },
  })
  revalidatePath(`/org/[orgSlug]/audits`)
  return { success: true }
}
