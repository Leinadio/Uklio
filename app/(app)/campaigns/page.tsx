import { redirect } from "next/navigation"
import { getSession } from "@/lib/get-session"
import { getCampaigns } from "@/actions/campaigns"
import { CampaignsList } from "@/components/campaigns/campaigns-list"

export default async function CampaignsPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const campaigns = await getCampaigns()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Campagnes</h1>
        <p className="text-muted-foreground">
          Organisez vos prospects par offre.
        </p>
      </div>

      <CampaignsList campaigns={campaigns} />
    </div>
  )
}
