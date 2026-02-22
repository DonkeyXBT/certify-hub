"use client"

import { useState, useEffect, useTransition } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { markAsRead, markAllRead } from "@/lib/actions/notifications"
import { formatDistanceToNow } from "date-fns"

interface Notification {
  id: string
  title: string
  message: string | null
  type: string
  isRead: boolean
  actionUrl: string | null
  createdAt: Date
}

interface NotificationBellProps {
  notifications: Notification[]
  unreadCount: number
  orgId: string
}

export function NotificationBell({ notifications: initial, unreadCount: initialCount, orgId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState(initial)
  const [unreadCount, setUnreadCount] = useState(initialCount)
  const [isPending, startTransition] = useTransition()

  function handleRead(id: string) {
    startTransition(async () => {
      await markAsRead(id)
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
      setUnreadCount((c) => Math.max(0, c - 1))
    })
  }

  function handleReadAll() {
    startTransition(async () => {
      await markAllRead(orgId)
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3">
          <h4 className="text-sm font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs" onClick={handleReadAll} disabled={isPending}>
              Mark all read
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">No notifications</p>
          ) : (
            <div className="divide-y">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${!n.isRead ? "bg-muted/30" : ""}`}
                  onClick={() => !n.isRead && handleRead(n.id)}
                >
                  <div className="flex items-start gap-2">
                    {!n.isRead && <span className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                    <div className={!n.isRead ? "" : "ml-4"}>
                      <p className="text-sm font-medium leading-tight">{n.title}</p>
                      {n.message && <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
