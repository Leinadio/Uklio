import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { extensionProspectSchema } from "@/lib/validations"
import { withCors, corsPreflightResponse } from "@/lib/cors"

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request)
}

// POST /api/prospects/from-extension
// Accepts prospect data from the Chrome extension
// Auth: Bearer token from Better-Auth session
export async function POST(request: NextRequest) {
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

  const body = await request.json()
  const result = extensionProspectSchema.safeParse(body)

  if (!result.success) {
    return withCors(
      request,
      NextResponse.json(
        { error: "Données invalides", details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    )
  }

  const data = result.data

  // Compute profile completeness
  const optionalFields = [
    "profilePhotoUrl",
    "headline",
    "bio",
    "location",
    "pastExperiences",
    "education",
    "skills",
    "languages",
    "services",
    "recentPosts",
    "mutualConnections",
    "connectionCount",
  ] as const
  const filled = optionalFields.filter((f) => {
    const val = data[f]
    if (val == null || val === "") return false
    if (Array.isArray(val)) return val.length > 0
    return true
  }).length
  const profileCompleteness = Math.round(
    (filled / optionalFields.length) * 100
  )

  const prospect = await prisma.prospect.create({
    data: {
      ...data,
      profilePhotoUrl: data.profilePhotoUrl || null,
      headline: data.headline || null,
      bio: data.bio || null,
      location: data.location || null,
      pastExperiences:
        data.pastExperiences && data.pastExperiences.length > 0
          ? data.pastExperiences
          : undefined,
      education: data.education || null,
      skills: data.skills || null,
      languages: data.languages || null,
      services: data.services || null,
      recentPosts:
        data.recentPosts && data.recentPosts.length > 0
          ? data.recentPosts
          : undefined,
      mutualConnections:
        data.mutualConnections && data.mutualConnections.length > 0
          ? data.mutualConnections
          : undefined,
      connectionCount: data.connectionCount || null,
      profileCompleteness,
      userId: session.user.id,
    },
  })

  return withCors(
    request,
    NextResponse.json({ success: true, prospect }, { status: 201 })
  )
}
