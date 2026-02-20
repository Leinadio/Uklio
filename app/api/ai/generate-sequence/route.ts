import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/get-session"
import prisma from "@/lib/prisma"
import anthropic from "@/lib/ai/client"
import { buildSequenceGenerationPrompt } from "@/lib/ai/prompts/sequence-generation"
import { OBJECTIVE_LABELS } from "@/lib/constants"

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const body = await request.json()
  const {
    prospectId,
    prospect,
    objective,
    context,
    contextDetail,
    strategy,
    strategyDetail,
  } = body

  const objectiveLabel = OBJECTIVE_LABELS[objective] || objective

  const prompt = buildSequenceGenerationPrompt(
    session.user.name,
    prospect,
    objectiveLabel,
    context,
    contextDetail || "",
    strategy,
    strategyDetail || ""
  )

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    })

    const text =
      response.content[0].type === "text" ? response.content[0].text : ""

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ messages: [] })
    }

    const data = JSON.parse(jsonMatch[0])

    // Save messages to the database and create conversation
    if (prospectId && data.messages?.length > 0) {
      // Create conversation if it doesn't exist
      let conversation = await prisma.conversation.findUnique({
        where: { prospectId },
      })

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            prospectId,
            currentStep: 1,
          },
        })
      }

      // Create messages
      for (const msg of data.messages) {
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            type: msg.type,
            content: msg.content,
            suggestedDelay: msg.suggestedDelay,
            status: "DRAFT",
          },
        })
      }

      // Update prospect status
      await prisma.prospect.update({
        where: { id: prospectId },
        data: { status: "SEQUENCE_READY" },
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("AI sequence generation error:", error)
    return NextResponse.json({ messages: [] })
  }
}
