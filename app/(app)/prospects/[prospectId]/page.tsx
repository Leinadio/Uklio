import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/get-session"
import { getProspect } from "@/actions/prospects"
import { ProspectProfilePanel } from "@/components/prospects/prospect-profile-panel"
import { StatusBadge } from "@/components/prospects/status-badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { OBJECTIVE_LABELS } from "@/lib/constants"
import { ArrowLeft, Play, MessageSquare } from "lucide-react"

export default async function ProspectProfilePage({
  params,
}: {
  params: Promise<{ prospectId: string }>
}) {
  const session = await getSession()
  if (!session) redirect("/login")

  const { prospectId } = await params
  const prospect = await getProspect(prospectId)

  if (!prospect) notFound()

  const ctaHref =
    prospect.status === "NEW"
      ? `/prospects/${prospectId}/setup`
      : `/prospects/${prospectId}/conversation`

  const ctaLabel =
    prospect.status === "NEW" ? "Configurer le message" : "Voir la conversation"

  const CtaIcon = prospect.status === "NEW" ? Play : MessageSquare

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Retour au tableau de bord
        </Link>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusBadge status={prospect.status} />
          {prospect.objective && (
            <span className="text-sm text-muted-foreground">
              Objectif : {OBJECTIVE_LABELS[prospect.objective] || prospect.objective}
            </span>
          )}
        </div>
        <Button asChild>
          <Link href={ctaHref}>
            <CtaIcon className="mr-2 h-4 w-4" />
            {ctaLabel}
          </Link>
        </Button>
      </div>

      <ProspectProfilePanel prospect={prospect} />
    </div>
  )
}
