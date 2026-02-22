import type {
  ComplianceStatus,
  RiskLevel,
  TaskStatus,
  TaskPriority,
  OrgRole,
  DocumentStatus,
  AuditStatus,
  CAPAStatus,
  FindingSeverity,
  RiskStatus,
  ControlImplStatus,
  TrainingStatus,
} from "@prisma/client"

// ─── App ────────────────────────────────────────────────────────────────────

export const APP_NAME = "CertifyHub"
export const APP_DESCRIPTION =
  "Multi-tenant GRC platform for ISO certification management"
export const APP_VERSION = "0.1.0"

// ─── Roles ──────────────────────────────────────────────────────────────────

export const ROLES: { value: OrgRole; label: string; description: string }[] = [
  {
    value: "ADMIN",
    label: "Administrator",
    description: "Full access to all organization settings and data",
  },
  {
    value: "AUDITOR",
    label: "Auditor",
    description: "Can manage audits, findings, and view all compliance data",
  },
  {
    value: "MANAGER",
    label: "Manager",
    description:
      "Can manage risks, controls, documents, tasks, and assignments",
  },
  {
    value: "VIEWER",
    label: "Viewer",
    description: "Read-only access to compliance data and reports",
  },
]

// ─── Status Colors ──────────────────────────────────────────────────────────

export const COMPLIANCE_STATUS_COLORS: Record<ComplianceStatus, string> = {
  NOT_ASSESSED: "text-gray-600 bg-gray-50 border-gray-200",
  NON_COMPLIANT: "text-red-600 bg-red-50 border-red-200",
  PARTIALLY_COMPLIANT: "text-yellow-600 bg-yellow-50 border-yellow-200",
  COMPLIANT: "text-green-600 bg-green-50 border-green-200",
}

export const RISK_LEVEL_COLORS: Record<RiskLevel, string> = {
  LOW: "text-green-600 bg-green-50 border-green-200",
  MEDIUM: "text-yellow-600 bg-yellow-50 border-yellow-200",
  HIGH: "text-orange-600 bg-orange-50 border-orange-200",
  CRITICAL: "text-red-600 bg-red-50 border-red-200",
}

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  TODO: "text-gray-600 bg-gray-50 border-gray-200",
  IN_PROGRESS: "text-blue-600 bg-blue-50 border-blue-200",
  IN_REVIEW: "text-purple-600 bg-purple-50 border-purple-200",
  COMPLETED: "text-green-600 bg-green-50 border-green-200",
  CANCELLED: "text-gray-400 bg-gray-50 border-gray-200",
  OVERDUE: "text-red-600 bg-red-50 border-red-200",
}

export const TASK_PRIORITY_COLORS: Record<TaskPriority, string> = {
  LOW: "text-gray-600 bg-gray-50 border-gray-200",
  MEDIUM: "text-blue-600 bg-blue-50 border-blue-200",
  HIGH: "text-orange-600 bg-orange-50 border-orange-200",
  CRITICAL: "text-red-600 bg-red-50 border-red-200",
}

export const DOCUMENT_STATUS_COLORS: Record<DocumentStatus, string> = {
  DRAFT: "text-gray-600 bg-gray-50 border-gray-200",
  PENDING_REVIEW: "text-yellow-600 bg-yellow-50 border-yellow-200",
  PENDING_APPROVAL: "text-orange-600 bg-orange-50 border-orange-200",
  APPROVED: "text-green-600 bg-green-50 border-green-200",
  SUPERSEDED: "text-blue-600 bg-blue-50 border-blue-200",
  OBSOLETE: "text-gray-400 bg-gray-50 border-gray-200",
}

export const AUDIT_STATUS_COLORS: Record<AuditStatus, string> = {
  PLANNED: "text-gray-600 bg-gray-50 border-gray-200",
  IN_PROGRESS: "text-blue-600 bg-blue-50 border-blue-200",
  FIELDWORK_COMPLETE: "text-purple-600 bg-purple-50 border-purple-200",
  REPORT_DRAFT: "text-yellow-600 bg-yellow-50 border-yellow-200",
  REPORT_FINAL: "text-orange-600 bg-orange-50 border-orange-200",
  CLOSED: "text-green-600 bg-green-50 border-green-200",
}

export const CAPA_STATUS_COLORS: Record<CAPAStatus, string> = {
  OPEN: "text-red-600 bg-red-50 border-red-200",
  ROOT_CAUSE_ANALYSIS: "text-orange-600 bg-orange-50 border-orange-200",
  ACTION_PLANNED: "text-yellow-600 bg-yellow-50 border-yellow-200",
  ACTION_IN_PROGRESS: "text-blue-600 bg-blue-50 border-blue-200",
  VERIFICATION: "text-purple-600 bg-purple-50 border-purple-200",
  CLOSED: "text-green-600 bg-green-50 border-green-200",
  CLOSED_INEFFECTIVE: "text-gray-600 bg-gray-50 border-gray-200",
}

export const FINDING_SEVERITY_COLORS: Record<FindingSeverity, string> = {
  OBSERVATION: "text-blue-600 bg-blue-50 border-blue-200",
  OPPORTUNITY_FOR_IMPROVEMENT:
    "text-yellow-600 bg-yellow-50 border-yellow-200",
  MINOR_NONCONFORMITY: "text-orange-600 bg-orange-50 border-orange-200",
  MAJOR_NONCONFORMITY: "text-red-600 bg-red-50 border-red-200",
}

export const RISK_STATUS_COLORS: Record<RiskStatus, string> = {
  IDENTIFIED: "text-gray-600 bg-gray-50 border-gray-200",
  ANALYSED: "text-blue-600 bg-blue-50 border-blue-200",
  TREATMENT_PLANNED: "text-yellow-600 bg-yellow-50 border-yellow-200",
  TREATMENT_IN_PROGRESS: "text-orange-600 bg-orange-50 border-orange-200",
  TREATED: "text-green-600 bg-green-50 border-green-200",
  CLOSED: "text-gray-400 bg-gray-50 border-gray-200",
  MONITORING: "text-purple-600 bg-purple-50 border-purple-200",
}

export const CONTROL_IMPL_STATUS_COLORS: Record<ControlImplStatus, string> = {
  NOT_IMPLEMENTED: "text-red-600 bg-red-50 border-red-200",
  PLANNED: "text-yellow-600 bg-yellow-50 border-yellow-200",
  PARTIALLY_IMPLEMENTED: "text-orange-600 bg-orange-50 border-orange-200",
  FULLY_IMPLEMENTED: "text-green-600 bg-green-50 border-green-200",
  NOT_APPLICABLE: "text-gray-400 bg-gray-50 border-gray-200",
}

export const TRAINING_STATUS_COLORS: Record<TrainingStatus, string> = {
  NOT_STARTED: "text-gray-600 bg-gray-50 border-gray-200",
  IN_PROGRESS: "text-blue-600 bg-blue-50 border-blue-200",
  COMPLETED: "text-green-600 bg-green-50 border-green-200",
  OVERDUE: "text-red-600 bg-red-50 border-red-200",
  WAIVED: "text-gray-400 bg-gray-50 border-gray-200",
}

// ─── Status Labels ──────────────────────────────────────────────────────────

export const COMPLIANCE_STATUS_LABELS: Record<ComplianceStatus, string> = {
  NOT_ASSESSED: "Not Assessed",
  NON_COMPLIANT: "Non-Compliant",
  PARTIALLY_COMPLIANT: "Partially Compliant",
  COMPLIANT: "Compliant",
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  OVERDUE: "Overdue",
}

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
}

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  DRAFT: "Draft",
  PENDING_REVIEW: "Pending Review",
  PENDING_APPROVAL: "Pending Approval",
  APPROVED: "Approved",
  SUPERSEDED: "Superseded",
  OBSOLETE: "Obsolete",
}

export const AUDIT_STATUS_LABELS: Record<AuditStatus, string> = {
  PLANNED: "Planned",
  IN_PROGRESS: "In Progress",
  FIELDWORK_COMPLETE: "Fieldwork Complete",
  REPORT_DRAFT: "Report Draft",
  REPORT_FINAL: "Report Final",
  CLOSED: "Closed",
}

// ─── Pagination ─────────────────────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 20
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]
