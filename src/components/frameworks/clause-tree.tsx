"use client"

import * as React from "react"
import { ChevronRight, ChevronDown, FileText, Shield, ListChecks } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ClauseWithChildren } from "@/lib/queries/frameworks"

// ─── Types ──────────────────────────────────────────────────────────────────

interface ClauseTreeProps {
  clauses: ClauseWithChildren[]
}

interface ClauseNodeProps {
  clause: ClauseWithChildren
  depth: number
}

// ─── Guidance renderer ──────────────────────────────────────────────────────

function GuidanceSteps({ guidance }: { guidance: string }) {
  const lines = guidance
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)

  const steps = lines.map((line) =>
    line.replace(/^[-•]\s*/, "").replace(/^\d+\.\s*/, "")
  )

  return (
    <div className="mt-2 rounded-md bg-muted/40 p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <ListChecks className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-semibold text-primary">
          Implementation Steps
        </span>
      </div>
      <ul className="space-y-1.5">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-2 text-xs text-muted-foreground">
            <span className="shrink-0 font-mono text-primary/60">
              {i + 1}.
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Control Node (expandable) ──────────────────────────────────────────────

function ControlNode({
  control,
  depth,
}: {
  control: ClauseWithChildren["controls"][number]
  depth: number
}) {
  const [expanded, setExpanded] = React.useState(false)
  const hasGuidance = !!control.guidance

  return (
    <div
      className={cn(
        "rounded-md border-l-2 border-muted ml-2 text-sm",
        "hover:bg-muted/30 transition-colors"
      )}
      style={{ paddingLeft: `${(depth + 1) * 24 + 12}px` }}
    >
      <button
        className="flex w-full items-start gap-2 px-3 py-2 text-left"
        onClick={() => hasGuidance && setExpanded(!expanded)}
        type="button"
      >
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              {control.number}
            </span>
            <span className="truncate font-medium">{control.title}</span>
            {control.category && (
              <Badge
                variant="secondary"
                className="ml-auto shrink-0 text-xs"
              >
                {control.category}
              </Badge>
            )}
            {hasGuidance && (
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
                  !expanded && "-rotate-90"
                )}
              />
            )}
          </div>
          {control.objective && (
            <p
              className={cn(
                "mt-1 text-xs text-muted-foreground",
                !expanded && "line-clamp-2"
              )}
            >
              {control.objective}
            </p>
          )}
          {expanded && control.guidance && (
            <GuidanceSteps guidance={control.guidance} />
          )}
        </div>
      </button>
    </div>
  )
}

// ─── Clause Tree ────────────────────────────────────────────────────────────

export function ClauseTree({ clauses }: ClauseTreeProps) {
  if (clauses.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No clauses found for this framework.
      </p>
    )
  }

  return (
    <div className="space-y-1">
      {clauses.map((clause) => (
        <ClauseNode key={clause.id} clause={clause} depth={0} />
      ))}
    </div>
  )
}

// ─── Clause Node (recursive) ────────────────────────────────────────────────

function ClauseNode({ clause, depth }: ClauseNodeProps) {
  const [isOpen, setIsOpen] = React.useState(depth === 0)

  const hasChildren = clause.children && clause.children.length > 0
  const hasControls = clause.controls && clause.controls.length > 0
  const isExpandable = hasChildren || hasControls

  if (!isExpandable) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
          "hover:bg-muted/50"
        )}
        style={{ paddingLeft: `${depth * 24 + 12}px` }}
      >
        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="font-mono text-xs text-muted-foreground">
          {clause.number}
        </span>
        <span className="truncate">{clause.title}</span>
        {clause.isAnnex && (
          <Badge variant="secondary" className="ml-auto text-xs">
            Annex
          </Badge>
        )}
      </div>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm",
            "hover:bg-muted/50 transition-colors text-left"
          )}
          style={{ paddingLeft: `${depth * 24 + 12}px` }}
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-90"
            )}
          />
          <span className="font-mono text-xs text-muted-foreground">
            {clause.number}
          </span>
          <span className="truncate font-medium">{clause.title}</span>
          {clause.isAnnex && (
            <Badge variant="secondary" className="ml-1 text-xs">
              Annex
            </Badge>
          )}
          <div className="ml-auto flex items-center gap-2 shrink-0">
            {hasChildren && (
              <span className="text-xs text-muted-foreground">
                {clause.children.length}{" "}
                {clause.children.length === 1 ? "sub-clause" : "sub-clauses"}
              </span>
            )}
            {hasControls && (
              <Badge variant="outline" className="text-xs">
                <Shield className="mr-1 h-3 w-3" />
                {clause.controls.length}
              </Badge>
            )}
          </div>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {/* Render nested controls */}
        {hasControls && (
          <div className="space-y-1 py-1">
            {clause.controls.map((control) => (
              <ControlNode
                key={control.id}
                control={control}
                depth={depth}
              />
            ))}
          </div>
        )}

        {/* Render nested child clauses */}
        {hasChildren &&
          clause.children.map((child) => (
            <ClauseNode
              key={child.id}
              clause={child as ClauseWithChildren}
              depth={depth + 1}
            />
          ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
