import { redirect } from "next/navigation"
import { getSession } from "@/lib/get-session"
import prisma from "@/lib/prisma"
import { SettingsForm } from "@/components/onboarding/settings-form"

export default async function SettingsPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      firstName: true,
      lastName: true,
      role: true,
      company: true,
      offerDescription: true,
      idealTarget: true,
      tone: true,
      linkedinUrl: true,
    },
  })

  if (!user) redirect("/login")

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">
          Modifiez votre profil professionnel.
        </p>
      </div>
      <SettingsForm
        initialData={{
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          role: user.role || "",
          company: user.company || "",
          offerDescription: user.offerDescription || "",
          idealTarget: user.idealTarget || "",
          tone: user.tone || "PROFESSIONAL",
          linkedinUrl: user.linkedinUrl || "",
        }}
      />
    </div>
  )
}
