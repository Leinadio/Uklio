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
import { updateCampaign } from "@/actions/campaigns"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface Props {
  campaign: { id: string; name: string; offer: string }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCampaignDialog({ campaign, open, onOpenChange }: Props) {
  const router = useRouter()
  const [name, setName] = useState(campaign.name)
  const [offer, setOffer] = useState(campaign.offer)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !offer.trim()) return

    setLoading(true)
    try {
      const result = await updateCampaign(campaign.id, {
        name: name.trim(),
        offer: offer.trim(),
      })
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Campagne mise à jour")
        onOpenChange(false)
        router.refresh()
      }
    } catch {
      toast.error("Erreur lors de la mise à jour")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Modifier la campagne</DialogTitle>
            <DialogDescription>
              Mettez à jour le nom ou l&apos;offre de cette campagne.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nom de la campagne</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-offer">
                Que proposez-vous à vos clients ?
              </Label>
              <Textarea
                id="edit-offer"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                rows={3}
              />
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
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
