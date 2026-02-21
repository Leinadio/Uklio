import type { ProspectData } from "../types"

interface Message {
  type: string
  content: string
  status: string
}

export function buildResponseAnalysisPrompt(
  userName: string,
  prospect: ProspectData,
  objective: string,
  context: string,
  _strategy: string,
  conversationHistory: Message[],
  prospectResponse: string
): string {
  const historyText = conversationHistory
    .map((m) => {
      const sender =
        m.type === "RESPONSE" ? prospect.firstName : userName
      return `[${sender}] : ${m.content}`
    })
    .join("\n\n")

  return `Tu es un expert en prospection LinkedIn relationnelle. Tu dois analyser la réponse d'un prospect et générer le message suivant.

## Profil du prospect

- Nom : ${prospect.firstName} ${prospect.lastName}
- Poste : ${prospect.currentPosition} chez ${prospect.currentCompany}
${prospect.headline ? `- Headline : ${prospect.headline}` : ""}

## Contexte de la conversation

- Objectif final : ${objective}
- Contexte d'approche : ${context}

## Historique de la conversation

${historyText}

## Dernière réponse du prospect

${prospectResponse}

## Arbre décisionnel

Analyse la réponse du prospect et classe-la dans une de ces catégories :

1. **positive** (ex : "Oui, intéressant, dis-m'en plus")
   → Génère un message d'approfondissement qui avance vers l'objectif
   → Statut suggéré : IN_PROGRESS

2. **warm** (ex : "Pourquoi pas", "Je verrai")
   → Génère un message qui réengage avec un élément concret de valeur
   → Statut suggéré : IN_PROGRESS

3. **question** (ex : le prospect pose une question)
   → Génère une réponse à la question qui intègre la progression vers l'objectif
   → Statut suggéré : IN_PROGRESS

4. **negative_polite** (ex : "Pas intéressé pour le moment")
   → Génère un message de clôture élégant qui laisse la porte ouverte
   → Statut suggéré : CLOSED

5. **negative_firm** (ex : "Non merci", "Arrête")
   → Génère un message de remerciement bref et courtois
   → Statut suggéré : CLOSED

6. **acceptance** (ex : "OK pour un call", "Envoie-moi le lien")
   → Génère un message de confirmation avec détails pratiques
   → Statut suggéré : GOAL_REACHED

## Règles

- Le message fait entre 30 et 80 mots. Concis et conversationnel.
- Tutoiement obligatoire
- Ton amical et décontracté, comme un pair. Pas de formules corporate.
- Le ton reste cohérent avec la conversation
- Prends en compte TOUT l'historique
- Ne mens jamais
- Ne force jamais
- JAMAIS de tiret dans le message. Utilise des points ou des virgules.
- Aère le message avec des sauts de ligne entre les phrases (utilise \n\n). Visuellement léger pour mobile.

## Format de réponse (JSON strict)

{
  "sentiment": "positive|warm|question|negative_polite|negative_firm|acceptance",
  "nextMessage": "Texte complet du prochain message à envoyer",
  "suggestedStatus": "IN_PROGRESS|CLOSED|GOAL_REACHED",
  "reasoning": "Explication en 1-2 phrases de pourquoi cette catégorie a été choisie"
}`
}
