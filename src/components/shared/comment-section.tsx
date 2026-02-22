"use client"

import * as React from "react"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Reply, Send } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { EntityType } from "@/types"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CommentUser {
  id: string
  name: string | null
  image: string | null
}

export interface Comment {
  id: string
  content: string
  createdAt: Date | string
  user: CommentUser
  parentId: string | null
  children?: Comment[]
}

interface CommentSectionProps {
  entityType: EntityType
  entityId: string
  comments: Comment[]
  currentUserId?: string
  onAddComment?: (content: string, parentId?: string) => void | Promise<void>
  loading?: boolean
  className?: string
}

// ─── Comment Form ───────────────────────────────────────────────────────────

interface CommentFormProps {
  onSubmit: (content: string) => void | Promise<void>
  placeholder?: string
  submitLabel?: string
  loading?: boolean
  autoFocus?: boolean
  onCancel?: () => void
}

function CommentForm({
  onSubmit,
  placeholder = "Write a comment...",
  submitLabel = "Comment",
  loading = false,
  autoFocus = false,
  onCancel,
}: CommentFormProps) {
  const [content, setContent] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed) return
    await onSubmit(trimmed)
    setContent("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="min-h-20 resize-none"
      />
      <div className="flex items-center gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm" disabled={!content.trim() || loading}>
          <Send className="h-3.5 w-3.5" />
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

// ─── Single Comment ─────────────────────────────────────────────────────────

interface CommentItemProps {
  comment: Comment
  onReply?: (content: string, parentId: string) => void | Promise<void>
  loading?: boolean
  depth?: number
}

function CommentItem({ comment, onReply, loading = false, depth = 0 }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = React.useState(false)
  const createdAt =
    typeof comment.createdAt === "string" ? new Date(comment.createdAt) : comment.createdAt

  const initials = comment.user.name
    ? comment.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?"

  const handleReply = async (content: string) => {
    if (onReply) {
      await onReply(content, comment.id)
    }
    setShowReplyForm(false)
  }

  return (
    <div className={cn("space-y-3", depth > 0 && "ml-8 border-l-2 border-muted pl-4")}>
      <div className="flex gap-3">
        <Avatar size="sm" className="mt-0.5">
          <AvatarImage src={comment.user.image ?? undefined} alt={comment.user.name ?? "User"} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{comment.user.name ?? "Unknown User"}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(createdAt, { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-foreground whitespace-pre-wrap">{comment.content}</p>
          {onReply && (
            <Button
              variant="ghost"
              size="xs"
              className="text-muted-foreground hover:text-foreground -ml-2"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <Reply className="h-3 w-3" />
              Reply
            </Button>
          )}
        </div>
      </div>

      {showReplyForm && (
        <div className="ml-8">
          <CommentForm
            onSubmit={handleReply}
            placeholder={`Reply to ${comment.user.name ?? "user"}...`}
            submitLabel="Reply"
            loading={loading}
            autoFocus
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {/* Threaded replies */}
      {comment.children && comment.children.length > 0 && (
        <div className="space-y-3">
          {comment.children.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              onReply={onReply}
              loading={loading}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Comment Section ────────────────────────────────────────────────────────

export function CommentSection({
  entityType,
  entityId,
  comments,
  currentUserId,
  onAddComment,
  loading = false,
  className,
}: CommentSectionProps) {
  // Build threaded structure: top-level comments with nested children
  const topLevelComments = comments.filter((c) => !c.parentId)

  const handleAddComment = async (content: string) => {
    if (onAddComment) {
      await onAddComment(content)
    }
  }

  const handleReply = async (content: string, parentId: string) => {
    if (onAddComment) {
      await onAddComment(content, parentId)
    }
  }

  return (
    <div className={cn("space-y-6", className)} data-entity-type={entityType} data-entity-id={entityId}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      {currentUserId && onAddComment && (
        <CommentForm onSubmit={handleAddComment} loading={loading} />
      )}

      {/* Comments List */}
      {topLevelComments.length > 0 ? (
        <div className="space-y-4">
          {topLevelComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={currentUserId && onAddComment ? handleReply : undefined}
              loading={loading}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-6">
          No comments yet. Be the first to comment.
        </p>
      )}
    </div>
  )
}
