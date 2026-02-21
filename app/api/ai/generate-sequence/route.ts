import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/get-session"
import prisma from "@/lib/prisma"
import anthropic from "@/lib/ai/client"
import { buildSequenceGenerationPrompt } from "@/lib/ai/prompts/sequence-generation"

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
  } = body

  const prompt = buildSequenceGenerationPrompt(
    session.user.name,
    prospect,
    objective,
    context,
    contextDetail || ""
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
    if (prospectId && data.messages?.length > 0) {
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
        data: { status: "SEQUENCE_READY" },
      })
    }

    return NextResponse.json({ messages: data.messages?.slice(0, 1) || [] })
  } catch (error) {
    console.error("AI sequence generation error:", error)
    return NextResponse.json({ messages: [] })
  }
}
