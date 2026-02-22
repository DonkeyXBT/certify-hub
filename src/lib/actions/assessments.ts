"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import {
  createAssessmentSchema,
  updateAssessmentSchema,
  saveAssessmentResponseSchema,
} from "@/lib/validations/assessment"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function getAuthenticatedUser() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }
  return session.user
}

async function validateOrgAccess(userId: string, orgId: string) {
  const membership = await db.membership.findUnique({
    where: {
      userId_orgId: {
        userId,
        orgId,
      },
    },
    select: {
      id: true,
      role: true,
      isActive: true,
    },
  })

  if (!membership || !membership.isActive) {
    throw new Error("Unauthorized: No active membership for this organization")
  }

  return membership
}

export async function createAssessment(orgSlug: string, formData: FormData) {
  const user = await getAuthenticatedUser()

  const org = await db.organization.findUnique({
    where: { slug: orgSlug, deletedAt: null },
    select: { id: true },
  })

  if (!org) {
    throw new Error("Organization not found")
  }

  await validateOrgAccess(user.id, org.id)

  const rawData = {
    name: formData.get("name") as string,
    frameworkId: formData.get("frameworkId") as string,
    startDate: formData.get("startDate")
      ? new Date(formData.get("startDate") as string)
      : undefined,
  }

  const validated = createAssessmentSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      error: validated.error.flatten().fieldErrors,
    }
  }

  const { name, frameworkId, startDate } = validated.data

  const assessment = await db.assessment.create({
    data: {
      name,
      orgId: org.id,
      frameworkId,
      status: "NOT_STARTED",
      startDate,
    },
  })

  redirect(`/org/${orgSlug}/assessments/${assessment.id}`)
}

export async function updateAssessment(
  assessmentId: string,
  data: Record<string, unknown>
) {
  const user = await getAuthenticatedUser()

  const assessment = await db.assessment.findUnique({
    where: { id: assessmentId },
    select: {
      id: true,
      orgId: true,
      org: { select: { slug: true } },
    },
  })

  if (!assessment) {
    throw new Error("Assessment not found")
  }

  await validateOrgAccess(user.id, assessment.orgId)

  const validated = updateAssessmentSchema.safeParse(data)

  if (!validated.success) {
    return {
      error: validated.error.flatten().fieldErrors,
    }
  }

  await db.assessment.update({
    where: { id: assessmentId },
    data: validated.data,
  })

  revalidatePath(`/org/${assessment.org.slug}/assessments/${assessmentId}`)
  return { success: true }
}

export async function saveAssessmentResponse(formData: FormData) {
  const user = await getAuthenticatedUser()

  const rawData = {
    assessmentId: formData.get("assessmentId") as string,
    clauseId: (formData.get("clauseId") as string) || undefined,
    controlId: (formData.get("controlId") as string) || undefined,
    requirementId: (formData.get("requirementId") as string) || undefined,
    complianceStatus: formData.get("complianceStatus") as string,
    maturityLevel: formData.get("maturityLevel")
      ? parseInt(formData.get("maturityLevel") as string, 10)
      : undefined,
    gaps: (formData.get("gaps") as string) || undefined,
    recommendations: (formData.get("recommendations") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
  }

  const validated = saveAssessmentResponseSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      error: validated.error.flatten().fieldErrors,
    }
  }

  const { assessmentId, clauseId, controlId, requirementId, ...responseData } =
    validated.data

  const assessment = await db.assessment.findUnique({
    where: { id: assessmentId },
    select: {
      id: true,
      orgId: true,
      status: true,
      org: { select: { slug: true } },
    },
  })

  if (!assessment) {
    throw new Error("Assessment not found")
  }

  await validateOrgAccess(user.id, assessment.orgId)

  // Auto-transition to IN_PROGRESS if still NOT_STARTED
  if (assessment.status === "NOT_STARTED") {
    await db.assessment.update({
      where: { id: assessmentId },
      data: {
        status: "IN_PROGRESS",
        startDate: new Date(),
      },
    })
  }

  // Upsert the response — find existing by assessment + clause/control/requirement
  const existingResponse = await db.assessmentResponse.findFirst({
    where: {
      assessmentId,
      clauseId: clauseId ?? null,
      controlId: controlId ?? null,
      requirementId: requirementId ?? null,
    },
  })

  if (existingResponse) {
    await db.assessmentResponse.update({
      where: { id: existingResponse.id },
      data: responseData,
    })
  } else {
    await db.assessmentResponse.create({
      data: {
        assessmentId,
        clauseId,
        controlId,
        requirementId,
        ...responseData,
      },
    })
  }

  revalidatePath(`/org/${assessment.org.slug}/assessments/${assessmentId}`)
  return { success: true }
}

export async function completeAssessment(assessmentId: string) {
  const user = await getAuthenticatedUser()

  const assessment = await db.assessment.findUnique({
    where: { id: assessmentId },
    select: {
      id: true,
      orgId: true,
      org: { select: { slug: true } },
    },
  })

  if (!assessment) {
    throw new Error("Assessment not found")
  }

  await validateOrgAccess(user.id, assessment.orgId)

  // Calculate overall score based on responses
  const responses = await db.assessmentResponse.findMany({
    where: { assessmentId },
  })

  if (responses.length === 0) {
    return { error: "Cannot complete assessment with no responses" }
  }

  // Calculate score: COMPLIANT=100, PARTIALLY_COMPLIANT=50, NON_COMPLIANT=0, NOT_ASSESSED=excluded
  const scoredResponses = responses.filter(
    (r) => r.complianceStatus !== "NOT_ASSESSED"
  )

  let overallScore = 0
  if (scoredResponses.length > 0) {
    const totalPoints = scoredResponses.reduce((sum, r) => {
      switch (r.complianceStatus) {
        case "COMPLIANT":
          return sum + 100
        case "PARTIALLY_COMPLIANT":
          return sum + 50
        case "NON_COMPLIANT":
          return sum + 0
        default:
          return sum
      }
    }, 0)

    overallScore = Math.round(totalPoints / scoredResponses.length)
  }

  await db.assessment.update({
    where: { id: assessmentId },
    data: {
      status: "COMPLETED",
      overallScore,
      endDate: new Date(),
    },
  })

  revalidatePath(`/org/${assessment.org.slug}/assessments/${assessmentId}`)
  return { success: true, overallScore }
}
