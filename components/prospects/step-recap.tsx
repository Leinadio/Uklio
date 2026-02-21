import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { User, Target, MessageSquare } from "lucide-react"
import type { WizardState } from "@/lib/wizard-types"

export function StepRecap({ state }: { state: WizardState }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Récapitulatif</CardTitle>
        <CardDescription>
          Vérifiez les informations avant de générer le message initial.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
            <User className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Prospect</p>
            <p className="font-medium">
              {state.firstName} {state.lastName}
            </p>
            <p className="text-sm text-muted-foreground">
              {state.currentPosition} chez {state.currentCompany}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Objectif</p>
            <p className="font-medium">
              {state.objective}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Contexte</p>
            <p className="font-medium">{state.selectedContext}</p>
            {state.contextDetail && (
              <p className="text-sm text-muted-foreground">
                {state.contextDetail}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
