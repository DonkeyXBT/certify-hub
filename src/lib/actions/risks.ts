"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { riskFormSchema } from "@/lib/validations/risk"
import {
  calculateRiskScore,
  getRiskLevel,
} from "@/lib/utils/risk-calculator"
import { createAuditLog } from "@/lib/utils/audit-logger"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { RiskLikelihood, RiskImpact, RiskTreatment } from "@prisma/client"

// ─── Helpers ────────────────────────────────────────────────────────────────

async function getSessionOrg() {
  const session = await auth()
  if (!session?.user?.id || !session.user.orgId || !session.user.orgSlug) {
    throw new Error("Unauthorized")
  }
  return {
    userId: session.user.id,
    orgId: session.user.orgId,
    orgSlug: session.user.orgSlug,
  }
}

// ─── Create Risk ────────────────────────────────────────────────────────────

export async function createRisk(formData: FormData) {
  const { userId, orgId, orgSlug } = await getSessionOrg()

  const rawData = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    categoryId: (formData.get("categoryId") as string) || undefined,
    owner: (formData.get("owner") as string) || undefined,
    inherentLikelihood: formData.get("inherentLikelihood") as string,
    inherentImpact: formData.get("inherentImpact") as string,
    treatment: formData.get("treatment") as string,
    treatmentPlan: (formData.get("treatmentPlan") as string) || undefined,
    reviewDate: (formData.get("reviewDate") as string) || undefined,
  }

  const validated = riskFormSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      error: validated.error.flatten().fieldErrors,
    }
  }

  const {
    title,
    description,
    categoryId,
    owner,
    inherentLikelihood,
    inherentImpact,
    treatment,
    treatmentPlan,
    reviewDate,
  } = validated.data

  const inherentScore = calculateRiskScore(
    inherentLikelihood as RiskLikelihood,
    inherentImpact as RiskImpact
  )
  const inherentLevel = getRiskLevel(inherentScore)

  // Initially, residual = inherent (before treatment is applied)
  const risk = await db.risk.create({
    data: {
      orgId,
      title,
      description: description || null,
      categoryId: categoryId || null,
      owner: owner || null,
      inherentLikelihood: inherentLikelihood as RiskLikelihood,
      inherentImpact: inherentImpact as RiskImpact,
      inherentScore,
      inherentLevel,
      residualLikelihood: inherentLikelihood as RiskLikelihood,
      residualImpact: inherentImpact as RiskImpact,
      residualScore: inherentScore,
      residualLevel: inherentLevel,
      treatment: treatment as RiskTreatment,
      treatmentPlan: treatmentPlan || null,
      reviewDate: reviewDate ? new Date(reviewDate) : null,
      status: "IDENTIFIED",
    },
  })

  createAuditLog({
    orgId,
    userId,
    action: "CREATED",
    entityType: "risk",
    entityId: risk.id,
    newValues: { title, inherentLevel, treatment },
  })

  redirect(`/org/${orgSlug}/risks/${risk.id}`)
}

// ─── Update Risk ────────────────────────────────────────────────────────────

export async function updateRisk(riskId: string, formData: FormData) {
  const { userId, orgId, orgSlug } = await getSessionOrg()

  // Verify risk belongs to org
  const existing = await db.risk.findFirst({
    where: { id: riskId, orgId, deletedAt: null },
  })

  if (!existing) {
    throw new Error("Risk not found")
  }

  const rawData = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    categoryId: (formData.get("categoryId") as string) || undefined,
    owner: (formData.get("owner") as string) || undefined,
    inherentLikelihood: formData.get("inherentLikelihood") as string,
    inherentImpact: formData.get("inherentImpact") as string,
    treatment: formData.get("treatment") as string,
    treatmentPlan: (formData.get("treatmentPlan") as string) || undefined,
    reviewDate: (formData.get("reviewDate") as string) || undefined,
  }

  const validated = riskFormSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      error: validated.error.flatten().fieldErrors,
    }
  }

  const {
    title,
    description,
    categoryId,
    owner,
    inherentLikelihood,
    inherentImpact,
    treatment,
    treatmentPlan,
    reviewDate,
  } = validated.data

  const inherentScore = calculateRiskScore(
    inherentLikelihood as RiskLikelihood,
    inherentImpact as RiskImpact
  )
  const inherentLevel = getRiskLevel(inherentScore)

  const risk = await db.risk.update({
    where: { id: riskId },
    data: {
      title,
      description: description || null,
      categoryId: categoryId || null,
      owner: owner || null,
      inherentLikelihood: inherentLikelihood as RiskLikelihood,
      inherentImpact: inherentImpact as RiskImpact,
      inherentScore,
      inherentLevel,
      treatment: treatment as RiskTreatment,
      treatmentPlan: treatmentPlan || null,
      reviewDate: reviewDate ? new Date(reviewDate) : null,
    },
  })

  createAuditLog({
    orgId,
    userId,
    action: "UPDATED",
    entityType: "risk",
    entityId: risk.id,
    oldValues: {
      title: existing.title,
      inherentLevel: existing.inherentLevel,
      treatment: existing.treatment,
    },
    newValues: { title, inherentLevel, treatment },
  })

  revalidatePath(`/org/${orgSlug}/risks`)
  revalidatePath(`/org/${orgSlug}/risks/${riskId}`)
  redirect(`/org/${orgSlug}/risks/${riskId}`)
}

// ─── Delete Risk (Soft) ─────────────────────────────────────────────────────

export async function deleteRisk(riskId: string) {
  const { userId, orgId, orgSlug } = await getSessionOrg()

  const existing = await db.risk.findFirst({
    where: { id: riskId, orgId, deletedAt: null },
  })

  if (!existing) {
    throw new Error("Risk not found")
  }

  await db.risk.update({
    where: { id: riskId },
    data: { deletedAt: new Date() },
  })

  createAuditLog({
    orgId,
    userId,
    action: "DELETED",
    entityType: "risk",
    entityId: riskId,
    oldValues: { title: existing.title },
  })

  revalidatePath(`/org/${orgSlug}/risks`)
  redirect(`/org/${orgSlug}/risks`)
}
