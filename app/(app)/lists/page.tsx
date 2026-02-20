import { getLists } from "@/actions/lists"
import { ListCard } from "@/components/lists/list-card"
import { CreateListDialog } from "@/components/lists/create-list-dialog"

export default async function ListsPage() {
  const lists = await getLists()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Listes de prospects</h1>
          <p className="text-muted-foreground">
            Organisez vos prospects par campagne ou thématique.
          </p>
        </div>
        <CreateListDialog />
      </div>

      {lists.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <h3 className="text-lg font-medium">Aucune liste</h3>
          <p className="mt-1 text-muted-foreground">
            Créez votre première liste pour commencer à ajouter des prospects.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <ListCard
              key={list.id}
              id={list.id}
              name={list.name}
              description={list.description}
              defaultObjective={list.defaultObjective}
              prospectCount={list._count.prospects}
            />
          ))}
        </div>
      )}
    </div>
  )
}
