"use client"

import { useReducer, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { updateProspectStrategy } from "@/actions/prospects"
import { StepObjective } from "./step-objective"
import { SequenceDisplay } from "./sequence-display"
import { ArrowLeft, Loader2 } from "lucide-react"
import type { WizardState, ObjectiveType } from "@/lib/wizard-types"

type WizardAction =
  | { type: "UPDATE_FIELD"; field: keyof WizardState; value: string }
  | { type: "SELECT_OBJECTIVE"; objective: ObjectiveType }
  | { type: "SET_SIGNAL"; signal: string }

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value }
    case "SELECT_OBJECTIVE":
      return { ...state, objective: action.objective }
    case "SET_SIGNAL":
      return { ...state, signal: action.signal }
    default:
      return state
  }
}

const STEPS = ["Objectif", "Message"]

interface Props {
  prospectId: string
  initialState: WizardState
}

export function ProspectSetupWizard({ prospectId, initialState }: Props) {
  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  async function handleGenerateMessage() {
    if (!state.objective) return

    setLoading(true)
    const result = await updateProspectStrategy(prospectId, {
      objective: state.objective as ObjectiveType,
      signal: state.signal,
    })

    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
      return
    }

    setStep(1)
    setLoading(false)
  }

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <Progress value={progress} className="flex-1" />
          <span className="text-sm text-muted-foreground">
            {step + 1}/{STEPS.length}
          </span>
        </div>
        <div className="mt-2 flex gap-3">
          {STEPS.map((s, i) => (
            <span
              key={i}
              className={`text-xs ${
                i <= step ? "font-medium text-foreground" : "text-muted-foreground"
              }`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {step === 0 && <StepObjective state={state} dispatch={dispatch} />}
      {step === 1 && (
        <SequenceDisplay
          prospectId={prospectId}
          state={state}
          onDone={() => router.push(`/prospects/${prospectId}/conversation`)}
        />
      )}

      {step === 0 && (
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Annuler
          </Button>

          <Button
            onClick={handleGenerateMessage}
            disabled={!state.objective || loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Générer le message
          </Button>
        </div>
      )}
    </div>
  )
}
