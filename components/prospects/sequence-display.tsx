"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageCard } from "./message-card"
import { Sparkles, ArrowRight } from "lucide-react"
import type { WizardState } from "@/lib/wizard-types"

interface GeneratedMessage {
  type: string
  content: string
  suggestedDelay: string
}

interface Props {
  prospectId: string
  state: WizardState
  onDone: () => void
}

export function SequenceDisplay({ prospectId, state, onDone }: Props) {
  const [messages, setMessages] = useState<GeneratedMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function generateSequence() {
      try {
        const res = await fetch("/api/ai/generate-sequence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prospectId,
            prospect: {
              firstName: state.firstName,
              lastName: state.lastName,
              currentPosition: state.currentPosition,
              currentCompany: state.currentCompany,
              headline: state.headline,
              bio: state.bio,
              skills: state.skills,
              recentPosts: state.recentPosts,
              mutualConnections: state.mutualConnections,
              location: state.location,
            },
            objective: state.objective,
            context: state.selectedContext,
            contextDetail: state.contextDetail,
          }),
        })
        const data = await res.json()
        setMessages(data.messages || [])
      } catch {
        setMessages([])
      } finally {
        setLoading(false)
      }
    }
    generateSequence()
  }, [prospectId])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Séquence de messages générée
          </CardTitle>
          <CardDescription>
            Voici votre message initial prêt à être copié et envoyé sur LinkedIn.
            Vous pouvez le modifier avant envoi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <MessageCard
                  key={i}
                  index={i}
                  type={msg.type}
                  content={msg.content}
                  suggestedDelay={msg.suggestedDelay}
                  prospectId={prospectId}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Impossible de générer la séquence. Vérifiez votre clé API
              Anthropic.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onDone}>
          Voir la conversation
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
