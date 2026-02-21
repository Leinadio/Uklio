"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import type { WizardState } from "@/lib/wizard-types"

const OPTIONAL_FIELDS = [
  "profilePhotoUrl",
  "headline",
  "bio",
  "location",
  "pastExperiences",
  "education",
  "skills",
  "languages",
  "services",
  "recentPosts",
  "mutualConnections",
  "connectionCount",
] as const

interface Props {
  state: WizardState
  dispatch: React.Dispatch<{
    type: "UPDATE_FIELD"
    field: keyof WizardState
    value: string
  }>
}

export function StepInfo({ state, dispatch }: Props) {
  function update(field: keyof WizardState, value: string) {
    dispatch({ type: "UPDATE_FIELD", field, value })
  }

  const filled = OPTIONAL_FIELDS.filter(
    (f) => state[f] && state[f] !== ""
  ).length
  const completeness = Math.round((filled / OPTIONAL_FIELDS.length) * 100)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations du prospect</CardTitle>
          <CardDescription>
            Renseignez les informations de votre prospect. Plus vous en
            fournissez, plus l&apos;IA sera pertinente.
          </CardDescription>
          <div className="flex items-center gap-3 pt-2">
            <Progress value={completeness} className="flex-1" />
            <span className="text-sm text-muted-foreground">
              Complétion : {completeness}%
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="font-medium">Informations obligatoires</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                value={state.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                placeholder="Marie"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                value={state.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                placeholder="Martin"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">URL du profil LinkedIn *</Label>
            <Input
              id="linkedinUrl"
              value={state.linkedinUrl}
              onChange={(e) => update("linkedinUrl", e.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPosition">Poste actuel *</Label>
              <Input
                id="currentPosition"
                value={state.currentPosition}
                onChange={(e) => update("currentPosition", e.target.value)}
                placeholder="Directrice Marketing"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentCompany">Entreprise actuelle *</Label>
              <Input
                id="currentCompany"
                value={state.currentCompany}
                onChange={(e) => update("currentCompany", e.target.value)}
                placeholder="TechCorp"
              />
            </div>
          </div>

          <Separator className="my-4" />

          <h3 className="font-medium">
            Informations complémentaires{" "}
            <span className="font-normal text-muted-foreground">
              (enrichissent les suggestions de l&apos;IA)
            </span>
          </h3>

          <div className="space-y-2">
            <Label htmlFor="headline">Titre / Headline LinkedIn</Label>
            <Input
              id="headline"
              value={state.headline}
              onChange={(e) => update("headline", e.target.value)}
              placeholder="Directrice Marketing | Growth | SaaS B2B"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Résumé / Bio (section « À propos »)</Label>
            <Textarea
              id="bio"
              value={state.bio}
              onChange={(e) => update("bio", e.target.value)}
              placeholder="Copiez-collez la section À propos du profil LinkedIn..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                value={state.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="Paris, France"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="connectionCount">Nombre de connexions</Label>
              <Input
                id="connectionCount"
                type="number"
                value={state.connectionCount}
                onChange={(e) => update("connectionCount", e.target.value)}
                placeholder="500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pastExperiences">Expériences passées</Label>
            <Textarea
              id="pastExperiences"
              value={state.pastExperiences}
              onChange={(e) => update("pastExperiences", e.target.value)}
              placeholder="Copiez-collez les expériences depuis LinkedIn..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Formations / Diplômes</Label>
            <Textarea
              id="education"
              value={state.education}
              onChange={(e) => update("education", e.target.value)}
              placeholder="Copiez-collez les formations depuis LinkedIn..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="skills">Compétences</Label>
              <Input
                id="skills"
                value={state.skills}
                onChange={(e) => update("skills", e.target.value)}
                placeholder="Marketing digital, SEO, Growth..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="languages">Langues</Label>
              <Input
                id="languages"
                value={state.languages}
                onChange={(e) => update("languages", e.target.value)}
                placeholder="Français, Anglais"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="services">Services proposés</Label>
            <Input
              id="services"
              value={state.services}
              onChange={(e) => update("services", e.target.value)}
              placeholder="Consulting, Formation, Audit..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recentPosts">5 derniers posts LinkedIn</Label>
            <Textarea
              id="recentPosts"
              value={state.recentPosts}
              onChange={(e) => update("recentPosts", e.target.value)}
              placeholder="Copiez-collez le contenu des 5 derniers posts du prospect..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mutualConnections">Connexions communes</Label>
            <Textarea
              id="mutualConnections"
              value={state.mutualConnections}
              onChange={(e) => update("mutualConnections", e.target.value)}
              placeholder="Jean Dupont (CEO chez TechCo), Marie Martin..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profilePhotoUrl">Photo de profil (URL)</Label>
            <Input
              id="profilePhotoUrl"
              value={state.profilePhotoUrl}
              onChange={(e) => update("profilePhotoUrl", e.target.value)}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
