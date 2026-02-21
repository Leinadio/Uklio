"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/prospects/status-badge"
import { STEP_LABELS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Eye } from "lucide-react"

interface ProspectRow {
  id: string
  firstName: string
  lastName: string
  currentPosition: string
  objective: string | null
  status: string
  conversation: {
    currentStep: number
    messages: { createdAt: Date; status: string; sentAt: Date | null }[]
  } | null
}

const FILTERS = [
  { value: "all", label: "Tous" },
  { value: "WAITING", label: "En attente" },
  { value: "follow_up", label: "Relance à envoyer" },
  { value: "GOAL_REACHED", label: "Objectif atteint" },
  { value: "CLOSED", label: "Clos" },
]

export function ConversationsTable({
  prospects,
}: {
  prospects: ProspectRow[]
}) {
  const [filter, setFilter] = useState("all")

  const filtered = prospects.filter((p) => {
    if (filter === "all") return true
    if (filter === "follow_up") {
      if (p.status !== "WAITING") return false
      const lastSent = p.conversation?.messages.find(
        (m) => m.status === "SENT" && m.sentAt
      )
      if (!lastSent?.sentAt) return false
      const daysSince =
        (Date.now() - new Date(lastSent.sentAt).getTime()) /
        (1000 * 60 * 60 * 24)
      return daysSince >= 3
    }
    return p.status === filter
  })

  return (
    <div>
      <Tabs value={filter} onValueChange={setFilter} className="mb-4">
        <TabsList>
          {FILTERS.map((f) => (
            <TabsTrigger key={f.value} value={f.value}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <div className="rounded-md border p-8 text-center text-muted-foreground">
          Aucun prospect pour ce filtre.
        </div>
      ) : (
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
            {filtered.map((p) => {
              const initials =
                (p.firstName[0] || "") + (p.lastName[0] || "")
              const step = p.conversation?.currentStep ?? 0
              const lastAction = p.conversation?.messages[0]?.createdAt
              const isFollowUpDue =
                p.status === "WAITING" &&
                p.conversation?.messages[0]?.sentAt &&
                Date.now() -
                  new Date(p.conversation.messages[0].sentAt).getTime() >
                  3 * 24 * 60 * 60 * 1000

              return (
                <TableRow
                  key={p.id}
                  className={cn(isFollowUpDue && "bg-amber-50/50 dark:bg-amber-950/20")}
                >
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
                  <TableCell className="max-w-[200px] truncate text-sm">
                    {p.objective || "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                  <TableCell className="text-sm">
                    {STEP_LABELS[step] || "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {lastAction
                      ? new Date(lastAction).toLocaleDateString("fr-FR")
                      : "—"}
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
    </div>
  )
}
