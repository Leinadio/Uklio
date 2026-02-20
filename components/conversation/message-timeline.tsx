"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { markMessageSent } from "@/actions/conversations"
import { MESSAGE_TYPE_LABELS } from "@/lib/constants"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Check, Clock, Copy } from "lucide-react"

interface Message {
  id: string
  type: string
  status: string
  content: string
  suggestedDelay: string | null
  sentAt: Date | null
  createdAt: Date
}

interface Props {
  messages: Message[]
  prospectFirstName: string
  onRefresh: () => void
}

export function MessageTimeline({
  messages,
  prospectFirstName,
  onRefresh,
}: Props) {
  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Aucun message. Générez d&apos;abord une séquence.
      </div>
    )
  }

  async function handleMarkSent(messageId: string) {
    await markMessageSent(messageId)
    toast.success("Message marqué comme envoyé")
    onRefresh()
  }

  async function handleCopy(content: string) {
    await navigator.clipboard.writeText(content)
    toast.success("Message copié !")
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4">
        {messages.map((msg) => {
          const isProspect = msg.type === "RESPONSE"
          const isDraft = msg.status === "DRAFT"
          const isSent = msg.status === "SENT"

          return (
            <div
              key={msg.id}
              className={cn("flex", isProspect ? "justify-start" : "justify-end")}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  isProspect
                    ? "bg-muted text-foreground"
                    : isDraft
                      ? "border-2 border-dashed border-primary/30 bg-primary/5"
                      : "bg-primary text-primary-foreground"
                )}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px]",
                      !isProspect &&
                        !isDraft &&
                        "border-primary-foreground/30 text-primary-foreground"
                    )}
                  >
                    {isProspect
                      ? prospectFirstName
                      : MESSAGE_TYPE_LABELS[msg.type] || "Message"}
                  </Badge>
                  {isDraft && (
                    <Badge variant="secondary" className="text-[10px]">
                      Brouillon
                    </Badge>
                  )}
                  {isSent && (
                    <span className="flex items-center gap-0.5 text-[10px] text-primary-foreground/70">
                      <Check className="h-3 w-3" />
                      Envoyé
                    </span>
                  )}
                </div>

                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.content}
                </p>

                <div className="mt-2 flex items-center justify-between">
                  <span
                    className={cn(
                      "text-[10px]",
                      isProspect || isDraft
                        ? "text-muted-foreground"
                        : "text-primary-foreground/60"
                    )}
                  >
                    {msg.sentAt
                      ? new Date(msg.sentAt).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : msg.suggestedDelay && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {msg.suggestedDelay}
                          </span>
                        )}
                  </span>

                  {isDraft && !isProspect && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => handleCopy(msg.content)}
                      >
                        <Copy className="mr-1 h-3 w-3" />
                        Copier
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        className="h-7 text-xs"
                        onClick={() => handleMarkSent(msg.id)}
                      >
                        <Check className="mr-1 h-3 w-3" />
                        Envoyé
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
