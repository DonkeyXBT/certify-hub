import type { OrgRole } from "@prisma/client"
import type { LucideIcon } from "lucide-react"

// ─── Session & Auth ──────────────────────────────────────────────────────────

export interface SessionUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  orgId?: string
  orgSlug?: string
  orgRole?: OrgRole
  isSuperAdmin?: boolean
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export interface NavItem {
  title: string
  href: string
  icon?: LucideIcon
  description?: string
  disabled?: boolean
  external?: boolean
  badge?: string
  minRole?: OrgRole
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

// ─── Breadcrumb ──────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  label: string
  href?: string
}

// ─── API & Data ──────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = unknown> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
  search?: string
}

// ─── Dashboard & Stats ──────────────────────────────────────────────────────

export interface StatCard {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
}

// ─── Form & Table ────────────────────────────────────────────────────────────

export interface SelectOption {
  label: string
  value: string
}

export interface FilterOption {
  id: string
  label: string
  options: SelectOption[]
}

// ─── Entity Types (for audit log, comments, etc.) ────────────────────────────

export type EntityType =
  | "framework"
  | "assessment"
  | "risk"
  | "control"
  | "document"
  | "audit"
  | "evidence"
  | "task"
  | "soa"
  | "capa"
  | "training"
  | "organization"
  | "membership"
  | "invitation"
