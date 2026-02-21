"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Target } from "lucide-react"
import type { WizardState } from "@/lib/wizard-types"

interface Props {
  state: WizardState
  dispatch: React.Dispatch<{ type: "SELECT_OBJECTIVE"; objective: string }>
}

export function StepObjective({ state, dispatch }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Objectif final
        </CardTitle>
        <CardDescription>
          Décrivez ce que vous souhaitez obtenir de {state.firstName}{" "}
          {state.lastName} à l&apos;issue de la conversation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="objective">Votre objectif</Label>
          <Textarea
            id="objective"
            value={state.objective}
            onChange={(e) =>
              dispatch({ type: "SELECT_OBJECTIVE", objective: e.target.value })
            }
            placeholder="Ex : Obtenir un appel de 15 min pour lui présenter mon outil, Décrocher un RDV pour une démo, Lui proposer une collaboration sur un projet..."
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Soyez précis — l&apos;IA utilisera cet objectif pour orienter le ton et la progression du message.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
