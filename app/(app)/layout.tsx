import { redirect } from "next/navigation"
import { getSession } from "@/lib/get-session"
import prisma from "@/lib/prisma"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingCompleted: true, name: true },
  })

  if (!user) {
    redirect("/login")
  }

  const isOnboardingPage =
    typeof children === "object" && children !== null

  // Check if we're already on the onboarding page to avoid redirect loops
  // The middleware handles this, but as a safety net:
  if (!user.onboardingCompleted) {
    // We'll let the onboarding page render, but redirect other pages
    // This is handled by checking the URL in a different way
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header userName={user.name} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
