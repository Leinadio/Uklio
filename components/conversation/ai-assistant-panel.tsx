"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/prospects/status-badge"
import { STEP_LABELS } from "@/lib/constants"
import { toast } from "sonner"
import {
  Sparkles,
  Target,
  MessageSquare,
  Copy,
  Loader2,
} from "lucide-react"

interface Message {
  id: string
  type: string
  status: string
  content: string
  suggestedDelay: string | null
  sentAt: Date | null
  createdAt: Date
}

interface Prospect {
  id: string
  firstName: string
  lastName: string
  objective: string | null
  selectedContext: string | null
  status: string
  conversation: {
    currentStep: number
    followUpCount: number
    messages: Message[]
  } | null
}

interface Props {
  prospect: Prospect
  messages: Message[]
  onRefresh: () => void
}

export function AiAssistantPanel({ prospect, messages, onRefresh }: Props) {
  const [responseText, setResponseText] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<{
    sentiment: string
    nextMessage: string
    reasoning: string
  } | null>(null)

  async function handleAnalyze() {
    if (!responseText.trim()) {
      toast.error("Collez la réponse du prospect")
      return
    }

    setAnalyzing(true)
    try {
      const res = await fetch("/api/ai/analyze-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospectId: prospect.id,
          prospectResponse: responseText,
        }),
      })
      const data = await res.json()

      if (data.error) {
        toast.error(data.error)
      } else {
        setAnalysis(data)
        setResponseText("")
        toast.success("Réponse analysée")
        onRefresh()
      }
    } catch {
      toast.error("Erreur d'analyse")
    } finally {
      setAnalyzing(false)
    }
  }

  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text)
    toast.success("Message copié !")
  }

  const step = prospect.conversation?.currentStep ?? 0
  const progressPercent = (step / 4) * 100

  // Find next draft message to send
  const nextDraft = messages.find(
    (m) => m.status === "DRAFT" && m.type !== "RESPONSE"
  )

  // Check if follow-up is due
  const lastSentMessage = [...messages]
    .reverse()
    .find((m) => m.status === "SENT" && m.type !== "RESPONSE")
  const followUpDue =
    lastSentMessage?.sentAt &&
    new Date().getTime() - new Date(lastSentMessage.sentAt).getTime() >
      3 * 24 * 60 * 60 * 1000 // 3 days

  return (
    <div className="space-y-4">
      {/* Context recap */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Assistant IA</h3>
          <StatusBadge status={prospect.status} />
        </div>

        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2">
            <Target className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Objectif :</span>
            <span className="font-medium">
              {prospect.objective || "—"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Contexte :</span>
            <span className="font-medium">
              {prospect.selectedContext || "—"}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2">
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>Progression</span>
            <span>{STEP_LABELS[step] || "Non commencé"}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Follow-up notification */}
      {followUpDue && nextDraft && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            Il est temps d&apos;envoyer la relance !
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Le délai suggéré est dépassé.
          </p>
        </div>
      )}

      {/* Paste prospect response */}
      {prospect.status !== "CLOSED" && prospect.status !== "GOAL_REACHED" && (
        <div className="space-y-2">
          <Label htmlFor="response" className="text-sm font-medium">
            Réponse de {prospect.firstName}
          </Label>
          <Textarea
            id="response"
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder={`Collez ici la réponse de ${prospect.firstName}...`}
            rows={4}
          />
          <Button
            onClick={handleAnalyze}
            disabled={analyzing || !responseText.trim()}
            className="w-full"
          >
            {analyzing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Analyser la réponse
          </Button>
        </div>
      )}

      {/* Analysis result */}
      {analysis && (
        <div className="space-y-3">
          <Separator />
          <div className="rounded-md bg-muted/50 p-3">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Analyse</span>
              <Badge variant="outline" className="text-xs">
                {analysis.sentiment}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {analysis.reasoning}
            </p>
          </div>

          <div className="rounded-md border p-3">
            <p className="mb-2 text-sm font-medium">Message suggéré</p>
            <p className="whitespace-pre-wrap text-sm">{analysis.nextMessage}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => handleCopy(analysis.nextMessage)}
            >
              <Copy className="mr-1 h-3 w-3" />
              Copier
            </Button>
          </div>
        </div>
      )}

      {/* Next draft message */}
      {!analysis && nextDraft && (
        <>
          <Separator />
          <div className="space-y-2">
            <p className="text-sm font-medium">Prochain message</p>
            <div className="rounded-md border p-3">
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {MESSAGE_TYPE_LABELS[nextDraft.type] || "Message"}
                </Badge>
                {nextDraft.suggestedDelay && (
                  <span className="text-xs text-muted-foreground">
                    Délai : {nextDraft.suggestedDelay}
                  </span>
                )}
              </div>
              <p className="whitespace-pre-wrap text-sm">{nextDraft.content}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => handleCopy(nextDraft.content)}
              >
                <Copy className="mr-1 h-3 w-3" />
                Copier
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Closed/Goal reached message */}
      {(prospect.status === "CLOSED" || prospect.status === "GOAL_REACHED") && (
        <div
          className={`rounded-md border p-3 text-center ${
            prospect.status === "GOAL_REACHED"
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
          }`}
        >
          <p className="font-medium">
            {prospect.status === "GOAL_REACHED"
              ? "Objectif atteint !"
              : "Conversation clôturée"}
          </p>
        </div>
      )}
    </div>
  )
}

const MESSAGE_TYPE_LABELS: Record<string, string> = {
  INITIAL: "Message initial",
  FOLLOW_UP_1: "Relance 1",
  FOLLOW_UP_2: "Relance 2",
  FOLLOW_UP_3: "Relance 3",
  AI_REPLY: "Message suggéré",
}
