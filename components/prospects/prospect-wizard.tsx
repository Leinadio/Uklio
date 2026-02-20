"use client"

import { useReducer, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { createProspect, updateProspectStrategy } from "@/actions/prospects"
import { StepInfo } from "./step-info"
import { StepObjective } from "./step-objective"
import { StepContext } from "./step-context"
import { StepStrategy } from "./step-strategy"
import { StepRecap } from "./step-recap"
import { SequenceDisplay } from "./sequence-display"
import { ArrowLeft } from "lucide-react"

export interface WizardState {
  // Step 1: Prospect info
  firstName: string
  lastName: string
  linkedinUrl: string
  currentPosition: string
  currentCompany: string
  profilePhotoUrl: string
  headline: string
  bio: string
  location: string
  pastExperiences: string
  education: string
  skills: string
  languages: string
  services: string
  recentPosts: string
  mutualConnections: string
  connectionCount: string
  // Step 2: Objective
  objective: string
  // Step 3: Context
  selectedContext: string
  contextDetail: string
  // Step 4: Strategy
  selectedStrategy: string
  strategyDetail: string
}

type WizardAction =
  | { type: "UPDATE_FIELD"; field: keyof WizardState; value: string }
  | { type: "SELECT_OBJECTIVE"; objective: string }
  | {
      type: "SELECT_CONTEXT"
      context: string
      detail: string
    }
  | {
      type: "SELECT_STRATEGY"
      strategy: string
      detail: string
    }

const initialState: WizardState = {
  firstName: "",
  lastName: "",
  linkedinUrl: "",
  currentPosition: "",
  currentCompany: "",
  profilePhotoUrl: "",
  headline: "",
  bio: "",
  location: "",
  pastExperiences: "",
  education: "",
  skills: "",
  languages: "",
  services: "",
  recentPosts: "",
  mutualConnections: "",
  connectionCount: "",
  objective: "",
  selectedContext: "",
  contextDetail: "",
  selectedStrategy: "",
  strategyDetail: "",
}

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value }
    case "SELECT_OBJECTIVE":
      return { ...state, objective: action.objective }
    case "SELECT_CONTEXT":
      return {
        ...state,
        selectedContext: action.context,
        contextDetail: action.detail,
      }
    case "SELECT_STRATEGY":
      return {
        ...state,
        selectedStrategy: action.strategy,
        strategyDetail: action.detail,
      }
    default:
      return state
  }
}

const STEPS = [
  "Informations",
  "Objectif",
  "Contexte",
  "Stratégie",
  "Récapitulatif",
  "Séquence",
]

interface Props {
  campaignId: string
  defaultObjective?: string
}

export function ProspectWizard({ campaignId, defaultObjective }: Props) {
  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    objective: defaultObjective || "",
  })
  const [step, setStep] = useState(0)
  const [prospectId, setProspectId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function canAdvance(): boolean {
    switch (step) {
      case 0:
        return !!(
          state.firstName &&
          state.lastName &&
          state.linkedinUrl &&
          state.currentPosition &&
          state.currentCompany
        )
      case 1:
        return !!state.objective
      case 2:
        return !!state.selectedContext
      case 3:
        return !!state.selectedStrategy
      default:
        return true
    }
  }

  async function handleCreateAndGenerate() {
    setLoading(true)

    // Create prospect if not already created
    if (!prospectId) {
      const result = await createProspect({
        campaignId,
        firstName: state.firstName,
        lastName: state.lastName,
        linkedinUrl: state.linkedinUrl,
        currentPosition: state.currentPosition,
        currentCompany: state.currentCompany,
        profilePhotoUrl: state.profilePhotoUrl || undefined,
        headline: state.headline || undefined,
        bio: state.bio || undefined,
        location: state.location || undefined,
        pastExperiences: state.pastExperiences
          ? state.pastExperiences
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean)
              .map((line) => {
                const [title, company] = line.split(" - ")
                return { title: title?.trim() || line, company: company?.trim() || "" }
              })
          : undefined,
        education: state.education || undefined,
        skills: state.skills || undefined,
        languages: state.languages || undefined,
        services: state.services || undefined,
        recentPosts: state.recentPosts
          ? state.recentPosts
              .split("\n\n")
              .map((p) => p.trim())
              .filter(Boolean)
              .map((content) => ({ content }))
          : undefined,
        mutualConnections: state.mutualConnections || undefined,
        connectionCount: state.connectionCount
          ? parseInt(state.connectionCount)
          : undefined,
        objective: state.objective,
        selectedContext: state.selectedContext,
        contextDetail: state.contextDetail,
        selectedStrategy: state.selectedStrategy,
        strategyDetail: state.strategyDetail,
      })

      if (result.error) {
        toast.error(result.error)
        setLoading(false)
        return
      }

      setProspectId(result.prospectId!)
    } else {
      await updateProspectStrategy(prospectId, {
        objective: state.objective,
        selectedContext: state.selectedContext,
        contextDetail: state.contextDetail,
        selectedStrategy: state.selectedStrategy,
        strategyDetail: state.strategyDetail,
      })
    }

    setStep(5) // Go to sequence display
    setLoading(false)
  }

  function handleNext() {
    if (step === 4) {
      handleCreateAndGenerate()
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
                i <= step
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {step === 0 && <StepInfo state={state} dispatch={dispatch} />}
      {step === 1 && <StepObjective state={state} dispatch={dispatch} />}
      {step === 2 && <StepContext state={state} dispatch={dispatch} />}
      {step === 3 && <StepStrategy state={state} dispatch={dispatch} />}
      {step === 4 && <StepRecap state={state} />}
      {step === 5 && prospectId && (
        <SequenceDisplay
          prospectId={prospectId}
          state={state}
          onDone={() => router.push(`/campaigns/${campaignId}`)}
        />
      )}

      {step < 5 && (
        <div className="mt-6 flex justify-between">
          {step > 0 ? (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Précédent
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => router.push(`/campaigns/${campaignId}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Annuler
            </Button>
          )}

          <Button
            onClick={handleNext}
            disabled={!canAdvance() || loading}
          >
            {step === 4 ? "Générer la séquence" : "Continuer"}
          </Button>
        </div>
      )}
    </div>
  )
}
