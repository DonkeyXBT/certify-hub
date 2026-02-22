import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { authConfig } from "@/lib/auth.config"
import { db } from "@/lib/db"
import type { OrgRole } from "@prisma/client"

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string

        // Fetch active membership to populate org context
        const membership = await db.membership.findFirst({
          where: {
            userId: token.id as string,
            isActive: true,
          },
          include: {
            org: {
              select: {
                id: true,
                slug: true,
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        })

        if (membership) {
          session.user.orgId = membership.org.id
          session.user.orgSlug = membership.org.slug
          session.user.orgRole = membership.role as OrgRole
        }
      }
      return session
    },
  },
})
