"use client"

import * as React from "react"
import { ChevronRight, FileText, Shield } from "lucide-react"
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
              <div
                key={control.id}
                className={cn(
                  "flex items-start gap-2 rounded-md px-3 py-2 text-sm",
                  "hover:bg-muted/30 border-l-2 border-muted ml-2"
                )}
                style={{ paddingLeft: `${(depth + 1) * 24 + 12}px` }}
              >
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {control.number}
                    </span>
                    <span className="truncate font-medium">
                      {control.title}
                    </span>
                    {control.category && (
                      <Badge
                        variant="secondary"
                        className="ml-auto shrink-0 text-xs"
                      >
                        {control.category}
                      </Badge>
                    )}
                  </div>
                  {control.objective && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {control.objective}
                    </p>
                  )}
                </div>
              </div>
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
