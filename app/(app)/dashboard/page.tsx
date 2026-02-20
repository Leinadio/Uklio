import { redirect } from "next/navigation"
import { getSession } from "@/lib/get-session"
import prisma from "@/lib/prisma"
import { KpiGrid } from "@/components/dashboard/kpi-grid"
import { ConversationsTable } from "@/components/dashboard/conversations-table"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  // Check onboarding
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingCompleted: true, firstName: true },
  })

  if (!user?.onboardingCompleted) {
    redirect("/onboarding")
  }

  // Get all prospects with conversations
  const prospects = await prisma.prospect.findMany({
    where: { list: { userId: session.user.id } },
    include: {
      list: { select: { name: true } },
      conversation: {
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  // Compute KPIs
  const activeProspects = prospects.filter(
    (p) => p.status === "IN_PROGRESS" || p.status === "WAITING"
  ).length

  const prospectsWithSentMessages = prospects.filter(
    (p) =>
      p.conversation?.messages.some((m) => m.status === "SENT") ||
      p.status !== "NEW"
  )

  const prospectsWithResponses = prospects.filter((p) =>
    p.conversation?.messages.some((m) => m.type === "RESPONSE")
  )

  const responseRate =
    prospectsWithSentMessages.length > 0
      ? Math.round(
          (prospectsWithResponses.length / prospectsWithSentMessages.length) *
            100
        )
      : 0

  const goalsReached = prospects.filter(
    (p) => p.status === "GOAL_REACHED"
  ).length

  const conversionRate =
    prospectsWithSentMessages.length > 0
      ? Math.round(
          (goalsReached / prospectsWithSentMessages.length) * 100
        )
      : 0

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Bonjour {user.firstName || ""}
        </h1>
        <p className="text-muted-foreground">
          Vue d&apos;ensemble de votre prospection.
        </p>
      </div>

      <KpiGrid
        activeProspects={activeProspects}
        responseRate={responseRate}
        goalsReached={goalsReached}
        conversionRate={conversionRate}
      />

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Conversations</h2>
        <ConversationsTable prospects={prospects} />
      </div>
    </div>
  )
}
