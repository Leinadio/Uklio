# UKLIO — Spécification produit SaaS

## Vision produit

Uklio est un SaaS de prospection LinkedIn intelligente qui privilégie la **qualité relationnelle** plutôt que le volume. Contrairement aux outils de mass outreach (Waalaxy, Lemlist, La Growth Machine) qui envoient des messages en masse avec une personnalisation superficielle, Uklio construit une **stratégie conversationnelle sur mesure pour chaque prospect individuellement**.

L'utilisateur ne cherche pas ses prospects dans Uklio. Il les trouve lui-même sur LinkedIn, puis utilise Uklio pour **construire et piloter une relation personnalisée** avec chacun d'eux.

Uklio **prépare** les messages — l'utilisateur garde le contrôle total et envoie lui-même sur LinkedIn.

---

## Informations générales

- **Langue de l'interface** : Français
- **Langue du code** : Anglais (noms de variables, composants, fonctions)
- **Paiement** : Aucun pour l'instant. Pas de Stripe, pas de page pricing. L'app est gratuite.
- **Landing page** : Aucune. L'utilisateur arrive directement sur la page de connexion.
- **Stack technique** : Next.js (App Router), Prisma + Supabase, Tailwind CSS + shadcn/ui, Better-Auth, API Anthropic (Claude)

---

## Utilisateurs cibles

- **Freelances et consultants** qui prospectent eux-mêmes et pour qui chaque conversation compte
- **Fondateurs early-stage et startups** qui cherchent à valider une idée, trouver des beta-testeurs ou vendre un MVP
- **Commerciaux et SDR en entreprise** qui veulent améliorer leur taux de conversion sur LinkedIn

---

## Framework central : Contexte → Stratégie → Objectif

Tout le produit repose sur ce framework en trois piliers :

### Contexte

Ce que l'utilisateur observe chez le prospect — un signal, un événement, un point commun qui sert de point d'accroche naturel pour engager la conversation. C'est ce qui fait qu'un message Uklio ne ressemble pas à du spam.

Exemples de contextes :
- Le prospect recrute à un poste marketing ou commercial
- L'utilisateur et le prospect ont une connaissance commune
- Le prospect a liké ou commenté un post de l'utilisateur
- Le prospect est dans un club de réseautage de la même ville
- Le prospect a participé à un salon récemment
- Le prospect publie souvent sur LinkedIn
- Le prospect a commenté un article sur l'IA
- Le prospect annonce une levée de fonds sur son profil
- Le prospect fait régulièrement des formations et des conférences
- Le prospect a publié une photo avec quelqu'un lors d'un événement

### Stratégie

L'approche relationnelle utilisée pour engager la conversation et la faire progresser naturellement vers l'objectif. Ce n'est pas un template de message, c'est une méthode de conversation.

Exemples de stratégies :
- **Demande d'avis expert** : Solliciter l'expertise du prospect sur un sujet lié à l'offre de l'utilisateur pour créer de la réciprocité et de la valeur
- **Échange de valeur** : Partager une ressource utile (article, outil, donnée) en lien avec l'activité du prospect avant de proposer quoi que ce soit
- **Mise en relation** : S'appuyer sur une connexion commune ou un événement partagé pour établir la confiance
- **Félicitation + transition** : Féliciter le prospect pour un accomplissement récent puis pivoter naturellement vers la proposition
- **Approche collaborative** : Proposer une collaboration ou un échange de connaissances mutuellement bénéfique

### Objectif final

Le résultat concret visé à l'issue de la séquence de messages. Quatre objectifs possibles :
- **Obtenir un appel / visioconférence** — planifier un échange vocal ou vidéo
- **Obtenir un rendez-vous physique** — décrocher une rencontre en personne
- **Vendre un produit ou service** — amener le prospect à passer commande ou signer
- **Obtenir un témoignage** — convaincre le prospect de tester le produit et fournir un retour d'expérience

---

## Parcours utilisateur complet

### Étape 1 — Inscription et profil professionnel

L'utilisateur arrive directement sur la page de connexion / inscription. Il crée un compte avec email + mot de passe (ou via Google OAuth).

Après inscription, il accède à un écran de configuration de son profil professionnel. Ces informations servent à l'IA pour personnaliser tous les messages générés :

- **Prénom et nom** → signature et ton des messages
- **Poste / rôle** → positionnement dans les messages
- **Entreprise / activité** → contextualisation de l'offre
- **Description de l'offre** → l'IA comprend ce que l'utilisateur vend ou propose
- **Cible idéale** → pertinence des suggestions
- **Ton souhaité** (sélection parmi : professionnel, décontracté, expert, amical) → style rédactionnel des messages
- **URL LinkedIn de l'utilisateur** (optionnel) → référence pour personnaliser les accroches

Un assistant pas-à-pas guide l'utilisateur à travers ces champs. Chaque champ a une infobulle expliquant pourquoi cette information est utile. L'utilisateur peut modifier ces informations à tout moment depuis les paramètres.

---

### Étape 2 — Création de listes de prospects

Les listes permettent d'organiser les prospects par campagne, thématique ou priorité. Chaque prospect appartient à une liste et a sa propre stratégie indépendante.

Pour créer une liste, l'utilisateur clique sur « + Nouvelle liste » et renseigne :
- **Nom de la liste** (ex : « Prospects SaaS RH », « Beta-testeurs MVP »)
- **Description** (optionnel) — rappel de l'objectif de cette liste
- **Objectif par défaut** (optionnel) — pré-sélectionne l'objectif final pour tous les prospects ajoutés à cette liste

Chaque liste affiche un tableau avec les colonnes suivantes :
- **Prospect** : nom + photo + poste
- **Objectif** : l'objectif final choisi pour ce prospect
- **Statut** : badge coloré (Nouveau / Séquence prête / En cours / En attente / Objectif atteint / Clos)
- **Étape** : où en est la conversation (Message 1, Relance 1, 2, 3)
- **Dernière action** : date et nature de la dernière interaction
- **Actions** : boutons Voir la conversation / Supprimer

---

### Étape 3 — Ajout d'un prospect

C'est un wizard multi-étapes qui guide l'utilisateur de l'ajout du prospect à la génération de la séquence.

#### Étape 3a — Informations du prospect

L'utilisateur remplit un formulaire avec les informations du prospect :

**Informations principales (obligatoires) :**
- Prénom
- Nom
- URL du profil LinkedIn (comme référence/lien)
- Poste actuel
- Entreprise actuelle

**Informations complémentaires (optionnelles mais enrichissent les suggestions de l'IA) :**
- Photo de profil (upload ou URL)
- Titre / headline LinkedIn
- Résumé / bio (l'utilisateur peut copier-coller la section "À propos" depuis LinkedIn)
- Localisation
- Expériences passées (champ texte libre — l'utilisateur copie-colle depuis LinkedIn)
- Formations / diplômes (champ texte libre)
- Compétences (champ texte libre ou tags)
- Langues
- Services proposés
- 5 derniers posts LinkedIn (champ texte libre — l'utilisateur copie-colle le contenu des posts)
- Connexions communes (champ texte libre)
- Nombre de connexions / abonnés

Plus l'utilisateur remplit de champs, plus l'IA sera pertinente dans ses suggestions de contextes et de stratégies. Un indicateur visuel « Niveau de complétion du profil » encourage l'utilisateur à remplir un maximum.

**Note importante pour le développement :** Ce formulaire est conçu pour être rempli manuellement dans cette V1. Dans une V2, une extension Chrome viendra remplir automatiquement tous ces champs en extrayant les données directement depuis la page LinkedIn du prospect. Il faut donc prévoir une **API endpoint dédiée** (`POST /api/prospects/from-extension`) qui accepte toutes ces données en JSON pour que l'extension puisse les envoyer directement. Le formulaire et l'endpoint doivent accepter exactement les mêmes champs.

Après avoir rempli le formulaire, l'utilisateur sélectionne la liste dans laquelle ajouter le prospect, puis clique sur « Continuer → Définir l'objectif ».

---

### Étape 4 — Choix de l'objectif final

L'utilisateur choisit parmi quatre objectifs, présentés sous forme de cartes cliquables :

- **Obtenir un appel / visioconférence** — Planifier un échange vocal ou vidéo pour présenter son offre ou qualifier le prospect
- **Obtenir un rendez-vous physique** — Décrocher une rencontre en personne pour approfondir la relation
- **Vendre un produit ou service** — Amener le prospect à passer commande ou signer directement via l'échange LinkedIn
- **Obtenir un témoignage** — Convaincre le prospect de tester le produit et de fournir un retour d'expérience

Si la liste a un objectif par défaut, il est pré-sélectionné mais modifiable.

L'objectif influence directement le ton, la structure et la progressivité de la séquence générée par l'IA.

---

### Étape 5 — Sélection du contexte

En fonction des données du profil du prospect renseignées à l'étape 3, **l'IA suggère automatiquement des contextes pertinents**. Chaque suggestion est présentée sous forme de carte cliquable avec un titre et une brève explication. Les suggestions sont triées par score de pertinence.

Exemples de contextes que l'IA peut suggérer :
- « Il publie activement sur [sujet] » (si des posts ont été renseignés)
- « Vous avez [X] en commun » (si des connexions communes ont été renseignées)
- « Il recrute un(e) [poste] » (si ça apparaît dans les infos)
- « Nouvelle prise de poste » (si le poste actuel est récent)
- « Levée de fonds récente » (si mentionné dans la bio ou les posts)
- « Participant à [salon/conférence] » (si mentionné dans les posts)

Si aucune suggestion ne convient, l'utilisateur peut sélectionner **« Autre contexte »** et décrire librement la situation dans un champ texte. Exemples :
- « J'ai vu qu'il a liké mon post sur l'automatisation marketing »
- « Il est dans le même club de réseautage que moi à Lyon »
- « Il a publié une photo avec mon associé John lors d'un lancement »

Le contexte est l'élément clé de personnalisation. C'est ce qui crée une accroche naturelle et crédible dans le premier message.

**Si le profil du prospect est très peu renseigné** (seulement nom, poste, entreprise), l'IA génère des suggestions plus génériques basées sur le poste et le secteur, et encourage l'utilisateur à compléter le profil ou à utiliser un contexte personnalisé.

---

### Étape 6 — Choix de la stratégie

En combinant l'objectif final, le contexte sélectionné et le profil du prospect, **l'IA propose 2 à 4 stratégies adaptées**. Chaque stratégie est présentée sous forme de carte avec :
- Un **nom clair** (ex : « L'approche expert »)
- Une **description** de la méthode en 2-3 phrases
- Le **nombre d'étapes** prévues
- Un **indicateur de ton** (professionnel, décontracté, etc.)

Avant de générer la séquence, un **récapitulatif complet** s'affiche :
- Prospect : [Prénom Nom], [Poste] chez [Entreprise]
- Objectif : [objectif choisi]
- Contexte : [contexte choisi]
- Stratégie : [stratégie choisie]

L'utilisateur valide avec « Générer la séquence » ou revient en arrière pour modifier ses choix.

---

### Étape 7 — Génération de la séquence de messages

L'IA génère une séquence complète composée de :

| Étape | Type | Déclencheur | Délai suggéré |
|-------|------|-------------|---------------|
| 1 | Message initial | L'utilisateur décide d'envoyer | Immédiat |
| 2 | Relance 1 | Pas de réponse après le message initial | 3-5 jours |
| 3 | Relance 2 | Pas de réponse après la relance 1 | 5-7 jours |
| 4 | Relance 3 (finale) | Pas de réponse après la relance 2 | 7-10 jours |

Chaque message est affiché dans une carte distincte avec :
- Le **texte complet** du message, prêt à être copié
- Un bouton **« Copier le message »**
- Un bouton **« Régénérer »** pour obtenir une variante
- Un **champ d'édition** pour modifier le texte manuellement avant envoi
- Le **délai suggéré** avant envoi

#### Principes de rédaction de l'IA

1. Le message initial utilise le contexte comme accroche naturelle — **JAMAIS** de « Bonjour, je me permets de vous contacter car... »
2. Chaque message a un seul objectif intermédiaire (engager → approfondir → proposer → conclure)
3. Le ton est cohérent avec le profil de l'utilisateur et la stratégie choisie
4. Les messages sont courts : **50-150 mots maximum** (c'est LinkedIn)
5. Chaque relance apporte de la valeur nouvelle — **JAMAIS** un simple « je me permets de revenir vers vous »
6. La progression vers l'objectif est graduelle et naturelle
7. Pas de mensonge, pas de fausse familiarité
8. Ne jamais prétendre que l'utilisateur et le prospect se connaissent si ce n'est pas le cas
9. Vouvoiement par défaut, sauf si le ton choisi est « décontracté » ou « amical »

---

### Étape 8 — Exécution et suivi conversationnel

C'est le cœur de l'expérience Uklio. L'écran de conversation fonctionne comme un assistant en temps réel.

#### Workflow

1. L'utilisateur **copie** le Message 1 depuis Uklio et l'envoie sur LinkedIn
2. Il revient dans Uklio et clique sur **« Message envoyé »** pour l'horodater
3. Quand le prospect répond, l'utilisateur **copie-colle la réponse** du prospect dans Uklio
4. L'IA **analyse la réponse** et **génère le message suivant** adapté
5. Si le prospect ne répond pas dans le délai, Uklio **notifie l'utilisateur** et propose la relance prévue

#### Interface en deux parties

**Partie gauche — Historique (60% de la largeur) :**
- Timeline chronologique de tous les messages envoyés et des réponses du prospect
- Messages de l'utilisateur affichés en **bleu** (alignés à droite)
- Réponses du prospect affichées en **gris** (alignées à gauche)
- Chaque message a un horodatage et un badge de statut (envoyé, réponse reçue, en attente)
- Bouton « Marquer comme envoyé » sur les messages en brouillon

**Partie droite — Assistant IA (40% de la largeur) :**
- En haut : rappel de l'objectif + contexte + stratégie + **indicateur de progression** vers l'objectif
- **Zone de collage** de la réponse du prospect (textarea + bouton « Analyser la réponse »)
- **Message suivant** suggéré par l'IA avec :
  - Le texte complet
  - Bouton « Copier le message »
  - Bouton « Régénérer » (appel IA pour une variante)
  - Zone d'édition pour modifier avant envoi
  - Délai suggéré avant envoi
- Si pas de réponse et délai dépassé : notification **« Il est temps d'envoyer la relance X »**

---

### Étape 9 — Tableau de bord

Vue d'ensemble de toute l'activité de prospection.

#### 4 KPIs en haut de page
- **Prospects actifs** — nombre de conversations en cours
- **Taux de réponse** — pourcentage de prospects ayant répondu au message initial
- **Objectifs atteints** — nombre de prospects ayant atteint l'objectif final
- **Taux de conversion global** — ratio objectifs atteints / prospects contactés

#### Tableau des conversations
Filtrable par statut : Tous / En attente de réponse / Relance à envoyer / Objectif atteint / Clos

Colonnes : prospect (avatar + nom + poste), liste, objectif, statut (badge coloré), étape, dernière action, actions (Voir / Supprimer).

Les lignes **« Relance à envoyer »** sont **mises en évidence** visuellement.

#### Notifications et rappels (in-app et optionnellement par email)
- Un délai de relance est atteint et la relance est prête à envoyer
- Un prospect n'a pas répondu depuis plus de 14 jours (suggestion de clôturer)
- Un prospect a répondu positivement (l'objectif semble atteignable)

---

## Arbre décisionnel des réponses

C'est le moteur intelligent au cœur d'Uklio. Voici comment l'IA décide du message suivant en fonction de la réponse du prospect :

### Quand le prospect répond

**Réponse positive / curieuse** (ex : « Oui, intéressant, dites-m'en plus »)
→ L'IA génère un message d'approfondissement qui avance vers l'objectif en apportant des détails ou en posant une question qualifiante.
→ Statut : En cours

**Réponse tiède / évasive** (ex : « Pourquoi pas », « Je verrai »)
→ L'IA génère un message qui réengage en apportant un élément concret de valeur (donnée, ressource, exemple) sans pousser trop fort.
→ Statut : En cours

**Le prospect pose une question**
→ L'IA génère une réponse à la question qui intègre naturellement la progression vers l'objectif.
→ Statut : En cours

**Réponse négative polie** (ex : « Pas intéressé pour le moment »)
→ L'IA génère un message de clôture élégant qui laisse la porte ouverte pour le futur.
→ Statut : Clos

**Réponse négative ferme** (ex : « Non merci », « Arrêtez »)
→ L'IA génère un message de remerciement bref et courtois.
→ Statut : Clos. Aucune relance.

**Le prospect accepte l'objectif** (ex : « OK pour un call », « Envoyez-moi le lien »)
→ L'IA génère un message de confirmation avec les détails pratiques (proposition de créneaux, lien de visio, etc.).
→ Statut : Objectif atteint

### Quand le prospect ne répond pas (silence)

- Si **moins de 3 relances** envoyées → proposer la relance suivante (déjà pré-générée dans la séquence) après le délai suggéré. Chaque relance utilise un angle différent et apporte de la valeur nouvelle.
- Si **3 relances envoyées** sans réponse → clôturer automatiquement. Aucun message supplémentaire.

**Règle absolue : maximum 3 relances par prospect.** Cela préserve la réputation de l'utilisateur et évite le spam.

---

## Statuts d'un prospect

| Statut | Description | Couleur du badge |
|--------|-------------|-----------------|
| Nouveau | Prospect ajouté, pas encore de séquence générée | Gris |
| Séquence prête | Séquence générée, premier message prêt à envoyer | Bleu |
| En cours | Conversation active, échanges en cours | Bleu foncé |
| En attente | Message envoyé, en attente de réponse du prospect | Ambre / Orange |
| Objectif atteint | Le prospect a accepté l'objectif | Vert |
| Clos | Conversation terminée (refus ou 3 relances sans réponse) | Rouge |

---

## Règles métier

### Règles de l'IA
1. L'IA ne génère jamais de message mensonger ou trompeur
2. L'IA ne prétend jamais que l'utilisateur et le prospect se connaissent si ce n'est pas le cas
3. Les messages respectent les CGU de LinkedIn (pas de spam, pas de contenu commercial agressif)
4. L'IA privilégie les questions ouvertes aux affirmations dans les premiers messages
5. Chaque relance apporte un élément nouveau (jamais un simple « je me permets de revenir vers vous »)
6. L'IA adapte la longueur au canal LinkedIn (50-150 mots)
7. L'IA garde toujours l'objectif final en tête mais ne force jamais
8. L'IA prend en compte tout l'historique de la conversation pour générer chaque nouveau message
9. L'IA intègre les informations du profil de l'utilisateur (son offre, son ton, sa cible) dans chaque message

### Limites du système
- Maximum 3 relances par prospect
- Uklio prépare les messages mais ne les envoie pas (l'utilisateur garde le contrôle total)
- L'IA a besoin d'un minimum d'informations pour être pertinente (au moins prénom, nom, poste et entreprise du prospect)

### Sécurité et conformité
- Données chiffrées et conformes au RGPD
- L'utilisateur peut exporter ou supprimer toutes ses données à tout moment
- Aucune donnée n'est partagée entre utilisateurs
- Les conversations collées ne sont utilisées que pour le traitement IA

---

## Scénarios d'usage concrets

### Scénario 1 — Validation d'idée SaaS
Un fondateur a une idée de SaaS. Il veut savoir si son produit résout une vraie problématique. Il trouve un prospect sur LinkedIn qui correspond à sa cible.
- **Objectif** : Obtenir un appel
- **Contexte** : Le prospect a posté sur Next.js (renseigné dans les 5 derniers posts)
- **Stratégie** : Demande d'avis expert
- Uklio génère une séquence qui commence par une question sur son post Next.js, approfondit avec une question sur ses problématiques, puis propose un échange plus approfondi.

### Scénario 2 — Recherche de beta-testeurs
Un fondateur vient de créer un MVP et cherche des beta-testeurs.
- **Objectif** : Obtenir un témoignage
- **Contexte** : Le prospect est RH et a publié sur les difficultés de recrutement
- **Stratégie** : Échange de valeur
- Uklio génère une séquence qui commence par un commentaire sur sa publication, offre une ressource utile, puis propose de tester l'outil en échange d'un retour.

### Scénario 3 — Vente de services
Un consultant en marketing digital trouve un prospect qui recrute un poste marketing.
- **Objectif** : Obtenir un rendez-vous physique
- **Contexte** : Le prospect recrute un responsable marketing digital
- **Stratégie** : Félicitation + transition
- Uklio génère une séquence qui félicite pour le recrutement, partage une étude de cas, puis propose un café.

### Scénario 4 — Prospection via connexion commune
Un freelance repère un prospect avec qui il a une connexion en commun.
- **Objectif** : Obtenir un appel
- **Contexte** : Connexion commune avec Marie
- **Stratégie** : Mise en relation
- Uklio génère une séquence qui mentionne Marie naturellement, crée la confiance, puis propose un échange.

---

## Note sur l'extension Chrome (V2)

Dans une version future, une extension Chrome Uklio viendra se brancher sur ce SaaS pour **remplir automatiquement la fiche prospect**. L'extension extraira depuis la page LinkedIn du prospect :

- Prénom, nom, photo de profil
- Titre / headline
- Localisation
- Poste actuel + entreprise
- Section « À propos » (bio / résumé)
- Expériences professionnelles
- Formations / diplômes
- Compétences
- Certifications
- Langues
- Section « Services »
- Centres d'intérêt / groupes
- Nombre de connexions / abonnés
- **Les 5 derniers posts LinkedIn**
- URL du profil

L'extension enverra ces données au SaaS via l'endpoint `POST /api/prospects/from-extension`. Le formulaire manuel restera disponible comme fallback.

**Pour le développement V1 : prévoir cet endpoint API dès maintenant** pour que le branchement de l'extension soit immédiat. Les champs du formulaire manuel et ceux de l'endpoint doivent être identiques.