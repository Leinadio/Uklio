"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { updateProfile } from "@/actions/onboarding"
import { TONE_LABELS } from "@/lib/constants"
import { Loader2, Save } from "lucide-react"

interface ProfileData {
  firstName: string
  lastName: string
  role: string
  company: string
  offerDescription: string
  idealTarget: string
  tone: string
  linkedinUrl: string
}

export function SettingsForm({ initialData }: { initialData: ProfileData }) {
  const [data, setData] = useState<ProfileData>(initialData)
  const [loading, setLoading] = useState(false)

  function update(field: keyof ProfileData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })

    const result = await updateProfile(formData)
    setLoading(false)

    if (result?.error) {
      toast.error("Veuillez corriger les erreurs")
      return
    }

    toast.success("Profil mis à jour")
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Profil professionnel</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={data.firstName}
                onChange={(e) => update("firstName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={data.lastName}
                onChange={(e) => update("lastName", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Poste / Rôle</Label>
              <Input
                id="role"
                value={data.role}
                onChange={(e) => update("role", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Entreprise</Label>
              <Input
                id="company"
                value={data.company}
                onChange={(e) => update("company", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="offerDescription">Description de l&apos;offre</Label>
            <Textarea
              id="offerDescription"
              value={data.offerDescription}
              onChange={(e) => update("offerDescription", e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idealTarget">Cible idéale</Label>
            <Textarea
              id="idealTarget"
              value={data.idealTarget}
              onChange={(e) => update("idealTarget", e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tone">Ton souhaité</Label>
              <Select
                value={data.tone}
                onValueChange={(v) => update("tone", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TONE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">URL LinkedIn</Label>
              <Input
                id="linkedinUrl"
                value={data.linkedinUrl}
                onChange={(e) => update("linkedinUrl", e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Enregistrer
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
