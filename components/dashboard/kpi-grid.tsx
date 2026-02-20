import { Card, CardContent } from "@/components/ui/card"
import { Users, MessageCircle, Target, TrendingUp } from "lucide-react"

interface Props {
  activeProspects: number
  responseRate: number
  goalsReached: number
  conversionRate: number
}

const kpis = [
  {
    key: "activeProspects",
    label: "Prospects actifs",
    icon: Users,
    format: (v: number) => v.toString(),
  },
  {
    key: "responseRate",
    label: "Taux de réponse",
    icon: MessageCircle,
    format: (v: number) => `${v}%`,
  },
  {
    key: "goalsReached",
    label: "Objectifs atteints",
    icon: Target,
    format: (v: number) => v.toString(),
  },
  {
    key: "conversionRate",
    label: "Taux de conversion",
    icon: TrendingUp,
    format: (v: number) => `${v}%`,
  },
] as const

export function KpiGrid(props: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        const value = props[kpi.key]
        return (
          <Card key={kpi.key}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{kpi.format(value)}</p>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
