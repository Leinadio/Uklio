"use client"

import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { OBJECTIVE_LABELS } from "@/lib/constants"
import { Users, ArrowRight, Trash2 } from "lucide-react"
import { deleteList } from "@/actions/lists"
import { toast } from "sonner"

interface ListCardProps {
  id: string
  name: string
  description?: string | null
  defaultObjective?: string | null
  prospectCount: number
}

export function ListCard({
  id,
  name,
  description,
  defaultObjective,
  prospectCount,
}: ListCardProps) {
  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    if (!confirm("Supprimer cette liste et tous ses prospects ?")) return
    await deleteList(id)
    toast.success("Liste supprimée")
  }

  return (
    <Link href={`/lists/${id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">{name}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {description && (
            <CardDescription className="line-clamp-2">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {prospectCount} prospect{prospectCount !== 1 ? "s" : ""}
              </div>
              {defaultObjective && (
                <Badge variant="outline" className="text-xs">
                  {OBJECTIVE_LABELS[defaultObjective]}
                </Badge>
              )}
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
