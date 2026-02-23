"use client"

import * as React from "react"
import { Shield, ChevronDown, ListChecks } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SearchInput } from "@/components/shared/search-input"
import { EmptyState } from "@/components/shared/empty-state"
import { cn } from "@/lib/utils"
import type { FrameworkControl } from "@/lib/queries/frameworks"

interface ControlListProps {
  controls: FrameworkControl[]
}

function GuidanceSteps({ guidance }: { guidance: string }) {
  const lines = guidance
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)

  const steps = lines.map((line) =>
    line.replace(/^[-•]\s*/, "").replace(/^\d+\.\s*/, "")
  )

  return (
    <div className="rounded-md bg-muted/40 p-3">
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

export function ControlList({ controls }: ControlListProps) {
  const [search, setSearch] = React.useState("")
  const [expandedId, setExpandedId] = React.useState<string | null>(null)

  const filteredControls = React.useMemo(() => {
    if (!search) return controls

    const query = search.toLowerCase()
    return controls.filter(
      (control) =>
        control.number.toLowerCase().includes(query) ||
        control.title.toLowerCase().includes(query) ||
        (control.category && control.category.toLowerCase().includes(query)) ||
        control.clause.number.toLowerCase().includes(query) ||
        control.clause.title.toLowerCase().includes(query)
    )
  }, [controls, search])

  return (
    <div className="space-y-4">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search controls by number, title, category, or clause..."
        className="max-w-md"
      />

      {filteredControls.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="No controls found"
          description={
            search
              ? "Try adjusting your search terms."
              : "No controls are defined for this framework."
          }
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Number</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-[160px]">Category</TableHead>
                <TableHead className="w-[200px]">Clause</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredControls.map((control) => {
                const isExpanded = expandedId === control.id
                const hasDetails = !!control.objective || !!control.guidance

                return (
                  <React.Fragment key={control.id}>
                    <TableRow
                      className={cn(
                        hasDetails && "cursor-pointer",
                        isExpanded && "bg-muted/30"
                      )}
                      onClick={() =>
                        hasDetails &&
                        setExpandedId(isExpanded ? null : control.id)
                      }
                    >
                      <TableCell>
                        <span className="font-mono text-xs">
                          {control.number}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{control.title}</span>
                          {hasDetails && (
                            <ChevronDown
                              className={cn(
                                "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
                                !isExpanded && "-rotate-90"
                              )}
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {control.category ? (
                          <Badge variant="secondary" className="text-xs">
                            {control.category}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {control.clause.number} - {control.clause.title}
                        </span>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow className="bg-muted/20 hover:bg-muted/20">
                        <TableCell colSpan={4} className="py-3">
                          <div className="space-y-3 pl-4">
                            {control.objective && (
                              <div>
                                <span className="text-xs font-semibold text-foreground">
                                  Objective
                                </span>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {control.objective}
                                </p>
                              </div>
                            )}
                            {control.guidance && (
                              <GuidanceSteps guidance={control.guidance} />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {filteredControls.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Showing {filteredControls.length} of {controls.length}{" "}
          {controls.length === 1 ? "control" : "controls"}
        </p>
      )}
    </div>
  )
}
