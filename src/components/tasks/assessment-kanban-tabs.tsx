"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { KanbanBoard } from "./kanban-board"
import type { KanbanTask, ActiveAssessmentWithTasks } from "@/lib/queries/tasks"

interface AssessmentTaskSet {
  assessment: ActiveAssessmentWithTasks
  tasks: KanbanTask[]
}

interface Member {
  user: { id: string; name: string | null; email: string }
}

interface ControlImpl {
  id: string
  control: { number: string; title: string }
}

interface LinkOption {
  id: string
  title: string
}

interface Props {
  generalTasks: KanbanTask[]
  assessmentTaskSets: AssessmentTaskSet[]
  orgSlug: string
  members: Member[]
  controls: ControlImpl[]
  risks: LinkOption[]
  capas: LinkOption[]
}

export function AssessmentKanbanTabs({
  generalTasks,
  assessmentTaskSets,
  orgSlug,
  members,
  controls,
  risks,
  capas,
}: Props) {
  const hasAssessments = assessmentTaskSets.length > 0

  if (!hasAssessments) {
    return (
      <KanbanBoard
        initialTasks={generalTasks}
        orgSlug={orgSlug}
        members={members}
        controls={controls}
        risks={risks}
        capas={capas}
      />
    )
  }

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="mb-4 h-auto flex-wrap gap-1">
        <TabsTrigger value="general" className="gap-2">
          General
          <Badge variant="secondary" className="text-xs">
            {generalTasks.filter(
              (t) => t.status !== "CANCELLED" && t.status !== "OVERDUE"
            ).length}
          </Badge>
        </TabsTrigger>
        {assessmentTaskSets.map(({ assessment }) => (
          <TabsTrigger
            key={assessment.id}
            value={assessment.id}
            className="gap-2"
          >
            {assessment.framework.code}: {assessment.name}
            <Badge variant="secondary" className="text-xs">
              {assessment._count.tasks}
            </Badge>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="general">
        <KanbanBoard
          initialTasks={generalTasks}
          orgSlug={orgSlug}
          members={members}
          controls={controls}
          risks={risks}
          capas={capas}
        />
      </TabsContent>

      {assessmentTaskSets.map(({ assessment, tasks }) => (
        <TabsContent key={assessment.id} value={assessment.id}>
          <p className="text-sm text-muted-foreground mb-3">
            Certification tasks for{" "}
            <span className="font-medium text-foreground">
              {assessment.framework.name}
            </span>{" "}
            &mdash; {assessment.name}
          </p>
          <KanbanBoard
            initialTasks={tasks}
            orgSlug={orgSlug}
            members={members}
            controls={controls}
            risks={risks}
            capas={capas}
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}
