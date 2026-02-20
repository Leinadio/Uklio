import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/get-session"
import anthropic from "@/lib/ai/client"
import { buildStrategySuggestionPrompt } from "@/lib/ai/prompts/strategy-suggestion"
import { OBJECTIVE_LABELS } from "@/lib/constants"

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const body = await request.json()
  const { prospect, objective, context, contextDetail } = body

  const objectiveLabel = OBJECTIVE_LABELS[objective] || objective
  const prompt = buildStrategySuggestionPrompt(
    prospect,
    objectiveLabel,
    context,
    contextDetail || ""
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
      return NextResponse.json({ strategies: [] })
    }

    const data = JSON.parse(jsonMatch[0])
    return NextResponse.json(data)
  } catch (error) {
    console.error("AI strategy suggestion error:", error)
    return NextResponse.json({ strategies: [] })
  }
}
