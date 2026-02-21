import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/get-session"
import prisma from "@/lib/prisma"
import anthropic from "@/lib/ai/client"
import { buildSequenceGenerationPrompt } from "@/lib/ai/prompts/sequence-generation"
import type { ProspectData } from "@/lib/ai/types"

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const body = await request.json()
  const { prospectId } = body

  if (!prospectId) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 })
  }

  const prospect = await prisma.prospect.findFirst({
    where: { id: prospectId, userId: session.user.id },
  })

  if (!prospect) {
    return NextResponse.json({ error: "Prospect non trouvé" }, { status: 404 })
  }

  const objective = body.objective || prospect.objective
  const signal = body.signal || prospect.signal || ""

  if (!objective) {
    return NextResponse.json({ error: "Objectif manquant" }, { status: 400 })
  }

  const fullProspect: ProspectData = {
    firstName: prospect.firstName,
    lastName: prospect.lastName,
    currentPosition: prospect.currentPosition,
    currentCompany: prospect.currentCompany,
    headline: prospect.headline || undefined,
    bio: prospect.bio || undefined,
    location: prospect.location || undefined,
    pastExperiences: (prospect.pastExperiences as ProspectData["pastExperiences"]) || undefined,
    education: prospect.education || undefined,
    skills: prospect.skills || undefined,
    languages: prospect.languages || undefined,
    services: prospect.services || undefined,
    recentPosts: (prospect.recentPosts as ProspectData["recentPosts"]) || undefined,
    mutualConnections: (prospect.mutualConnections as ProspectData["mutualConnections"]) || undefined,
    connectionCount: prospect.connectionCount || undefined,
  }

  const prompt = buildSequenceGenerationPrompt(
    session.user.name,
    fullProspect,
    objective,
    signal
  )

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    })

    const text =
      response.content[0].type === "text" ? response.content[0].text : ""

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ messages: [] })
    }

    const data = JSON.parse(jsonMatch[0])

    // Save only the INITIAL message and create conversation
    if (data.messages?.length > 0) {
      const initialMessage = data.messages.find(
        (m: { type: string }) => m.type === "INITIAL"
      )
      if (!initialMessage) {
        return NextResponse.json({ messages: [] })
      }

      let conversation = await prisma.conversation.findUnique({
        where: { prospectId },
      })

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: { prospectId },
        })
      }

      // Delete any existing draft messages before saving new one
      await prisma.message.deleteMany({
        where: { conversationId: conversation.id, status: "DRAFT" },
      })

      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          type: "INITIAL",
          content: initialMessage.content,
          suggestedDelay: initialMessage.suggestedDelay,
          status: "DRAFT",
        },
      })

      await prisma.prospect.update({
        where: { id: prospectId },
        data: {
          status: "MESSAGE_READY",
          aiApproachAngle: data.approachAngle || null,
        },
      })
    }

    return NextResponse.json({ messages: data.messages?.slice(0, 1) || [] })
  } catch (error) {
    console.error("AI sequence generation error:", error)
    return NextResponse.json({ messages: [] })
  }
}
