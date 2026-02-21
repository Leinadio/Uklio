import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/get-session"
import { getProspect } from "@/actions/prospects"
import { ConversationLayout } from "@/components/conversation/conversation-layout"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ prospectId: string }>
}) {
  const session = await getSession()
  if (!session) redirect("/login")

  const { prospectId } = await params
  const prospect = await getProspect(prospectId)

  if (!prospect) notFound()

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Retour
        </Link>
        <h1 className="text-lg font-bold">
          {prospect.firstName} {prospect.lastName}
        </h1>
        <span className="text-sm text-muted-foreground">
          {prospect.currentPosition} chez {prospect.currentCompany}
        </span>
      </div>

      <ConversationLayout prospect={prospect} />
    </div>
  )
}
