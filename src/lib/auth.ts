import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { authConfig } from "@/lib/auth.config"
import { db } from "@/lib/db"
import type { OrgRole } from "@prisma/client"

const SESSION_MAX_AGE = 30 * 24 * 60 * 60 // 30 days in seconds
const isProduction = process.env.NODE_ENV === "production"

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
  },
  jwt: {
    maxAge: SESSION_MAX_AGE,
  },
  cookies: {
    sessionToken: {
      name: isProduction
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
        maxAge: SESSION_MAX_AGE,
      },
    },
    callbackUrl: {
      name: isProduction
        ? "__Secure-authjs.callback-url"
        : "authjs.callback-url",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
      },
    },
    csrfToken: {
      name: isProduction
        ? "__Host-authjs.csrf-token"
        : "authjs.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
      },
    },
  },
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string
        const password = credentials.password as string

        const user = await db.user.findUnique({ where: { email } })

        if (!user || !user.hashedPassword) return null

        // Block unverified users from logging in
        if (!user.emailVerified) return null

        const isPasswordValid = await compare(password, user.hashedPassword)
        if (!isPasswordValid) return null

        return { id: user.id, name: user.name, email: user.email, image: user.image, isSuperAdmin: user.isSuperAdmin }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.isSuperAdmin = (user as Record<string, unknown>).isSuperAdmin as boolean
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.isSuperAdmin = (token.isSuperAdmin as boolean) ?? false

        const membership = await db.membership.findFirst({
          where: { userId: token.id as string, isActive: true },
          include: { org: { select: { id: true, slug: true } } },
          orderBy: { updatedAt: "desc" },
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
