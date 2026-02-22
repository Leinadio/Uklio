"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createCampaign } from "@/actions/campaigns"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCampaignDialog({ open, onOpenChange }: Props) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [offer, setOffer] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !offer.trim()) return

    setLoading(true)
    try {
      const campaign = await createCampaign({
        name: name.trim(),
        offer: offer.trim(),
      })
      toast.success("Campagne créée")
      onOpenChange(false)
      setName("")
      setOffer("")
      router.push(`/campaigns/${campaign.id}`)
    } catch {
      toast.error("Erreur lors de la création")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nouvelle campagne</DialogTitle>
            <DialogDescription>
              Regroupez vos prospects autour d&apos;une même offre.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Nom de la campagne</Label>
              <Input
                id="campaign-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex : Audit landing page pour freelances"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaign-offer">
                Que proposez-vous à vos clients ?
              </Label>
              <Textarea
                id="campaign-offer"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder="Ex : Je crée des rapports d'audit de landing page qui montrent aux business owners les problèmes de conversion de leur site"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Décrivez votre offre en une ou deux phrases. L&apos;IA
                utilisera cette info pour orienter les messages vers votre
                domaine.
              </p>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || !offer.trim() || loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
