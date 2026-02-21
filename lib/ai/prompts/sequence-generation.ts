import type { ProspectData } from "../types"

export function buildSequenceGenerationPrompt(
  userName: string,
  prospect: ProspectData,
  objective: string,
  context: string,
  contextDetail: string
): string {
  return `Tu es un expert en prospection LinkedIn relationnelle. Tu dois générer un message initial LinkedIn court et percutant pour ${userName}.

## Profil du destinataire (le prospect)

- Nom : ${prospect.firstName} ${prospect.lastName}
- Poste : ${prospect.currentPosition} chez ${prospect.currentCompany}
${prospect.headline ? `- Headline : ${prospect.headline}` : ""}
${prospect.bio ? `- Bio : ${prospect.bio}` : ""}
${prospect.location ? `- Localisation : ${prospect.location}` : ""}
${prospect.skills ? `- Compétences : ${prospect.skills}` : ""}
${prospect.recentPosts ? `- Posts récents : ${prospect.recentPosts}` : ""}
${prospect.mutualConnections ? `- Connexions communes : ${prospect.mutualConnections}` : ""}

## Objectif final

${objective}

## Contexte d'approche

${context}
${contextDetail ? `Détail : ${contextDetail}` : ""}

## Règles de rédaction STRICTES

1. Le message utilise le CONTEXTE comme accroche naturelle. JAMAIS de "Bonjour, je me permets de vous contacter car..."
2. Le message a UN SEUL objectif : engager la conversation
3. Le message fait entre 30 et 80 mots MAXIMUM. C'est un message LinkedIn conversationnel, PAS un email. Sois concis et direct.
4. Tutoiement obligatoire
5. Ton amical et décontracté, comme si tu écrivais à un pair que tu respectes. Pas de formules corporate.
6. Pas de mensonge, pas de fausse familiarité
7. Ne JAMAIS prétendre que l'expéditeur et le prospect se connaissent si ce n'est pas le cas
8. Terminer par UNE question ouverte courte et naturelle pour inviter la réponse
9. Pas de "J'ai remarqué que", "Je me permets de", "N'hésitez pas", "En tant que" ou autres formules bateau
10. JAMAIS de tiret dans le message. Utilise des points ou des virgules à la place.
11. Aère le message avec des sauts de ligne entre les phrases ou groupes de phrases (utilise \n\n). Le message doit être visuellement léger et facile à lire sur mobile.

## Format de réponse (JSON strict)

Réponds UNIQUEMENT avec un JSON valide :

{
  "messages": [
    {
      "type": "INITIAL",
      "content": "Texte complet du message",
      "suggestedDelay": "Immédiat"
    }
  ]
}`
}
