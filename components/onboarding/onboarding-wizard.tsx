"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner"
import { saveOnboarding } from "@/actions/onboarding"
import { TONE_LABELS } from "@/lib/constants"
import { Loader2, HelpCircle, ArrowLeft, ArrowRight, Check } from "lucide-react"

interface OnboardingData {
  firstName: string
  lastName: string
  role: string
  company: string
  offerDescription: string
  idealTarget: string
  tone: string
  linkedinUrl: string
}

const defaultData: OnboardingData = {
  firstName: "",
  lastName: "",
  role: "",
  company: "",
  offerDescription: "",
  idealTarget: "",
  tone: "PROFESSIONAL",
  linkedinUrl: "",
}

const STEPS = [
  { title: "Identité", description: "Votre prénom et nom" },
  { title: "Professionnel", description: "Votre activité et offre" },
  { title: "Ciblage", description: "Votre cible et ton" },
  { title: "Récapitulatif", description: "Vérifiez vos informations" },
]

interface Props {
  initialData?: Partial<OnboardingData>
}

export function OnboardingWizard({ initialData }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({
    ...defaultData,
    ...initialData,
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  function update(field: keyof OnboardingData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  function canAdvance(): boolean {
    switch (step) {
      case 0:
        return !!data.firstName && !!data.lastName
      case 1:
        return !!data.role && !!data.company && !!data.offerDescription
      case 2:
        return !!data.idealTarget && !!data.tone
      default:
        return true
    }
  }

  async function handleSubmit() {
    setLoading(true)
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })

    const result = await saveOnboarding(formData)
    if (result?.error) {
      setErrors(result.error as Record<string, string[]>)
      toast.error("Veuillez corriger les erreurs")
      setLoading(false)
      return
    }
    // redirect happens server-side
  }

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Configurez votre profil</h1>
          <p className="text-muted-foreground">
            Ces informations permettent à l&apos;IA de personnaliser vos
            messages.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Progress value={progress} className="flex-1" />
            <span className="text-sm text-muted-foreground">
              {step + 1}/{STEPS.length}
            </span>
          </div>
          <div className="mt-2 flex gap-2">
            {STEPS.map((s, i) => (
              <span
                key={i}
                className={`text-xs ${
                  i <= step
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {s.title}
              </span>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{STEPS[step].title}</CardTitle>
            <CardDescription>{STEPS[step].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {step === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <InfoTooltip text="Utilisé pour signer vos messages." />
                  </div>
                  <Input
                    id="firstName"
                    value={data.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    placeholder="Jean"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName[0]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <InfoTooltip text="Utilisé pour signer vos messages." />
                  </div>
                  <Input
                    id="lastName"
                    value={data.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    placeholder="Dupont"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName[0]}</p>
                  )}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="role">Poste / Rôle</Label>
                    <InfoTooltip text="Positionne votre expertise dans les messages." />
                  </div>
                  <Input
                    id="role"
                    value={data.role}
                    onChange={(e) => update("role", e.target.value)}
                    placeholder="Consultant en marketing digital"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="company">Entreprise / Activité</Label>
                    <InfoTooltip text="Contextualise votre offre dans les messages." />
                  </div>
                  <Input
                    id="company"
                    value={data.company}
                    onChange={(e) => update("company", e.target.value)}
                    placeholder="Marketing Pro"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="offerDescription">
                      Description de votre offre
                    </Label>
                    <InfoTooltip text="L'IA comprend ce que vous vendez pour personnaliser les messages." />
                  </div>
                  <Textarea
                    id="offerDescription"
                    value={data.offerDescription}
                    onChange={(e) => update("offerDescription", e.target.value)}
                    placeholder="J'aide les PME à augmenter leur visibilité en ligne grâce au SEO et au content marketing..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="idealTarget">Cible idéale</Label>
                    <InfoTooltip text="L'IA adapte les suggestions en fonction de votre cible." />
                  </div>
                  <Textarea
                    id="idealTarget"
                    value={data.idealTarget}
                    onChange={(e) => update("idealTarget", e.target.value)}
                    placeholder="Dirigeants de PME B2B dans le secteur tech, 10-50 employés..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="tone">Ton souhaité</Label>
                    <InfoTooltip text="Définit le style rédactionnel de vos messages." />
                  </div>
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
                  <div className="flex items-center gap-2">
                    <Label htmlFor="linkedinUrl">
                      URL LinkedIn{" "}
                      <span className="text-muted-foreground">(optionnel)</span>
                    </Label>
                    <InfoTooltip text="Permet de personnaliser les accroches en référençant votre profil." />
                  </div>
                  <Input
                    id="linkedinUrl"
                    value={data.linkedinUrl}
                    onChange={(e) => update("linkedinUrl", e.target.value)}
                    placeholder="https://linkedin.com/in/votre-profil"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Prénom</p>
                    <p className="font-medium">{data.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p className="font-medium">{data.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Poste</p>
                    <p className="font-medium">{data.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Entreprise</p>
                    <p className="font-medium">{data.company}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Offre</p>
                  <p className="font-medium">{data.offerDescription}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cible idéale</p>
                  <p className="font-medium">{data.idealTarget}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Ton</p>
                    <p className="font-medium">
                      {TONE_LABELS[data.tone] || data.tone}
                    </p>
                  </div>
                  {data.linkedinUrl && (
                    <div>
                      <p className="text-sm text-muted-foreground">LinkedIn</p>
                      <p className="truncate font-medium">{data.linkedinUrl}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              {step > 0 ? (
                <Button
                  variant="outline"
                  onClick={() => setStep((s) => s - 1)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Précédent
                </Button>
              ) : (
                <div />
              )}

              {step < STEPS.length - 1 ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canAdvance()}
                >
                  Suivant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Terminer
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs text-sm">{text}</p>
      </TooltipContent>
    </Tooltip>
  )
}
