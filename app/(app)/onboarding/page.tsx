import { redirect } from "next/navigation"
import { getSession } from "@/lib/get-session"
import prisma from "@/lib/prisma"
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"

export default async function OnboardingPage() {
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
      onboardingCompleted: true,
    },
  })

  if (user?.onboardingCompleted) {
    redirect("/dashboard")
  }

  return (
    <OnboardingWizard
      initialData={{
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        role: user?.role || "",
        company: user?.company || "",
        offerDescription: user?.offerDescription || "",
        idealTarget: user?.idealTarget || "",
        tone: user?.tone || "PROFESSIONAL",
        linkedinUrl: user?.linkedinUrl || "",
      }}
    />
  )
}
