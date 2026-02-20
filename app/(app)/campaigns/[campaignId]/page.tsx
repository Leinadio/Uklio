import { notFound } from "next/navigation"
import Link from "next/link"
import { getCampaignWithProspects } from "@/actions/campaigns"
import { ProspectTable } from "@/components/campaigns/prospect-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OBJECTIVE_LABELS } from "@/lib/constants"
import { ArrowLeft, UserPlus } from "lucide-react"

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ campaignId: string }>
}) {
  const { campaignId } = await params
  const campaign = await getCampaignWithProspects(campaignId)

  if (!campaign) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/campaigns"
          className="mb-2 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Retour aux campagnes
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{campaign.name}</h1>
            {campaign.description && (
              <p className="text-muted-foreground">{campaign.description}</p>
            )}
            <Badge variant="outline" className="mt-1">
              Objectif : {OBJECTIVE_LABELS[campaign.defaultObjective]}
            </Badge>
          </div>
          <Button asChild>
            <Link href={`/campaigns/${campaignId}/prospects/new`}>
              <UserPlus className="mr-2 h-4 w-4" />
              Ajouter un prospect
            </Link>
          </Button>
        </div>
      </div>

      <ProspectTable prospects={campaign.prospects} />
    </div>
  )
}
