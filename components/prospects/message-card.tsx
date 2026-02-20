"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { MESSAGE_TYPE_LABELS } from "@/lib/constants"
import { Copy, RefreshCw, Pencil, Check, Clock } from "lucide-react"

interface Props {
  index: number
  type: string
  content: string
  suggestedDelay: string
  prospectId: string
}

export function MessageCard({
  index,
  type,
  content: initialContent,
  suggestedDelay,
  prospectId,
}: Props) {
  const [content, setContent] = useState(initialContent)
  const [editing, setEditing] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(content)
    toast.success("Message copié !")
  }

  async function handleRegenerate() {
    setRegenerating(true)
    try {
      const res = await fetch("/api/ai/generate-sequence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospectId,
          regenerateIndex: index,
        }),
      })
      const data = await res.json()
      if (data.messages?.[index]) {
        setContent(data.messages[index].content)
        toast.success("Message régénéré")
      }
    } catch {
      toast.error("Erreur lors de la régénération")
    } finally {
      setRegenerating(false)
    }
  }

  const label = MESSAGE_TYPE_LABELS[type] || `Message ${index + 1}`

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={index === 0 ? "default" : "secondary"}>
            {label}
          </Badge>
          {suggestedDelay && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {suggestedDelay}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            <Copy className="mr-1 h-3 w-3" />
            Copier
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing(!editing)}
          >
            {editing ? (
              <Check className="mr-1 h-3 w-3" />
            ) : (
              <Pencil className="mr-1 h-3 w-3" />
            )}
            {editing ? "Valider" : "Modifier"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRegenerate}
            disabled={regenerating}
          >
            <RefreshCw
              className={`mr-1 h-3 w-3 ${regenerating ? "animate-spin" : ""}`}
            />
            Régénérer
          </Button>
        </div>
      </div>

      {editing ? (
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="font-normal"
        />
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
      )}
    </div>
  )
}
