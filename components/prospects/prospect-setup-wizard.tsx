"use client"

import { useReducer, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { updateProspectStrategy } from "@/actions/prospects"
import { StepObjective } from "./step-objective"
import { StepContext } from "./step-context"
import { StepRecap } from "./step-recap"
import { SequenceDisplay } from "./sequence-display"
import { ArrowLeft } from "lucide-react"
import type { WizardState } from "@/lib/wizard-types"

type WizardAction =
  | { type: "UPDATE_FIELD"; field: keyof WizardState; value: string }
  | { type: "SELECT_OBJECTIVE"; objective: string }
  | { type: "SELECT_CONTEXT"; context: string; detail: string }

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value }
    case "SELECT_OBJECTIVE":
      return { ...state, objective: action.objective }
    case "SELECT_CONTEXT":
      return { ...state, selectedContext: action.context, contextDetail: action.detail }
    default:
      return state
  }
}

const STEPS = ["Objectif", "Contexte", "Récapitulatif", "Séquence"]

interface Props {
  prospectId: string
  initialState: WizardState
}

export function ProspectSetupWizard({ prospectId, initialState }: Props) {
  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  function canAdvance(): boolean {
    switch (step) {
      case 0: return !!state.objective
      case 1: return !!state.selectedContext
      case 2: return true
      default: return true
    }
  }

  async function handleGenerateSequence() {
    setLoading(true)
    const result = await updateProspectStrategy(prospectId, {
      objective: state.objective,
      selectedContext: state.selectedContext,
      contextDetail: state.contextDetail,
    })

    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
      return
    }

    setStep(3)
    setLoading(false)
  }

  function handleNext() {
    if (step === 2) {
      handleGenerateSequence()
    } else {
      setStep((s) => s + 1)
    }
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
      {step === 1 && <StepContext state={state} dispatch={dispatch} />}
      {step === 2 && <StepRecap state={state} />}
      {step === 3 && (
        <SequenceDisplay
          prospectId={prospectId}
          state={state}
          onDone={() => router.push(`/prospects/${prospectId}/conversation`)}
        />
      )}

      {step < 3 && (
        <div className="mt-6 flex justify-between">
          {step > 0 ? (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Précédent
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Annuler
            </Button>
          )}

          <Button onClick={handleNext} disabled={!canAdvance() || loading}>
            {step === 2 ? "Générer le message" : "Continuer"}
          </Button>
        </div>
      )}
    </div>
  )
}
