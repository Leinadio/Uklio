import type { ProspectData } from "../types"

export function buildStrategySuggestionPrompt(
  prospect: ProspectData,
  objective: string,
  context: string,
  contextDetail: string
): string {
  return `Tu es un expert en prospection LinkedIn relationnelle. Ton rôle est de proposer des STRATÉGIES D'APPROCHE adaptées au prospect, à l'objectif et au contexte choisi.

Une stratégie, c'est une méthode conversationnelle — pas un template de message, mais une approche relationnelle pour engager et faire progresser la conversation naturellement vers l'objectif.

## Profil du prospect

- Nom : ${prospect.firstName} ${prospect.lastName}
- Poste : ${prospect.currentPosition} chez ${prospect.currentCompany}
${prospect.headline ? `- Headline : ${prospect.headline}` : ""}
${prospect.bio ? `- Bio : ${prospect.bio}` : ""}
${prospect.skills ? `- Compétences : ${prospect.skills}` : ""}
${prospect.recentPosts ? `- Posts récents : ${prospect.recentPosts}` : ""}

## Objectif final

${objective}

## Contexte d'approche choisi

${context}
${contextDetail ? `Détail : ${contextDetail}` : ""}

## Instructions

Propose entre 2 et 4 stratégies d'approche adaptées. Chaque stratégie doit avoir :
- Un nom clair et mémorable
- Une description en 2-3 phrases expliquant la méthode
- Le nombre d'étapes prévues (toujours 4 : message initial + 3 relances)
- Un indicateur de ton (PROFESSIONAL, CASUAL, EXPERT, ou FRIENDLY)

Exemples de stratégies :
- "L'approche expert" : Solliciter l'expertise du prospect pour créer réciprocité
- "L'échange de valeur" : Partager une ressource utile avant de proposer quoi que ce soit
- "La mise en relation" : S'appuyer sur une connexion commune pour établir la confiance
- "La félicitation + transition" : Féliciter puis pivoter naturellement vers la proposition
- "L'approche collaborative" : Proposer une collaboration mutuellement bénéfique

## Format de réponse (JSON strict)

Réponds UNIQUEMENT avec un JSON valide :

{
  "strategies": [
    {
      "id": "1",
      "name": "Nom de la stratégie",
      "description": "Description de la méthode en 2-3 phrases.",
      "steps": 4,
      "toneIndicator": "PROFESSIONAL"
    }
  ]
}`
}
