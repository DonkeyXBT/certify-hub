"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { OrgRole } from "@prisma/client"
import { LogOut, ShieldCheck } from "lucide-react"
import { getNavItems } from "@/config/nav"
import { OrgSwitcher } from "@/components/layout/org-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"

interface OrgInfo {
  id: string
  name: string
  slug: string
  logo: string | null
}

interface UserOrgInfo {
  id: string
  name: string
  slug: string
  logo: string | null
  role: OrgRole
}

interface UserInfo {
  name?: string
  email?: string
  image?: string
}

interface AppSidebarProps {
  org: OrgInfo
  userOrgs: UserOrgInfo[]
  userRole: OrgRole
  user: UserInfo
  isSuperAdmin?: boolean
}

const ROLE_HIERARCHY: Record<OrgRole, number> = {
  ADMIN: 0,
  MANAGER: 1,
  AUDITOR: 2,
  VIEWER: 3,
}

function hasMinRole(userRole: OrgRole, minRole?: OrgRole | string): boolean {
  if (!minRole) return true
  return ROLE_HIERARCHY[userRole] <= ROLE_HIERARCHY[minRole as OrgRole]
}

function getInitials(name?: string): string {
  if (!name) return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function AppSidebar({ org, userOrgs, userRole, user, isSuperAdmin }: AppSidebarProps) {
  const pathname = usePathname()
  const navGroups = getNavItems(org.slug)

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <OrgSwitcher currentOrg={org} userOrgs={userOrgs} isSuperAdmin={isSuperAdmin} />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) =>
            hasMinRole(userRole, item.minRole)
          )
          if (visibleItems.length === 0) return null

          return (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleItems.map((item) => {
                    const isActive =
                      item.href === `/org/${org.slug}`
                        ? pathname === `/org/${org.slug}`
                        : pathname.startsWith(item.href)

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={item.title}
                        >
                          <Link href={item.href}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar size="sm">
                    <AvatarImage src={user.image} alt={user.name ?? "User"} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name ?? "User"}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name ?? "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                {isSuperAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2">
                        <ShieldCheck />
                        <span>Admin panel</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <LogOut />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
