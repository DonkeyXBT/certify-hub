"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Bell } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"

interface AppHeaderProps {
  orgSlug: string
}

function generateBreadcrumbs(pathname: string, orgSlug: string) {
  const segments = pathname.split("/").filter(Boolean)

  // Remove "org" and the slug from breadcrumb display
  const orgIndex = segments.indexOf("org")
  const displaySegments = orgIndex !== -1 ? segments.slice(orgIndex + 2) : segments

  const crumbs: { label: string; href?: string }[] = [
    { label: "Dashboard", href: `/org/${orgSlug}` },
  ]

  let currentPath = `/org/${orgSlug}`
  for (let i = 0; i < displaySegments.length; i++) {
    const segment = displaySegments[i]
    currentPath += `/${segment}`

    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())

    const isLast = i === displaySegments.length - 1
    crumbs.push({
      label,
      href: isLast ? undefined : currentPath,
    })
  }

  return crumbs
}

export function AppHeader({ orgSlug }: AppHeaderProps) {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname, orgSlug)

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1
            return (
              <BreadcrumbItem key={crumb.label + index}>
                {index > 0 && <BreadcrumbSeparator />}
                {isLast || !crumb.href ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  )
}
