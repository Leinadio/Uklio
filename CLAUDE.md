# CLAUDE.md — Uklio

## Vision

Uklio est un SaaS de prospection LinkedIn intelligente qui privilégie la **qualité relationnelle** plutôt que le volume. Contrairement aux outils de mass outreach (Waalaxy, Lemlist, La Growth Machine), Uklio construit une **stratégie conversationnelle sur mesure pour chaque prospect individuellement**.

L'utilisateur ne cherche pas ses prospects dans Uklio. Il les trouve lui-même sur LinkedIn, puis utilise Uklio pour **construire et piloter une relation personnalisée** avec chacun d'eux.

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

## Framework central : Contexte → Stratégie → Objectif

Tout le produit repose sur ce framework en trois piliers :

### Contexte

Ce que l'utilisateur observe chez le prospect — un signal, un événement, un point commun qui sert de point d'accroche naturel. C'est ce qui fait qu'un message Uklio ne ressemble pas à du spam.

Exemples : le prospect recrute, connexion commune, a liké un post, participe à un salon, publie activement sur LinkedIn, annonce une levée de fonds, etc.

### Stratégie

L'approche relationnelle pour engager et faire progresser la conversation. Ce n'est pas un template, c'est une méthode :
- **Demande d'avis expert** — solliciter l'expertise du prospect pour créer de la réciprocité
- **Échange de valeur** — partager une ressource utile avant de proposer quoi que ce soit
- **Mise en relation** — s'appuyer sur une connexion commune ou un événement partagé
- **Félicitation + transition** — féliciter pour un accomplissement puis pivoter naturellement
- **Approche collaborative** — proposer une collaboration mutuellement bénéfique

### Objectif final

Le résultat concret visé à l'issue de la séquence :
- **Obtenir un appel / visioconférence** (`CALL`)
- **Obtenir un rendez-vous physique** (`MEETING`)
- **Vendre un produit ou service** (`SELL`)
- **Obtenir un témoignage** (`TESTIMONIAL`)

---

## Parcours utilisateur complet

### Étape 1 — Inscription / Connexion

L'utilisateur arrive directement sur la page de connexion / inscription (email + mot de passe ou Google OAuth). Pas d'onboarding ni de profil professionnel à compléter — il accède immédiatement à l'application.

### Étape 2 — Création d'une campagne

Les campagnes organisent les prospects par thématique, cible ou objectif commercial. Chaque prospect appartient à une campagne et a sa propre stratégie indépendante.

À la création d'une campagne, le SaaS demande **en premier** l'objectif final (CALL, MEETING, SELL, TESTIMONIAL). L'utilisateur renseigne ensuite le nom et une description optionnelle.

Chaque campagne affiche un tableau : Prospect (nom + photo + poste) | Objectif | Statut (badge coloré) | Étape | Dernière action | Actions.

### Étape 3 — Ajout d'un prospect (wizard multi-étapes)

**Informations obligatoires :** prénom, nom, URL LinkedIn, poste actuel, entreprise actuelle.

**Informations optionnelles (enrichissent l'IA) :** photo de profil, headline, bio/à propos, localisation, expériences passées, formations, compétences, langues, services, 5 derniers posts LinkedIn, connexions communes, nombre de connexions.

Un indicateur « Niveau de complétion du profil » encourage l'utilisateur à remplir un maximum. Plus il y a de données, plus l'IA est pertinente.

L'extension Chrome peut remplir automatiquement tous ces champs en scrapant le profil LinkedIn.

### Étape 4 — Choix de l'objectif final

L'objectif de la campagne est pré-sélectionné mais modifiable prospect par prospect. 4 cartes cliquables (CALL, MEETING, SELL, TESTIMONIAL). L'objectif influence le ton, la structure et la progressivité de la séquence.

### Étape 5 — Sélection du contexte

L'IA suggère automatiquement des contextes pertinents en fonction des données du profil, triés par score de pertinence. Si aucun ne convient, l'utilisateur peut décrire un contexte libre.

Si le profil est très peu renseigné, l'IA génère des suggestions génériques basées sur le poste et le secteur.

### Étape 6 — Choix de la stratégie

L'IA propose 2 à 4 stratégies adaptées (objectif + contexte + profil). Chaque stratégie affiche : nom, description, nombre d'étapes, indicateur de ton.

Récapitulatif complet avant génération : prospect + objectif + contexte + stratégie. L'utilisateur valide ou revient en arrière.

### Étape 7 — Génération de la séquence de messages

L'IA génère une séquence complète :

| Étape | Type | Délai suggéré |
|-------|------|---------------|
| 1 | Message initial | Immédiat |
| 2 | Relance 1 | 3-5 jours |
| 3 | Relance 2 | 5-7 jours |
| 4 | Relance 3 (finale) | 7-10 jours |

Chaque message a : texte complet, bouton copier, bouton régénérer, zone d'édition, délai suggéré.

### Étape 8 — Exécution et suivi conversationnel

**Workflow :**
1. L'utilisateur copie le message depuis Uklio et l'envoie sur LinkedIn
2. Il clique « Message envoyé » pour l'horodater
3. Quand le prospect répond, il copie-colle la réponse dans Uklio
4. L'IA analyse la réponse et génère le message suivant adapté
5. Si pas de réponse dans le délai, Uklio notifie et propose la relance

**Interface en deux parties :**
- **Gauche (60%)** — Timeline chronologique : messages utilisateur (bleu, droite) + réponses prospect (gris, gauche), horodatage, badges de statut
- **Droite (40%)** — Assistant IA : rappel objectif/contexte/stratégie, zone de collage de la réponse, message suivant suggéré, notifications de relance

### Étape 9 — Tableau de bord

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
| `NEW` | Prospect ajouté, pas encore de séquence | Gris |
| `SEQUENCE_READY` | Séquence générée, premier message prêt | Bleu |
| `IN_PROGRESS` | Conversation active, échanges en cours | Bleu foncé |
| `WAITING` | Message envoyé, en attente de réponse | Ambre/Orange |
| `GOAL_REACHED` | Le prospect a accepté l'objectif | Vert |
| `CLOSED` | Terminée (refus ou 3 relances sans réponse) | Rouge |

---

## Règles de l'IA

1. Jamais de message mensonger ou trompeur
2. Ne jamais prétendre que l'utilisateur et le prospect se connaissent si ce n'est pas le cas
3. Respecter les CGU de LinkedIn (pas de spam, pas de contenu commercial agressif)
4. Privilégier les questions ouvertes aux affirmations dans les premiers messages
5. Chaque relance apporte un élément nouveau — jamais un simple « je me permets de revenir vers vous »
6. Messages courts : 50-150 mots maximum (format LinkedIn)
7. Garder l'objectif final en tête mais ne jamais forcer
8. Prendre en compte tout l'historique de la conversation pour chaque nouveau message
9. Le message initial utilise le contexte comme accroche naturelle — jamais de « Bonjour, je me permets de vous contacter car... »
10. Chaque message a un seul objectif intermédiaire (engager → approfondir → proposer → conclure)
11. La progression vers l'objectif est graduelle et naturelle
12. Vouvoiement par défaut, sauf ton « décontracté » ou « amical »

## Limites du système

- Maximum 3 relances par prospect — au-delà, clôture automatique
- Uklio prépare les messages mais ne les envoie pas (contrôle total de l'utilisateur)
- L'IA a besoin au minimum de : prénom, nom, poste et entreprise du prospect

## Extension Chrome

Repo séparé `uklio-extension`. L'extension scrape automatiquement les profils LinkedIn et envoie les données directement dans Uklio, évitant la saisie manuelle à l'étape 3.
