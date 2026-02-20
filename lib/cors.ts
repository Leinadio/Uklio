import { NextRequest, NextResponse } from "next/server"

const ALLOWED_ORIGIN_PATTERNS = [
  /^chrome-extension:\/\/.+$/,
  /^http:\/\/localhost:3000$/,
]

function getAllowedOrigin(request: NextRequest): string | null {
  const origin = request.headers.get("origin")
  if (!origin) return null
  return ALLOWED_ORIGIN_PATTERNS.some((p) => p.test(origin)) ? origin : null
}

export function withCors(request: NextRequest, response: NextResponse) {
  const origin = getAllowedOrigin(request)
  if (origin) {
    response.headers.set("Access-Control-Allow-Origin", origin)
    response.headers.set("Access-Control-Allow-Credentials", "true")
  }
  return response
}

export function corsPreflightResponse(request: NextRequest) {
  const origin = getAllowedOrigin(request)
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...(origin && {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true",
      }),
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  })
}
