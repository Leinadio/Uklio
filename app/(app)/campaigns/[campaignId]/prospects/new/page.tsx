import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/get-session"
import prisma from "@/lib/prisma"
import { ProspectWizard } from "@/components/prospects/prospect-wizard"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function NewProspectPage({
  params,
}: {
  params: Promise<{ campaignId: string }>
}) {
  const session = await getSession()
  if (!session) redirect("/login")

  const { campaignId } = await params

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId, userId: session.user.id },
    select: { id: true, name: true, defaultObjective: true },
  })

  if (!campaign) notFound()

  return (
    <div>
      <Link
        href={`/campaigns/${campaignId}`}
        className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Retour à {campaign.name}
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Ajouter un prospect</h1>
      <ProspectWizard
        campaignId={campaignId}
        defaultObjective={campaign.defaultObjective}
      />
    </div>
  )
}
