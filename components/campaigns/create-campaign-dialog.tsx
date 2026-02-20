"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { createCampaign } from "@/actions/campaigns"
import { OBJECTIVE_LABELS, OBJECTIVE_DESCRIPTIONS } from "@/lib/constants"
import { Loader2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

const OBJECTIVES = ["CALL", "MEETING", "SELL", "TESTIMONIAL"] as const

export function CreateCampaignDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedObjective, setSelectedObjective] = useState<string>("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set("defaultObjective", selectedObjective)
    const result = await createCampaign(formData)

    setLoading(false)

    if (result?.error) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    toast.success("Campagne créée")
    setOpen(false)
    setSelectedObjective("")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) setSelectedObjective("")
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle campagne
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nouvelle campagne</DialogTitle>
          <DialogDescription>
            Organisez vos prospects par thématique ou objectif commercial.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>
              Objectif de la campagne{" "}
              <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {OBJECTIVES.map((obj) => (
                <button
                  key={obj}
                  type="button"
                  onClick={() => setSelectedObjective(obj)}
                  className={cn(
                    "rounded-md border p-3 text-left transition-colors",
                    selectedObjective === obj
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/50"
                  )}
                >
                  <p className="text-sm font-medium">{OBJECTIVE_LABELS[obj]}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                    {OBJECTIVE_DESCRIPTIONS[obj]}
                  </p>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">
              Nom de la campagne{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex : Prospects SaaS RH"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">
              Description{" "}
              <span className="text-muted-foreground">(optionnel)</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Rappel de l'objectif de cette campagne..."
              rows={2}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !selectedObjective}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
