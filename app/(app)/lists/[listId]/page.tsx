import { notFound } from "next/navigation"
import Link from "next/link"
import { getListWithProspects } from "@/actions/lists"
import { ProspectTable } from "@/components/lists/prospect-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OBJECTIVE_LABELS } from "@/lib/constants"
import { ArrowLeft, UserPlus } from "lucide-react"

export default async function ListDetailPage({
  params,
}: {
  params: Promise<{ listId: string }>
}) {
  const { listId } = await params
  const list = await getListWithProspects(listId)

  if (!list) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/lists"
          className="mb-2 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Retour aux listes
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{list.name}</h1>
            {list.description && (
              <p className="text-muted-foreground">{list.description}</p>
            )}
            {list.defaultObjective && (
              <Badge variant="outline" className="mt-1">
                Objectif par défaut :{" "}
                {OBJECTIVE_LABELS[list.defaultObjective]}
              </Badge>
            )}
          </div>
          <Button asChild>
            <Link href={`/lists/${listId}/prospects/new`}>
              <UserPlus className="mr-2 h-4 w-4" />
              Ajouter un prospect
            </Link>
          </Button>
        </div>
      </div>

      <ProspectTable prospects={list.prospects} />
    </div>
  )
}
