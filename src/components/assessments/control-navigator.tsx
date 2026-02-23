"use client"

import * as React from "react"
import { ChevronRight, Search } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { getComplianceColor } from "@/lib/utils/assessment-helpers"

// ─── Types ──────────────────────────────────────────────────────────────────

interface ControlNavigatorProps {
  clauses: any[]
  responses: Map<string, { complianceStatus: string }>
  selectedControlId: string | null
  onSelectControl: (controlId: string) => void
}

interface ClauseGroupProps {
  clause: any
  depth: number
  responses: Map<string, { complianceStatus: string }>
  selectedControlId: string | null
  onSelectControl: (controlId: string) => void
  searchFilter: string
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function countControls(
  clause: any,
  responses: Map<string, { complianceStatus: string }>
): { total: number; assessed: number } {
  let total = 0
  let assessed = 0

  if (clause.controls?.length > 0) {
    for (const ctrl of clause.controls) {
      total++
      const r = responses.get(ctrl.id)
      if (r && r.complianceStatus !== "NOT_ASSESSED") assessed++
    }
  }

  if (clause.children?.length > 0) {
    for (const child of clause.children) {
      const childStats = countControls(child, responses)
      total += childStats.total
      assessed += childStats.assessed
    }
  }

  return { total, assessed }
}

function clauseMatchesSearch(clause: any, filter: string): boolean {
  if (!filter) return true
  const lower = filter.toLowerCase()

  if (clause.controls?.length > 0) {
    for (const ctrl of clause.controls) {
      if (
        ctrl.number.toLowerCase().includes(lower) ||
        ctrl.title.toLowerCase().includes(lower)
      ) {
        return true
      }
    }
  }

  if (clause.children?.length > 0) {
    for (const child of clause.children) {
      if (clauseMatchesSearch(child, filter)) return true
    }
  }

  return false
}

function controlMatchesSearch(
  control: { number: string; title: string },
  filter: string
): boolean {
  if (!filter) return true
  const lower = filter.toLowerCase()
  return (
    control.number.toLowerCase().includes(lower) ||
    control.title.toLowerCase().includes(lower)
  )
}

// ─── Clause Group ───────────────────────────────────────────────────────────

function ClauseGroup({
  clause,
  depth,
  responses,
  selectedControlId,
  onSelectControl,
  searchFilter,
}: ClauseGroupProps) {
  const [isOpen, setIsOpen] = React.useState(depth === 0 || !!searchFilter)
  const stats = countControls(clause, responses)

  const hasChildren = clause.children && clause.children.length > 0
  const hasControls = clause.controls && clause.controls.length > 0

  if (!hasChildren && !hasControls) return null
  if (searchFilter && !clauseMatchesSearch(clause, searchFilter)) return null

  const filteredControls = hasControls
    ? clause.controls.filter((c: any) => controlMatchesSearch(c, searchFilter))
    : []

  return (
    <Collapsible open={isOpen || !!searchFilter} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center gap-2 px-3 py-2 text-sm",
            "hover:bg-muted/50 transition-colors text-left"
          )}
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
        >
          <ChevronRight
            className={cn(
              "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
              (isOpen || searchFilter) && "rotate-90"
            )}
          />
          <span className="font-mono text-xs text-muted-foreground">
            {clause.number}
          </span>
          <span className="truncate font-medium text-xs">{clause.title}</span>
          {stats.total > 0 && (
            <span className="ml-auto shrink-0 text-xs text-muted-foreground">
              {stats.assessed}/{stats.total}
            </span>
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {filteredControls.map((control: any) => {
          const response = responses.get(control.id)
          const isSelected = selectedControlId === control.id
          return (
            <button
              key={control.id}
              onClick={() => onSelectControl(control.id)}
              className={cn(
                "flex w-full items-center gap-2 py-1.5 text-sm text-left transition-colors",
                "hover:bg-muted/50",
                isSelected && "bg-accent text-accent-foreground"
              )}
              style={{ paddingLeft: `${(depth + 1) * 20 + 16}px`, paddingRight: "12px" }}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full shrink-0",
                  getComplianceColor(response?.complianceStatus)
                )}
              />
              <span className="font-mono text-xs text-muted-foreground shrink-0">
                {control.number}
              </span>
              <span className="truncate text-xs">{control.title}</span>
            </button>
          )
        })}

        {hasChildren &&
          clause.children.map((child: any) => (
            <ClauseGroup
              key={child.id}
              clause={child}
              depth={depth + 1}
              responses={responses}
              selectedControlId={selectedControlId}
              onSelectControl={onSelectControl}
              searchFilter={searchFilter}
            />
          ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

// ─── Control Navigator ──────────────────────────────────────────────────────

export function ControlNavigator({
  clauses,
  responses,
  selectedControlId,
  onSelectControl,
}: ControlNavigatorProps) {
  const [search, setSearch] = React.useState("")

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      <div className="p-3 border-b shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search controls..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="py-1">
          {clauses.map((clause) => (
            <ClauseGroup
              key={clause.id}
              clause={clause}
              depth={0}
              responses={responses}
              selectedControlId={selectedControlId}
              onSelectControl={onSelectControl}
              searchFilter={search}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
