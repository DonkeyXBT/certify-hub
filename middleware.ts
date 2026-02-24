import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isAuthPage = nextUrl.pathname.startsWith("/login")
  const isVerifyPage = nextUrl.pathname.startsWith("/verify")
  const isApiRoute = nextUrl.pathname.startsWith("/api")
  const isPublicPage = nextUrl.pathname === "/"

  if (isApiRoute) return NextResponse.next()

  // Verification pages are always accessible (no redirect for logged-in users)
  if (isVerifyPage) return NextResponse.next()

  if (isAuthPage) {
    if (isLoggedIn) return NextResponse.redirect(new URL("/onboarding", nextUrl))
    return NextResponse.next()
  }

  if (!isLoggedIn && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}
