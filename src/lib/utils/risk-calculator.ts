import type { RiskLikelihood, RiskImpact, RiskLevel } from "@prisma/client"

// ─── Numeric Mappings ────────────────────────────────────────────────────────

const LIKELIHOOD_VALUES: Record<RiskLikelihood, number> = {
  VERY_LOW: 1,
  LOW: 2,
  MEDIUM: 3,
  HIGH: 4,
  VERY_HIGH: 5,
}

const IMPACT_VALUES: Record<RiskImpact, number> = {
  NEGLIGIBLE: 1,
  MINOR: 2,
  MODERATE: 3,
  MAJOR: 4,
  CATASTROPHIC: 5,
}

// ─── Core Calculations ───────────────────────────────────────────────────────

/**
 * Calculate risk score as likelihood * impact.
 * Range: 1 (very low/negligible) to 25 (very high/catastrophic).
 */
export function calculateRiskScore(
  likelihood: RiskLikelihood,
  impact: RiskImpact
): number {
  return LIKELIHOOD_VALUES[likelihood] * IMPACT_VALUES[impact]
}

/**
 * Determine the risk level from a numeric score.
 *   1-4   => LOW
 *   5-9   => MEDIUM
 *   10-15 => HIGH
 *   16-25 => CRITICAL
 */
export function getRiskLevel(score: number): RiskLevel {
  if (score <= 4) return "LOW"
  if (score <= 9) return "MEDIUM"
  if (score <= 15) return "HIGH"
  return "CRITICAL"
}

/**
 * Get the display color for a given risk level.
 */
export function getRiskColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    LOW: "#22c55e",       // green-500
    MEDIUM: "#eab308",    // yellow-500
    HIGH: "#f97316",      // orange-500
    CRITICAL: "#ef4444",  // red-500
  }
  return colors[level]
}

/**
 * Get the Tailwind CSS class for a given risk level.
 */
export function getRiskColorClass(level: RiskLevel): string {
  const classes: Record<RiskLevel, string> = {
    LOW: "text-green-600 bg-green-50 border-green-200",
    MEDIUM: "text-yellow-600 bg-yellow-50 border-yellow-200",
    HIGH: "text-orange-600 bg-orange-50 border-orange-200",
    CRITICAL: "text-red-600 bg-red-50 border-red-200",
  }
  return classes[level]
}

/**
 * Get the human-readable label for a risk level.
 */
export function getRiskLevelLabel(level: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    CRITICAL: "Critical",
  }
  return labels[level]
}

/**
 * Full risk calculation: takes likelihood + impact, returns score, level, color.
 */
export function evaluateRisk(
  likelihood: RiskLikelihood,
  impact: RiskImpact
): {
  score: number
  level: RiskLevel
  color: string
  colorClass: string
} {
  const score = calculateRiskScore(likelihood, impact)
  const level = getRiskLevel(score)
  return {
    score,
    level,
    color: getRiskColor(level),
    colorClass: getRiskColorClass(level),
  }
}

/**
 * Get numeric value for a likelihood enum.
 */
export function getLikelihoodValue(likelihood: RiskLikelihood): number {
  return LIKELIHOOD_VALUES[likelihood]
}

/**
 * Get numeric value for an impact enum.
 */
export function getImpactValue(impact: RiskImpact): number {
  return IMPACT_VALUES[impact]
}
