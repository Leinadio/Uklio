import { getCampaigns } from "@/actions/campaigns"
import { CampaignCard } from "@/components/campaigns/campaign-card"
import { CreateCampaignDialog } from "@/components/campaigns/create-campaign-dialog"

export default async function CampaignsPage() {
  const campaigns = await getCampaigns()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campagnes</h1>
          <p className="text-muted-foreground">
            Organisez vos prospects par thématique ou objectif commercial.
          </p>
        </div>
        <CreateCampaignDialog />
      </div>

      {campaigns.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <h3 className="text-lg font-medium">Aucune campagne</h3>
          <p className="mt-1 text-muted-foreground">
            Créez votre première campagne pour commencer à ajouter des prospects.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              id={campaign.id}
              name={campaign.name}
              description={campaign.description}
              defaultObjective={campaign.defaultObjective}
              prospectCount={campaign._count.prospects}
            />
          ))}
        </div>
      )}
    </div>
  )
}
