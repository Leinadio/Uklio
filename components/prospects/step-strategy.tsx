"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"
import { TONE_LABELS } from "@/lib/constants"
import type { WizardState } from "./prospect-wizard"

interface StrategySuggestion {
  id: string
  name: string
  description: string
  steps: number
  toneIndicator: string
}

interface Props {
  state: WizardState
  dispatch: React.Dispatch<{
    type: "SELECT_STRATEGY"
    strategy: string
    detail: string
  }>
}

export function StepStrategy({ state, dispatch }: Props) {
  const [strategies, setStrategies] = useState<StrategySuggestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStrategies() {
      try {
        const res = await fetch("/api/ai/suggest-strategies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prospect: {
              firstName: state.firstName,
              lastName: state.lastName,
              currentPosition: state.currentPosition,
              currentCompany: state.currentCompany,
              headline: state.headline,
              bio: state.bio,
              skills: state.skills,
              recentPosts: state.recentPosts,
            },
            objective: state.objective,
            context: state.selectedContext,
            contextDetail: state.contextDetail,
          }),
        })
        const data = await res.json()
        setStrategies(data.strategies || [])
      } catch {
        setStrategies([])
      } finally {
        setLoading(false)
      }
    }
    fetchStrategies()
  }, [state.objective, state.selectedContext, state.contextDetail])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Stratégie d&apos;approche
        </CardTitle>
        <CardDescription>
          L&apos;IA propose des stratégies adaptées à votre objectif et au
          contexte choisi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {strategies.map((s) => (
              <button
                key={s.id}
                onClick={() =>
                  dispatch({
                    type: "SELECT_STRATEGY",
                    strategy: s.name,
                    detail: s.description,
                  })
                }
                className={cn(
                  "w-full rounded-lg border p-4 text-left transition-all hover:shadow-sm",
                  state.selectedStrategy === s.name
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:border-muted-foreground/25"
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{s.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {s.steps} étapes
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {TONE_LABELS[s.toneIndicator] || s.toneIndicator}
                    </Badge>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {s.description}
                </p>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
