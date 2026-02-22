import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/get-session"
import { getCampaign } from "@/actions/campaigns"
import { CampaignDetail } from "@/components/campaigns/campaign-detail"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ campaignId: string }>
}) {
  const session = await getSession()
  if (!session) redirect("/login")

  const { campaignId } = await params
  const campaign = await getCampaign(campaignId)

  if (!campaign) notFound()

  return (
    <div>
      <Link
        href="/campaigns"
        className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Retour aux campagnes
      </Link>

      <CampaignDetail campaign={campaign} />
    </div>
  )
}
