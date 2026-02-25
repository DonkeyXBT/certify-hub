"use client"

import { Search, User, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface TaskFilters {
  search: string
  assigneeId: string   // "all" | "unassigned" | userId
  priority: string     // "all" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
}

export const DEFAULT_FILTERS: TaskFilters = {
  search: "",
  assigneeId: "all",
  priority: "all",
}

interface Member {
  user: { id: string; name: string | null; email: string }
}

interface TaskFiltersBarProps {
  filters: TaskFilters
  onChange: (filters: TaskFilters) => void
  members: Member[]
  currentUserId: string
  totalCount: number
  filteredCount: number
}

export function TaskFiltersBar({
  filters,
  onChange,
  members,
  currentUserId,
  totalCount,
  filteredCount,
}: TaskFiltersBarProps) {
  const hasActiveFilters =
    filters.search !== "" ||
    filters.assigneeId !== "all" ||
    filters.priority !== "all"

  const isMyTasks = filters.assigneeId === currentUserId

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search tasks…"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="pl-8 h-8 w-44 text-sm"
        />
      </div>

      <Select
        value={filters.assigneeId}
        onValueChange={(v) => onChange({ ...filters, assigneeId: v })}
      >
        <SelectTrigger className="h-8 w-36 text-xs">
          <SelectValue placeholder="Assignee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          <SelectItem value="unassigned">Unassigned</SelectItem>
          {members.map((m) => (
            <SelectItem key={m.user.id} value={m.user.id}>
              {m.user.name ?? m.user.email}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.priority}
        onValueChange={(v) => onChange({ ...filters, priority: v })}
      >
        <SelectTrigger className="h-8 w-32 text-xs">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          <SelectItem value="CRITICAL">Critical</SelectItem>
          <SelectItem value="HIGH">High</SelectItem>
          <SelectItem value="MEDIUM">Medium</SelectItem>
          <SelectItem value="LOW">Low</SelectItem>
        </SelectContent>
      </Select>

      <Button
        size="sm"
        variant={isMyTasks ? "default" : "outline"}
        className="h-8 gap-1.5 text-xs"
        onClick={() =>
          onChange({ ...filters, assigneeId: isMyTasks ? "all" : currentUserId })
        }
      >
        <User className="h-3.5 w-3.5" />
        My tasks
      </Button>

      {hasActiveFilters && (
        <>
          <span className="text-xs text-muted-foreground">
            {filteredCount}/{totalCount}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 gap-1 text-xs text-muted-foreground"
            onClick={() => onChange(DEFAULT_FILTERS)}
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        </>
      )}
    </div>
  )
}
