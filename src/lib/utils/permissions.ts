import type { OrgRole } from "@prisma/client"

// ─── Role Hierarchy ──────────────────────────────────────────────────────────

const ROLE_HIERARCHY: Record<OrgRole, number> = {
  ADMIN: 40,
  AUDITOR: 30,
  MANAGER: 20,
  VIEWER: 10,
}

// ─── Entity & Action Types ───────────────────────────────────────────────────

export type PermissionEntity =
  | "frameworks"
  | "assessments"
  | "risks"
  | "controls"
  | "documents"
  | "audits"
  | "evidence"
  | "tasks"
  | "soa"
  | "capa"
  | "training"
  | "settings"

export type PermissionAction = "create" | "read" | "update" | "delete"

// ─── Permission Matrix ───────────────────────────────────────────────────────
// Maps each entity + action to the minimum role required.

const PERMISSION_MATRIX: Record<
  PermissionEntity,
  Record<PermissionAction, OrgRole>
> = {
  frameworks: {
    create: "ADMIN",
    read: "VIEWER",
    update: "ADMIN",
    delete: "ADMIN",
  },
  assessments: {
    create: "MANAGER",
    read: "VIEWER",
    update: "MANAGER",
    delete: "ADMIN",
  },
  risks: {
    create: "MANAGER",
    read: "VIEWER",
    update: "MANAGER",
    delete: "ADMIN",
  },
  controls: {
    create: "MANAGER",
    read: "VIEWER",
    update: "MANAGER",
    delete: "ADMIN",
  },
  documents: {
    create: "MANAGER",
    read: "VIEWER",
    update: "MANAGER",
    delete: "ADMIN",
  },
  audits: {
    create: "AUDITOR",
    read: "VIEWER",
    update: "AUDITOR",
    delete: "ADMIN",
  },
  evidence: {
    create: "MANAGER",
    read: "VIEWER",
    update: "MANAGER",
    delete: "ADMIN",
  },
  tasks: {
    create: "MANAGER",
    read: "VIEWER",
    update: "MANAGER",
    delete: "ADMIN",
  },
  soa: {
    create: "MANAGER",
    read: "VIEWER",
    update: "MANAGER",
    delete: "ADMIN",
  },
  capa: {
    create: "MANAGER",
    read: "VIEWER",
    update: "MANAGER",
    delete: "ADMIN",
  },
  training: {
    create: "MANAGER",
    read: "VIEWER",
    update: "MANAGER",
    delete: "ADMIN",
  },
  settings: {
    create: "ADMIN",
    read: "ADMIN",
    update: "ADMIN",
    delete: "ADMIN",
  },
}

// ─── Permission Check Functions ──────────────────────────────────────────────

/**
 * Check if a role meets or exceeds the minimum role requirement.
 */
export function canAccess(role: OrgRole, minRole: OrgRole): boolean {
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[minRole]
}

/**
 * Check if a role has permission to perform an action on an entity.
 */
export function hasPermission(
  role: OrgRole,
  entity: PermissionEntity,
  action: PermissionAction
): boolean {
  const minRole = PERMISSION_MATRIX[entity]?.[action]
  if (!minRole) return false
  return canAccess(role, minRole)
}

/**
 * Get the minimum role required for a specific entity action.
 */
export function getMinRole(
  entity: PermissionEntity,
  action: PermissionAction
): OrgRole | undefined {
  return PERMISSION_MATRIX[entity]?.[action]
}

/**
 * Get all permissions for a given role across all entities.
 */
export function getRolePermissions(
  role: OrgRole
): Record<PermissionEntity, Record<PermissionAction, boolean>> {
  const entities = Object.keys(PERMISSION_MATRIX) as PermissionEntity[]
  const actions: PermissionAction[] = ["create", "read", "update", "delete"]

  const permissions = {} as Record<
    PermissionEntity,
    Record<PermissionAction, boolean>
  >

  for (const entity of entities) {
    permissions[entity] = {} as Record<PermissionAction, boolean>
    for (const action of actions) {
      permissions[entity][action] = hasPermission(role, entity, action)
    }
  }

  return permissions
}

/**
 * Get human-readable label for a role.
 */
export function getRoleLabel(role: OrgRole): string {
  const labels: Record<OrgRole, string> = {
    ADMIN: "Administrator",
    AUDITOR: "Auditor",
    MANAGER: "Manager",
    VIEWER: "Viewer",
  }
  return labels[role]
}
