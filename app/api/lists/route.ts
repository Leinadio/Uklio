import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { withCors, corsPreflightResponse } from "@/lib/cors"

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request)
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return withCors(
      request,
      NextResponse.json(
        { error: "Non autorisé. Connectez-vous à Uklio." },
        { status: 401 }
      )
    )
  }

  const lists = await prisma.prospectList.findMany({
    where: { userId: session.user.id },
    include: {
      _count: { select: { prospects: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return withCors(request, NextResponse.json(lists))
}
