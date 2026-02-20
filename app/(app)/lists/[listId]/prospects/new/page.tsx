import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/get-session"
import prisma from "@/lib/prisma"
import { ProspectWizard } from "@/components/prospects/prospect-wizard"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function NewProspectPage({
  params,
}: {
  params: Promise<{ listId: string }>
}) {
  const session = await getSession()
  if (!session) redirect("/login")

  const { listId } = await params

  const list = await prisma.prospectList.findUnique({
    where: { id: listId, userId: session.user.id },
    select: { id: true, name: true, defaultObjective: true },
  })

  if (!list) notFound()

  return (
    <div>
      <Link
        href={`/lists/${listId}`}
        className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Retour à {list.name}
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Ajouter un prospect</h1>
      <ProspectWizard
        listId={listId}
        defaultObjective={list.defaultObjective || undefined}
      />
    </div>
  )
}
