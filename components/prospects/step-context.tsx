"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { List, PenLine } from "lucide-react"
import { CONTEXT_OPTIONS } from "@/lib/constants"
import type { WizardState } from "@/lib/wizard-types"

interface Props {
  state: WizardState
  dispatch: React.Dispatch<{
    type: "SELECT_CONTEXT"
    context: string
    detail: string
  }>
}

export function StepContext({ state, dispatch }: Props) {
  const [customMode, setCustomMode] = useState(false)
  const [customText, setCustomText] = useState("")

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
          <List className="h-5 w-5 text-primary" />
          Contexte d&apos;approche
        </CardTitle>
        <CardDescription>
          Sélectionnez le contexte qui correspond le mieux à votre situation avec{" "}
          {state.firstName}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {CONTEXT_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => selectContext(option.title, option.description)}
              className={cn(
                "w-full rounded-lg border p-4 text-left transition-all hover:shadow-sm",
                state.selectedContext === option.title && !customMode
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "hover:border-muted-foreground/25"
              )}
            >
              <p className="font-medium">{option.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {option.description}
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
      </CardContent>
    </Card>
  )
}
