import type { ProspectData } from "../types"

export function buildContextSuggestionPrompt(prospect: ProspectData, objective: string): string {
  const profileSummary = [
    `Nom : ${prospect.firstName} ${prospect.lastName}`,
    `Poste : ${prospect.currentPosition}`,
    `Entreprise : ${prospect.currentCompany}`,
    prospect.headline && `Headline : ${prospect.headline}`,
    prospect.bio && `Bio / À propos : ${prospect.bio}`,
    prospect.location && `Localisation : ${prospect.location}`,
    prospect.pastExperiences && `Expériences passées : ${prospect.pastExperiences}`,
    prospect.education && `Formation : ${prospect.education}`,
    prospect.skills && `Compétences : ${prospect.skills}`,
    prospect.services && `Services : ${prospect.services}`,
    prospect.recentPosts && `5 derniers posts LinkedIn : ${prospect.recentPosts}`,
    prospect.mutualConnections && `Connexions communes : ${prospect.mutualConnections}`,
  ]
    .filter(Boolean)
    .join("\n")

  return `Tu es un expert en prospection LinkedIn. Ton rôle est d'analyser le profil d'un prospect et de suggérer des CONTEXTES D'APPROCHE pertinents.

Un contexte d'approche, c'est un signal, un événement, un point commun ou une observation qui permet d'engager une conversation de façon naturelle (pas du spam).

## Profil du prospect

${profileSummary}

## Objectif de la conversation

${objective}

## Instructions

Analyse le profil ci-dessus et suggère entre 3 et 6 contextes d'approche pertinents, triés du plus pertinent au moins pertinent.

Exemples de contextes possibles :
- "Il publie activement sur [sujet]" (si des posts sont renseignés)
- "Vous avez [nom] en commun" (si des connexions communes existent)
- "Il recrute un(e) [poste]" (si ça apparaît dans les infos)
- "Nouvelle prise de poste" (si le poste semble récent)
- "Levée de fonds récente" (si mentionné)
- "Participant à [salon/conférence]" (si mentionné dans les posts)
- "Expert reconnu en [domaine]" (si nombreuses compétences/publications sur le sujet)

Si le profil est très peu renseigné (seulement nom, poste, entreprise), génère des suggestions plus génériques basées sur le poste et le secteur d'activité.

## Format de réponse (JSON strict)

Réponds UNIQUEMENT avec un JSON valide, sans texte avant ou après :

{
  "suggestions": [
    {
      "id": "1",
      "title": "Titre court du contexte",
      "description": "Explication en 1-2 phrases de pourquoi ce contexte est pertinent et comment l'utiliser.",
      "relevanceScore": 85
    }
  ]
}`
}
