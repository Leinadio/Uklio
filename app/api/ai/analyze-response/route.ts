import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/get-session"
import prisma from "@/lib/prisma"
import anthropic from "@/lib/ai/client"
import { buildResponseAnalysisPrompt } from "@/lib/ai/prompts/response-analysis"
import { OBJECTIVE_LABELS } from "@/lib/constants"
import type { ProspectStatus } from "@/generated/prisma"

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const body = await request.json()
  const { prospectId, prospectResponse } = body

  // Get full prospect data with conversation
  const prospect = await prisma.prospect.findFirst({
    where: { id: prospectId, campaign: { userId: session.user.id } },
    include: {
      conversation: {
        include: {
          messages: { orderBy: { createdAt: "asc" } },
        },
      },
    },
  })

  if (!prospect || !prospect.conversation) {
    return NextResponse.json({ error: "Prospect non trouvé" }, { status: 404 })
  }

  const objectiveLabel = OBJECTIVE_LABELS[prospect.objective || "CALL"] || ""

  // Get sent/received messages for history
  const sentMessages = prospect.conversation.messages
    .filter((m) => m.status === "SENT" || m.status === "RECEIVED")
    .map((m) => ({
      type: m.type,
      content: m.content,
      status: m.status,
    }))

  const prompt = buildResponseAnalysisPrompt(
    session.user.name,
    {
      firstName: prospect.firstName,
      lastName: prospect.lastName,
      currentPosition: prospect.currentPosition,
      currentCompany: prospect.currentCompany,
      headline: prospect.headline || undefined,
      bio: prospect.bio || undefined,
    },
    objectiveLabel,
    prospect.selectedContext || "",
    prospect.selectedStrategy || "",
    sentMessages,
    prospectResponse
  )

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    })

    const text =
      response.content[0].type === "text" ? response.content[0].text : ""

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: "Analyse impossible" }, { status: 500 })
    }

    const analysis = JSON.parse(jsonMatch[0])

    // Save the prospect's response
    await prisma.message.create({
      data: {
        conversationId: prospect.conversation.id,
        type: "RESPONSE",
        content: prospectResponse,
        status: "RECEIVED",
      },
    })

    // Save the AI-generated reply as draft
    await prisma.message.create({
      data: {
        conversationId: prospect.conversation.id,
        type: "AI_REPLY",
        content: analysis.nextMessage,
        status: "DRAFT",
      },
    })

    // Update prospect status based on analysis
    const statusMap: Record<string, ProspectStatus> = {
      IN_PROGRESS: "IN_PROGRESS",
      CLOSED: "CLOSED",
      GOAL_REACHED: "GOAL_REACHED",
    }
    const newStatus = statusMap[analysis.suggestedStatus]
    if (newStatus) {
      await prisma.prospect.update({
        where: { id: prospectId },
        data: { status: newStatus },
      })
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("AI response analysis error:", error)
    return NextResponse.json(
      { error: "Erreur d'analyse" },
      { status: 500 }
    )
  }
}
