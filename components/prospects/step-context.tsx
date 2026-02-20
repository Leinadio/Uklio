"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Sparkles, PenLine } from "lucide-react"
import type { WizardState } from "./prospect-wizard"

interface ContextSuggestion {
  id: string
  title: string
  description: string
  relevanceScore: number
}

interface Props {
  state: WizardState
  dispatch: React.Dispatch<{
    type: "SELECT_CONTEXT"
    context: string
    detail: string
  }>
}

export function StepContext({ state, dispatch }: Props) {
  const [suggestions, setSuggestions] = useState<ContextSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [customMode, setCustomMode] = useState(false)
  const [customText, setCustomText] = useState("")

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        const res = await fetch("/api/ai/suggest-contexts", {
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
              location: state.location,
              pastExperiences: state.pastExperiences,
              education: state.education,
              skills: state.skills,
              recentPosts: state.recentPosts,
              mutualConnections: state.mutualConnections,
              services: state.services,
            },
            objective: state.objective,
          }),
        })
        const data = await res.json()
        setSuggestions(data.suggestions || [])
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }
    fetchSuggestions()
  }, [state])

  function selectContext(title: string, description: string) {
    setCustomMode(false)
    dispatch({ type: "SELECT_CONTEXT", context: title, detail: description })
  }

  function selectCustom() {
    setCustomMode(true)
    dispatch({
      type: "SELECT_CONTEXT",
      context: "Contexte personnalisé",
      detail: customText,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Contexte d&apos;approche
        </CardTitle>
        <CardDescription>
          L&apos;IA suggère des contextes pertinents basés sur le profil de{" "}
          {state.firstName}. Sélectionnez celui qui correspond le mieux.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((s) => (
              <button
                key={s.id}
                onClick={() => selectContext(s.title, s.description)}
                className={cn(
                  "w-full rounded-lg border p-4 text-left transition-all hover:shadow-sm",
                  state.selectedContext === s.title && !customMode
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:border-muted-foreground/25"
                )}
              >
                <p className="font-medium">{s.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {s.description}
                </p>
              </button>
            ))}

            <button
              onClick={selectCustom}
              className={cn(
                "w-full rounded-lg border border-dashed p-4 text-left transition-all hover:shadow-sm",
                customMode
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "hover:border-muted-foreground/25"
              )}
            >
              <div className="flex items-center gap-2">
                <PenLine className="h-4 w-4" />
                <p className="font-medium">Autre contexte</p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Décrivez librement le contexte d&apos;approche.
              </p>
            </button>

            {customMode && (
              <div className="space-y-2">
                <Label htmlFor="customContext">Votre contexte</Label>
                <Textarea
                  id="customContext"
                  value={customText}
                  onChange={(e) => {
                    setCustomText(e.target.value)
                    dispatch({
                      type: "SELECT_CONTEXT",
                      context: "Contexte personnalisé",
                      detail: e.target.value,
                    })
                  }}
                  placeholder="Ex : J'ai vu qu'il a liké mon post sur l'automatisation marketing..."
                  rows={3}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
