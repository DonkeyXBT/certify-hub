"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { updateSlackSettings } from "@/lib/actions/organization"
import { Badge } from "@/components/ui/badge"

interface SlackNotifications {
  taskCreated: boolean
  taskStatusChanged: boolean
  assessmentControlSaved: boolean
  assessmentCompleted: boolean
}

interface SlackFormProps {
  orgId: string
  orgSlug: string
  webhookUrl: string | null
  notifications: SlackNotifications
}

const SlackLogo = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
  </svg>
)

export function SlackForm({
  orgId,
  orgSlug,
  webhookUrl,
  notifications,
}: SlackFormProps) {
  const [isPending, startTransition] = useTransition()
  const [url, setUrl] = useState(webhookUrl ?? "")

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const result = (await updateSlackSettings(formData)) as {
        error?: string
        success?: boolean
      }
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Slack settings saved")
      }
    })
  }

  const isConnected = !!webhookUrl

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <SlackLogo />
          Slack Integration
          {isConnected && (
            <Badge variant="secondary" className="ml-1 text-xs font-normal text-green-700 bg-green-100 border-green-200">
              Connected
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Send notifications to a Slack channel when tasks change or controls
          are updated in assessments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="space-y-6">
          <input type="hidden" name="orgId" value={orgId} />
          <input type="hidden" name="orgSlug" value={orgSlug} />

          <div className="space-y-2">
            <Label htmlFor="slackWebhookUrl">Incoming Webhook URL</Label>
            <Input
              id="slackWebhookUrl"
              name="slackWebhookUrl"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://hooks.slack.com/services/T.../B.../..."
              type="url"
            />
            <p className="text-xs text-muted-foreground">
              Create an Incoming Webhook in your Slack workspace at{" "}
              <a
                href="https://api.slack.com/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                api.slack.com/apps
              </a>
              . Go to your app → Incoming Webhooks → Add New Webhook to Workspace.
            </p>
          </div>

          <Separator />

          <div className="space-y-1">
            <p className="text-sm font-medium">Notification Events</p>
            <p className="text-xs text-muted-foreground mb-4">
              Choose which events trigger a Slack message.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium">Task created</p>
                  <p className="text-xs text-muted-foreground">
                    When a new task is created in the organization
                  </p>
                </div>
                <Switch
                  name="notif_taskCreated"
                  defaultChecked={notifications.taskCreated}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium">Task status changed</p>
                  <p className="text-xs text-muted-foreground">
                    When a task is moved between columns or completed
                  </p>
                </div>
                <Switch
                  name="notif_taskStatusChanged"
                  defaultChecked={notifications.taskStatusChanged}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium">Control response saved</p>
                  <p className="text-xs text-muted-foreground">
                    When a compliance status is filled in for a control in an
                    assessment
                  </p>
                </div>
                <Switch
                  name="notif_assessmentControlSaved"
                  defaultChecked={notifications.assessmentControlSaved}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium">Assessment completed</p>
                  <p className="text-xs text-muted-foreground">
                    When an assessment is marked as completed with its final
                    score
                  </p>
                </div>
                <Switch
                  name="notif_assessmentCompleted"
                  defaultChecked={notifications.assessmentCompleted}
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Slack Settings"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
