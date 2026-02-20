"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { OBJECTIVE_LABELS, OBJECTIVE_DESCRIPTIONS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Phone, MapPin, ShoppingBag, MessageCircle } from "lucide-react"
import type { WizardState } from "./prospect-wizard"

const OBJECTIVE_ICONS: Record<string, React.ElementType> = {
  CALL: Phone,
  MEETING: MapPin,
  SELL: ShoppingBag,
  TESTIMONIAL: MessageCircle,
}

interface Props {
  state: WizardState
  dispatch: React.Dispatch<{ type: "SELECT_OBJECTIVE"; objective: string }>
}

export function StepObjective({ state, dispatch }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Objectif final</CardTitle>
        <CardDescription>
          Quel est le résultat concret que vous visez avec {state.firstName}{" "}
          {state.lastName} ?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(OBJECTIVE_LABELS).map(([key, label]) => {
            const Icon = OBJECTIVE_ICONS[key]
            const isSelected = state.objective === key
            return (
              <button
                key={key}
                onClick={() =>
                  dispatch({ type: "SELECT_OBJECTIVE", objective: key })
                }
                className={cn(
                  "flex flex-col items-start gap-3 rounded-lg border p-4 text-left transition-all hover:shadow-sm",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:border-muted-foreground/25"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-md",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {OBJECTIVE_DESCRIPTIONS[key]}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
