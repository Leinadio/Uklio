"use client"

import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/prospects/status-badge"
import { OBJECTIVE_LABELS, STEP_LABELS } from "@/lib/constants"
import { Eye, Trash2 } from "lucide-react"
import { deleteProspect } from "@/actions/prospects"
import { toast } from "sonner"

interface ProspectRow {
  id: string
  firstName: string
  lastName: string
  currentPosition: string
  objective: string | null
  status: string
  conversation: {
    currentStep: number
    messages: { createdAt: Date }[]
  } | null
}

export function ProspectTable({ prospects }: { prospects: ProspectRow[] }) {
  if (prospects.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        Aucun prospect dans cette liste. Commencez par en ajouter un.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Prospect</TableHead>
          <TableHead>Objectif</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Étape</TableHead>
          <TableHead>Dernière action</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {prospects.map((prospect) => {
          const initials =
            (prospect.firstName[0] || "") + (prospect.lastName[0] || "")
          const lastAction = prospect.conversation?.messages[0]?.createdAt
          const step = prospect.conversation?.currentStep ?? 0

          return (
            <TableRow key={prospect.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {initials.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {prospect.firstName} {prospect.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {prospect.currentPosition}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {prospect.objective
                  ? OBJECTIVE_LABELS[prospect.objective]
                  : "—"}
              </TableCell>
              <TableCell>
                <StatusBadge status={prospect.status} />
              </TableCell>
              <TableCell>{STEP_LABELS[step] || "—"}</TableCell>
              <TableCell>
                {lastAction
                  ? new Date(lastAction).toLocaleDateString("fr-FR")
                  : "—"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link
                      href={`/prospects/${prospect.id}/conversation`}
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={async () => {
                      if (!confirm("Supprimer ce prospect ?")) return
                      await deleteProspect(prospect.id)
                      toast.success("Prospect supprimé")
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
