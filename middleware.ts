import { NextRequest, NextResponse } from "next/server"

const publicPaths = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/api/prospects/from-extension")) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/api/campaigns")) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get("better-auth.session_token")
  const isAuthenticated = !!sessionCookie?.value
  const isPublicPath = publicPaths.some((p) => pathname.startsWith(p))

  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)"],
}
