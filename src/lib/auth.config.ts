import type { NextAuthConfig } from "next-auth"

// Edge-compatible config: no Prisma, no bcryptjs
export const authConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: "/login",
    error: "/login",
  },
}
