"use client"

import * as React from "react"
import { Shield } from "lucide-react"
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
import type { FrameworkControl } from "@/lib/queries/frameworks"

interface ControlListProps {
  controls: FrameworkControl[]
}

export function ControlList({ controls }: ControlListProps) {
  const [search, setSearch] = React.useState("")

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
              {filteredControls.map((control) => (
                <TableRow key={control.id}>
                  <TableCell>
                    <span className="font-mono text-xs">
                      {control.number}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{control.title}</span>
                      {control.objective && (
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                          {control.objective}
                        </p>
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
              ))}
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
