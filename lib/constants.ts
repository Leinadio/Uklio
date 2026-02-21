export const CONTEXT_OPTIONS = [
  { id: "recruiting", title: "Le prospect recrute", description: "Il recrute à un poste marketing ou commercial — signal d'activité et de croissance." },
  { id: "mutual", title: "Connexion commune", description: "Vous avez une connaissance en commun qui peut servir de point d'accroche naturel." },
  { id: "liked-post", title: "A liké ou commenté votre post", description: "Il a interagi avec un de vos contenus LinkedIn récemment." },
  { id: "networking", title: "Même club de réseautage", description: "Vous êtes dans le même réseau ou club de la même ville." },
  { id: "event", title: "A participé à un salon récemment", description: "Il était présent à un événement professionnel récent." },
  { id: "active-publisher", title: "Publie souvent sur LinkedIn", description: "Il est actif et publie régulièrement du contenu sur LinkedIn." },
  { id: "ai-comment", title: "A commenté un article sur l'IA", description: "Il s'intéresse à l'IA et a commenté un article ou post sur le sujet." },
  { id: "funding", title: "Levée de fonds annoncée", description: "Son entreprise vient d'annoncer une levée de fonds sur son profil." },
  { id: "speaker", title: "Fait des formations ou conférences", description: "Il intervient régulièrement comme formateur ou conférencier." },
  { id: "event-photo", title: "Photo lors d'un événement", description: "Il a publié une photo avec quelqu'un lors d'un événement récent." },
]

export const STATUS_LABELS: Record<string, string> = {
  NEW: "Nouveau",
  SEQUENCE_READY: "Séquence prête",
  IN_PROGRESS: "En cours",
  WAITING: "En attente",
  GOAL_REACHED: "Objectif atteint",
  CLOSED: "Clos",
}

export const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-gray-100 text-gray-700",
  SEQUENCE_READY: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-blue-200 text-blue-800",
  WAITING: "bg-amber-100 text-amber-700",
  GOAL_REACHED: "bg-green-100 text-green-700",
  CLOSED: "bg-red-100 text-red-700",
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
