import { handlers } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

const appOrigin = (process.env.AUTH_URL || process.env.NEXTAUTH_URL || "").replace(/\/$/, "")

function withCorsRestriction(response: Response, origin: string | null): Response {
  const headers = new Headers(response.headers)

  if (origin && appOrigin && origin === appOrigin) {
    // Same-app cross-origin request (e.g. preview environments) — allow
    headers.set("Access-Control-Allow-Origin", origin)
    headers.set("Vary", "Origin")
  } else {
    // All other origins: remove any wildcard CORS header NextAuth may have added
    headers.delete("Access-Control-Allow-Origin")
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

export async function GET(req: NextRequest) {
  const res = await handlers.GET(req)
  return withCorsRestriction(res, req.headers.get("origin"))
}

export async function POST(req: NextRequest) {
  const res = await handlers.POST(req)
  return withCorsRestriction(res, req.headers.get("origin"))
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": appOrigin,
      "Access-Control-Allow-Methods": "GET, POST",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  })
}
