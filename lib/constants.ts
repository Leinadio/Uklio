export const STATUS_LABELS: Record<string, string> = {
  NEW: "Nouveau",
  MESSAGE_READY: "Message prêt",
  IN_PROGRESS: "En cours",
  WAITING: "En attente",
  GOAL_REACHED: "Objectif atteint",
  CLOSED: "Clos",
}

export const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-gray-100 text-gray-700",
  MESSAGE_READY: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-blue-200 text-blue-800",
  WAITING: "bg-amber-100 text-amber-700",
  GOAL_REACHED: "bg-green-100 text-green-700",
  CLOSED: "bg-red-100 text-red-700",
}

export const OBJECTIVE_LABELS: Record<string, string> = {
  CALL: "Obtenir un appel",
  MEETING: "Obtenir un RDV",
  SELL: "Vendre",
  TESTIMONIAL: "Obtenir un témoignage",
}

export const MESSAGE_TYPE_LABELS: Record<string, string> = {
  INITIAL: "Message initial",
  FOLLOW_UP_1: "Relance 1",
  FOLLOW_UP_2: "Relance 2",
  FOLLOW_UP_3: "Relance 3",
  RESPONSE: "Réponse du prospect",
  AI_REPLY: "Message suggéré",
}

export const STEP_LABELS: Record<number, string> = {
  0: "Non commencé",
  1: "Message initial",
  2: "Relance 1",
  3: "Relance 2",
  4: "Relance 3",
}
