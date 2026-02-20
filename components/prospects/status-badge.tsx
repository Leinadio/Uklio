import { Badge } from "@/components/ui/badge"
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="secondary"
      className={cn("font-medium", STATUS_COLORS[status])}
    >
      {STATUS_LABELS[status] || status}
    </Badge>
  )
}
