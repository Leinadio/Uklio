import type { ProspectData, UserProfile } from "../types"

export function buildSequenceGenerationPrompt(
  user: UserProfile,
  prospect: ProspectData,
  objective: string,
  context: string,
  contextDetail: string,
  strategy: string,
  strategyDetail: string
): string {
  return `Tu es un expert en prospection LinkedIn relationnelle. Tu dois générer une séquence complète de 4 messages LinkedIn pour ${user.firstName} ${user.lastName}.

## Profil de l'expéditeur (celui qui envoie les messages)

- Nom : ${user.firstName} ${user.lastName}
- Poste : ${user.role}
- Entreprise : ${user.company}
- Offre : ${user.offerDescription}
- Cible idéale : ${user.idealTarget}
- Ton souhaité : ${user.tone}
${user.linkedinUrl ? `- LinkedIn : ${user.linkedinUrl}` : ""}

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

## Stratégie choisie

${strategy}
${strategyDetail ? `Détail : ${strategyDetail}` : ""}

## Règles de rédaction STRICTES

1. Le message initial utilise le CONTEXTE comme accroche naturelle — JAMAIS de "Bonjour, je me permets de vous contacter car..."
2. Chaque message a UN SEUL objectif intermédiaire (engager → approfondir → proposer → conclure)
3. Le ton est cohérent avec le profil de l'expéditeur et la stratégie choisie
4. Les messages font entre 50 et 150 mots MAXIMUM (c'est LinkedIn, pas un email)
5. Chaque relance apporte de la VALEUR NOUVELLE — JAMAIS un simple "je me permets de revenir vers vous"
6. La progression vers l'objectif est graduelle et naturelle
7. Pas de mensonge, pas de fausse familiarité
8. Ne JAMAIS prétendre que l'expéditeur et le prospect se connaissent si ce n'est pas le cas
9. Vouvoiement par défaut, sauf si le ton est "CASUAL" ou "FRIENDLY" (dans ce cas, tutoiement)
10. Chaque message doit pouvoir fonctionner indépendamment (le prospect n'a peut-être pas lu le précédent)

## Structure de la séquence

| Étape | Type | Objectif intermédiaire | Délai |
|-------|------|----------------------|-------|
| 1 | Message initial | Engager la conversation | Immédiat |
| 2 | Relance 1 | Approfondir / relancer si pas de réponse | 3-5 jours |
| 3 | Relance 2 | Proposer plus directement | 5-7 jours |
| 4 | Relance 3 (finale) | Dernière tentative, laisser la porte ouverte | 7-10 jours |

## Format de réponse (JSON strict)

Réponds UNIQUEMENT avec un JSON valide :

{
  "messages": [
    {
      "type": "INITIAL",
      "content": "Texte complet du message",
      "suggestedDelay": "Immédiat"
    },
    {
      "type": "FOLLOW_UP_1",
      "content": "Texte complet de la relance 1",
      "suggestedDelay": "3-5 jours"
    },
    {
      "type": "FOLLOW_UP_2",
      "content": "Texte complet de la relance 2",
      "suggestedDelay": "5-7 jours"
    },
    {
      "type": "FOLLOW_UP_3",
      "content": "Texte complet de la relance 3",
      "suggestedDelay": "7-10 jours"
    }
  ]
}`
}
