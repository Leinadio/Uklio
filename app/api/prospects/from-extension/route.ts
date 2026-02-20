import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { extensionProspectSchema } from "@/lib/validations"
import { withCors, corsPreflightResponse } from "@/lib/cors"

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request)
}

// POST /api/prospects/from-extension
// Accepts prospect data from the Chrome extension (V2)
// Auth: Bearer token from Better-Auth session
export async function POST(request: NextRequest) {
  // Authenticate via session cookie or Bearer token
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

  // Verify the campaign belongs to the user
  const campaign = await prisma.campaign.findUnique({
    where: { id: data.campaignId, userId: session.user.id },
  })

  if (!campaign) {
    return withCors(
      request,
      NextResponse.json(
        { error: "Campagne introuvable ou non autorisée" },
        { status: 404 }
      )
    )
  }

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

  const { campaignId, objective, ...prospectData } = data

  const prospect = await prisma.prospect.create({
    data: {
      ...prospectData,
      profilePhotoUrl: prospectData.profilePhotoUrl || null,
      headline: prospectData.headline || null,
      bio: prospectData.bio || null,
      location: prospectData.location || null,
      pastExperiences:
        prospectData.pastExperiences && prospectData.pastExperiences.length > 0
          ? prospectData.pastExperiences
          : undefined,
      education: prospectData.education || null,
      skills: prospectData.skills || null,
      languages: prospectData.languages || null,
      services: prospectData.services || null,
      recentPosts:
        prospectData.recentPosts && prospectData.recentPosts.length > 0
          ? prospectData.recentPosts
          : undefined,
      mutualConnections: prospectData.mutualConnections || null,
      connectionCount: prospectData.connectionCount || null,
      objective: objective as "CALL" | "MEETING" | "SELL" | "TESTIMONIAL" | undefined,
      profileCompleteness,
      campaignId,
    },
  })

  return withCors(
    request,
    NextResponse.json({ success: true, prospect }, { status: 201 })
  )
}
