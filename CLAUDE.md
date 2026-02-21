# CLAUDE.md — Uklio

## Vision

Uklio est un SaaS de prospection LinkedIn intelligente qui privilégie la **qualité relationnelle** plutôt que le volume. Contrairement aux outils de mass outreach (Waalaxy, Lemlist, La Growth Machine), Uklio génère des **messages personnalisés pour chaque prospect individuellement**.

L'utilisateur ne cherche pas ses prospects dans Uklio. Il les trouve lui-même sur LinkedIn, puis utilise Uklio pour **engager et piloter une conversation personnalisée** avec chacun d'eux.

Uklio **prépare** les messages — l'utilisateur garde le contrôle total et envoie lui-même sur LinkedIn.

## Utilisateurs cibles

- **Freelances et consultants** qui prospectent eux-mêmes et pour qui chaque conversation compte
- **Fondateurs early-stage et startups** qui cherchent à valider une idée, trouver des beta-testeurs ou vendre un MVP
- **Commerciaux et SDR** qui veulent améliorer leur taux de conversion sur LinkedIn

## Informations générales

- **Langue de l'interface** : Français
- **Paiement** : Aucun pour l'instant. L'app est gratuite.
- **Landing page** : Aucune. L'utilisateur arrive directement sur la page de connexion.

---

## Parcours utilisateur

### Étape 1 — Inscription / Connexion

L'utilisateur arrive directement sur la page de connexion / inscription (email + mot de passe ou Google OAuth). Pas d'onboarding ni de profil professionnel à compléter — il accède immédiatement à l'application.

### Étape 2 — Création d'une campagne

Les campagnes organisent les prospects par thématique, cible ou objectif commercial. Chaque prospect appartient à une campagne.

À la création d'une campagne, l'utilisateur renseigne le nom, une description optionnelle, et l'objectif par défaut (CALL, MEETING, SELL, TESTIMONIAL).

Chaque campagne affiche un tableau : Prospect (nom + photo + poste) | Objectif | Statut (badge coloré) | Étape | Dernière action | Actions.

### Étape 3 — Ajout d'un prospect

**Via l'extension Chrome (recommandé) :** l'utilisateur est sur le profil LinkedIn du prospect, clique sur l'extension, et toutes les données sont scrapées automatiquement.

**Manuellement :** l'utilisateur renseigne les informations dans l'app.

**Informations obligatoires :** prénom, nom, URL LinkedIn, poste actuel, entreprise actuelle.

**Informations optionnelles (enrichissent l'IA) :** photo de profil, headline, bio/à propos, localisation, expériences passées, formations, compétences, langues, services, 5 derniers posts LinkedIn, connexions communes, nombre de connexions.

Un indicateur « Niveau de complétion du profil » encourage l'utilisateur à remplir un maximum. Plus il y a de données, plus l'IA est pertinente.

### Étape 4 — Objectif et signal

**Objectif :** l'objectif de la campagne est pré-sélectionné mais modifiable prospect par prospect. 4 choix : CALL, MEETING, SELL, TESTIMONIAL.

**Signal (optionnel) :** un champ texte avec le label **"Il/elle vient de..."** et des exemples en placeholder : *"commenter mon post sur le SEO local", "changer de poste", "liker mon article sur Shopify"*.

Le signal décrit une **action récente du prospect** qui sert de point d'accroche pour le message. C'est ce qui fait qu'un message Uklio ne ressemble pas à du spam.

- **Signal rempli** → l'IA génère un message personnalisé basé sur cette action concrète. Qualité maximale.
- **Signal vide** → l'IA génère le meilleur message possible à partir des données du profil.

### Étape 5 — Génération du premier message

L'IA génère **un seul message** : le message initial. Pas de séquence pré-générée.

L'IA choisit automatiquement la meilleure stratégie d'approche (demande d'avis expert, échange de valeur, félicitation + transition, etc.) en fonction de l'objectif, du signal et des données du profil. L'utilisateur ne voit pas ce choix — c'est interne à l'IA.

Le message affiché dispose de : texte complet, bouton copier, bouton régénérer, zone d'édition.

### Étape 6 — Exécution et suivi conversationnel

**Workflow :**
1. L'utilisateur copie le message depuis Uklio et l'envoie sur LinkedIn
2. Il clique « Message envoyé » pour l'horodater
3. Quand le prospect répond, il copie-colle la réponse dans Uklio
4. L'IA analyse la réponse et génère le **message suivant adapté au contexte réel de la conversation**
5. Si pas de réponse dans le délai, Uklio notifie et propose une relance

**Les messages suivants sont toujours générés un par un**, en tenant compte de l'historique complet de la conversation. Jamais de séquence pré-générée.

**Interface en deux parties :**
- **Gauche (60%)** — Timeline chronologique : messages utilisateur (bleu, droite) + réponses prospect (gris, gauche), horodatage, badges de statut
- **Droite (40%)** — Assistant IA : rappel objectif + signal, zone de collage de la réponse, message suivant suggéré, notifications de relance

### Étape 7 — Tableau de bord

**4 KPIs :** prospects actifs, taux de réponse, objectifs atteints, taux de conversion global.

**Tableau filtrable** par statut : Tous / En attente de réponse / Relance à envoyer / Objectif atteint / Clos. Les lignes « Relance à envoyer » sont mises en évidence.

**Notifications :** relance due, pas de réponse depuis 14 jours (suggestion de clôturer), réponse positive détectée.

---

## Arbre décisionnel des réponses

### Quand le prospect répond

| Type de réponse | Action de l'IA | Statut |
|----------------|---------------|--------|
| **Positive / curieuse** ("Oui, intéressant") | Message d'approfondissement vers l'objectif | En cours |
| **Tiède / évasive** ("Pourquoi pas", "Je verrai") | Réengage avec un élément concret de valeur | En cours |
| **Question** | Réponse intégrant la progression vers l'objectif | En cours |
| **Négative polie** ("Pas intéressé pour le moment") | Message de clôture élégant, porte ouverte | Clos |
| **Négative ferme** ("Non merci", "Arrêtez") | Remerciement bref et courtois | Clos, aucune relance |
| **Acceptation** ("OK pour un call", "Envoyez le lien") | Message de confirmation avec détails pratiques | Objectif atteint |

### Quand le prospect ne répond pas (silence)

- Moins de 3 relances envoyées → proposer la relance suivante après le délai. Chaque relance utilise un angle différent.
- 3 relances envoyées sans réponse → clôturer automatiquement. Aucun message supplémentaire.

---

## Statuts d'un prospect

| Statut | Description | Badge |
|--------|-------------|-------|
| `NEW` | Prospect ajouté, pas encore de message | Gris |
| `MESSAGE_READY` | Premier message généré, prêt à envoyer | Bleu |
| `IN_PROGRESS` | Conversation active, échanges en cours | Bleu foncé |
| `WAITING` | Message envoyé, en attente de réponse | Ambre/Orange |
| `GOAL_REACHED` | Le prospect a accepté l'objectif | Vert |
| `CLOSED` | Terminée (refus ou 3 relances sans réponse) | Rouge |

---

## Règles de l'IA (Mom Test)

Les messages suivent la méthode du Mom Test avec le framework "Vision / Cadrage / Faiblesse / Piédestal / Aide".

1. Jamais de message mensonger ou trompeur
2. Ne jamais prétendre que l'utilisateur et le prospect se connaissent si ce n'est pas le cas
3. Respecter les CGU de LinkedIn (pas de spam, pas de contenu commercial agressif)
4. JAMAIS parler du produit, service ou offre de l'utilisateur dans les messages (Mom Test)
5. Chaque relance apporte un élément nouveau, jamais un simple « je me permets de revenir vers vous »
6. Messages de 310 à 320 caractères exactement (espaces compris)
7. Structure : 2 paragraphes + 1 question finale qui invite à répondre
8. Garder l'objectif final en tête mais ne jamais le mentionner dans le message
9. Prendre en compte tout l'historique de la conversation pour chaque nouveau message
10. Le message commence toujours par "Salut [prénom]"
11. Chaque message a un seul objectif intermédiaire (engager → approfondir → proposer → conclure)
12. La progression vers l'objectif est graduelle et naturelle
13. Tutoiement obligatoire, ton amical, registre familier/oral et conversationnel
14. Ne JAMAIS toucher à l'ego du prospect ni faire ressortir ses faiblesses
15. Montrer la propre vulnérabilité/difficulté de l'expéditeur pour justifier la demande d'aide
16. Mettre le prospect sur un piédestal en tant qu'expert (Piédestal + Aide)
17. JAMAIS de tiret dans les messages
18. Pas de formules bateau : "J'ai remarqué que", "Je me permets de", "N'hésitez pas", "En tant que", "J'ai vu que"

## Stratégies d'approche (internes à l'IA)

L'IA choisit automatiquement la meilleure stratégie sans intervention de l'utilisateur :

- **Demande d'avis expert** — solliciter l'expertise du prospect pour créer de la réciprocité
- **Échange de valeur** — partager une ressource utile avant de proposer quoi que ce soit
- **Mise en relation** — s'appuyer sur une connexion commune ou un événement partagé
- **Félicitation + transition** — féliciter pour un accomplissement puis pivoter naturellement
- **Approche collaborative** — proposer une collaboration mutuellement bénéfique

## Limites du système

- Maximum 3 relances par prospect — au-delà, clôture automatique
- Uklio prépare les messages mais ne les envoie pas (contrôle total de l'utilisateur)
- L'IA a besoin au minimum de : prénom, nom, poste et entreprise du prospect
- Les messages sont toujours générés un par un, jamais en séquence pré-générée

## Extension Chrome

Repo séparé `uklio-extension`. L'extension fonctionne sur les pages profil LinkedIn. Elle scrape automatiquement les données du profil et les envoie directement dans Uklio, évitant la saisie manuelle.
