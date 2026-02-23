export type FlatControl = {
  id: string
  number: string
  title: string
  clauseNumber: string
  clauseTitle: string
  clauseId: string
}

export function flattenClauses(clauses: any[]): FlatControl[] {
  const result: FlatControl[] = []

  function process(clause: any) {
    if (clause.controls?.length > 0) {
      for (const ctrl of clause.controls) {
        result.push({
          id: ctrl.id,
          number: ctrl.number,
          title: ctrl.title,
          clauseNumber: clause.number,
          clauseTitle: clause.title,
          clauseId: clause.id,
        })
      }
    }
    if (clause.children?.length > 0) {
      for (const child of clause.children) process(child)
    }
  }

  for (const c of clauses) process(c)
  return result
}

export function getComplianceColor(status?: string): string {
  switch (status) {
    case "COMPLIANT":
      return "bg-green-500"
    case "PARTIALLY_COMPLIANT":
      return "bg-yellow-500"
    case "NON_COMPLIANT":
      return "bg-red-500"
    default:
      return "bg-gray-300 dark:bg-gray-600"
  }
}

export function getComplianceLabel(status?: string): string {
  switch (status) {
    case "COMPLIANT":
      return "Compliant"
    case "PARTIALLY_COMPLIANT":
      return "Partially Compliant"
    case "NON_COMPLIANT":
      return "Non-Compliant"
    default:
      return "Not Assessed"
  }
}
