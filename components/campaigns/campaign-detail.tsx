"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/prospects/status-badge"
import { OBJECTIVE_LABELS } from "@/lib/constants"
import { deleteCampaign } from "@/actions/campaigns"
import { toast } from "sonner"
import { Megaphone, Pencil, Trash2, Eye } from "lucide-react"
import { EditCampaignDialog } from "./edit-campaign-dialog"

interface Prospect {
  id: string
  firstName: string
  lastName: string
  currentPosition: string
  objective: string | null
  status: string
  conversation: {
    messages: { createdAt: Date }[]
  } | null
}

interface Campaign {
  id: string
  name: string
  offer: string
  prospects: Prospect[]
}

export function CampaignDetail({ campaign }: { campaign: Campaign }) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)

  async function handleDelete() {
    if (!confirm("Supprimer cette campagne ? Les prospects ne seront pas supprimés.")) return

    await deleteCampaign(campaign.id)
    toast.success("Campagne supprimée")
    router.push("/campaigns")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Megaphone className="h-6 w-6 text-primary" />
            {campaign.name}
          </h1>
          <p className="mt-1 text-muted-foreground">{campaign.offer}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="mr-1 h-3.5 w-3.5" />
            Modifier
          </Button>
          <Button variant="outline" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-1 h-3.5 w-3.5" />
            Supprimer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Prospects ({campaign.prospects.length})
          </CardTitle>
          <CardDescription>
            Les prospects associés à cette campagne.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {campaign.prospects.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aucun prospect dans cette campagne. Ajoutez-en depuis le tableau
              de bord ou via l&apos;extension Chrome.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prospect</TableHead>
                  <TableHead>Objectif</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaign.prospects.map((p) => {
                  const initials =
                    (p.firstName[0] || "") + (p.lastName[0] || "")
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {initials.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {p.firstName} {p.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {p.currentPosition}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {p.objective
                          ? OBJECTIVE_LABELS[p.objective] || p.objective
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={p.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/prospects/${p.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <EditCampaignDialog
        campaign={campaign}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  )
}
