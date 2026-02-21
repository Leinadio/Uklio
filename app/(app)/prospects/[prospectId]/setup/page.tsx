import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/get-session"
import { getProspect } from "@/actions/prospects"
import { ProspectSetupWizard } from "@/components/prospects/prospect-setup-wizard"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { WizardState } from "@/lib/wizard-types"

export default async function ProspectSetupPage({
  params,
}: {
  params: Promise<{ prospectId: string }>
}) {
  const session = await getSession()
  if (!session) redirect("/login")

  const { prospectId } = await params
  const prospect = await getProspect(prospectId)

  if (!prospect) notFound()

  if (prospect.status !== "NEW") {
    redirect(`/prospects/${prospectId}/conversation`)
  }

  const initialState: WizardState = {
    firstName: prospect.firstName,
    lastName: prospect.lastName,
    linkedinUrl: prospect.linkedinUrl,
    currentPosition: prospect.currentPosition,
    currentCompany: prospect.currentCompany,
    profilePhotoUrl: prospect.profilePhotoUrl ?? "",
    headline: prospect.headline ?? "",
    bio: prospect.bio ?? "",
    location: prospect.location ?? "",
    pastExperiences: "",
    education: prospect.education ?? "",
    skills: prospect.skills ?? "",
    languages: prospect.languages ?? "",
    services: prospect.services ?? "",
    recentPosts: "",
    mutualConnections: "",
    connectionCount: prospect.connectionCount?.toString() ?? "",
    objective: prospect.objective ?? "",
    signal: prospect.signal ?? "",
  }

  return (
    <div>
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Retour au tableau de bord
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Configurer le message — {prospect.firstName} {prospect.lastName}
        </h1>
        <p className="text-muted-foreground">
          {prospect.currentPosition} chez {prospect.currentCompany}
        </p>
      </div>

      <ProspectSetupWizard
        prospectId={prospectId}
        initialState={initialState}
      />
    </div>
  )
}
