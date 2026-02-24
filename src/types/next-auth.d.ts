import type { OrgRole } from "@prisma/client"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      orgId?: string
      orgSlug?: string
      orgRole?: OrgRole
      isSuperAdmin?: boolean
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    isSuperAdmin?: boolean
  }
}
