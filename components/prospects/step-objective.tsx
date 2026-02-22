"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { OBJECTIVE_LABELS } from "@/lib/constants"
import { Target, Phone, Calendar, ShoppingCart, Star, Megaphone } from "lucide-react"
import { cn } from "@/lib/utils"
import type { WizardState, ObjectiveType } from "@/lib/wizard-types"

const OBJECTIVES: { value: ObjectiveType; label: string; icon: typeof Phone }[] = [
  { value: "CALL", label: OBJECTIVE_LABELS.CALL, icon: Phone },
  { value: "MEETING", label: OBJECTIVE_LABELS.MEETING, icon: Calendar },
  { value: "SELL", label: OBJECTIVE_LABELS.SELL, icon: ShoppingCart },
  { value: "TESTIMONIAL", label: OBJECTIVE_LABELS.TESTIMONIAL, icon: Star },
]

interface CampaignOption {
  id: string
  name: string
  offer: string
}

interface Props {
  state: WizardState
  dispatch: React.Dispatch<
    | { type: "SELECT_OBJECTIVE"; objective: ObjectiveType }
    | { type: "SET_SIGNAL"; signal: string }
    | { type: "SET_CAMPAIGN"; campaignId: string }
  >
  campaigns: CampaignOption[]
}

export function StepObjective({ state, dispatch, campaigns }: Props) {
  const selectedCampaign = campaigns.find((c) => c.id === state.campaignId)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            Campagne
          </CardTitle>
          <CardDescription>
            Dans quelle campagne souhaitez-vous ajouter {state.firstName}{" "}
            {state.lastName} ?
          </CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune campagne créée.{" "}
              <a href="/campaigns" className="text-primary hover:underline">
                Créez votre première campagne
              </a>{" "}
              pour commencer.
            </p>
          ) : (
            <div className="space-y-2">
              <Select
                value={state.campaignId}
                onValueChange={(value) =>
                  dispatch({ type: "SET_CAMPAIGN", campaignId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une campagne" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCampaign && (
                <p className="text-xs text-muted-foreground">
                  Offre : {selectedCampaign.offer}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Objectif
          </CardTitle>
          <CardDescription>
            Que souhaitez-vous obtenir de {state.firstName} {state.lastName} ?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {OBJECTIVES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  dispatch({ type: "SELECT_OBJECTIVE", objective: value })
                }
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-accent",
                  state.objective === value
                    ? "border-primary bg-primary/5"
                    : "border-border"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    state.objective === value
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    state.objective === value
                      ? "text-primary"
                      : "text-foreground"
                  )}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Il/elle vient de...</CardTitle>
          <CardDescription>
            Optionnel. Un signal récent rend le message beaucoup plus pertinent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="signal" className="sr-only">
              Signal
            </Label>
            <Input
              id="signal"
              value={state.signal}
              onChange={(e) =>
                dispatch({ type: "SET_SIGNAL", signal: e.target.value })
              }
              placeholder="commenter mon post sur le SEO local, changer de poste, liker mon article sur Shopify..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
