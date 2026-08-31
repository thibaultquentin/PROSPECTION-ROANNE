# Webhook SUIVI PROSPECTION — mise à jour manuelle requise

`Code.gs` est la nouvelle version du script Apps Script derrière le webhook
utilisé par la routine (`https://script.google.com/macros/s/AKfycbz5R9HkZa9rkmKdW3s2oFvRlcxSPmehlzplrkXk7BR3YGJRRrWv8ZbZbG_Ljwhcj71ZBg/exec`
— URL mise à jour le 31/08/2026, voir « Résolution » ci-dessous ; l'ancienne
URL `.../AKfycbydrO4qczgwdeAP8Z2NGE73L6LWQvLyt1IrmNpWW2hKxG6xepQ4h2PHVa_9UitGYxxn/exec`
ne doit plus être utilisée).

Aucun outil de cette session ne permet de modifier un projet Apps Script
existant à distance — c'est le seul geste manuel de cette mise à jour, à
faire une fois :

1. Ouvrir le Google Sheets **SUIVI PROSPECTION** → **Extensions > Apps Script**.
2. Remplacer le contenu du fichier existant par celui de `Code.gs` ici.
3. **Déployer > Gérer les déploiements > modifier** le déploiement existant
   (icône crayon), sélectionner « Nouvelle version », enregistrer.
   Important : modifier le déploiement existant, pas en créer un nouveau —
   sinon l'URL `/exec` change et le webhook actuel casse.
4. Les colonnes `ID Brouillon` et `Date Envoi` sont ajoutées automatiquement
   au Sheets au premier appel si elles n'existent pas déjà (voir
   `ensureColumns_` dans le code) : aucune manipulation du tableau requise.

Ce que le nouveau code change par rapport à l'ancien :
- Statut par défaut à la création d'une ligne : `Brouillon` (plus `Envoyé`).
- Nouvelle action `updateStatus` (par email) pour corriger le statut d'une
  ligne existante sans créer de doublon — utilisée par l'Étape 0 du skill
  `prospection-roanne`.
- Garde-fou : une ligne déjà à `Facturé` n'est jamais modifiée par le script.
- (31/08/2026) Comparaison d'email normalisée (`normalizeEmail_`, insensible
  à la casse, aux espaces et à quelques caractères invisibles usuels) au
  lieu d'un simple `trim().toLowerCase()`.

## ⚠️ Si `updateStatus` répond "ligne introuvable" sur des lignes qui existent

Constaté le 31/08/2026 : le webhook réellement en service échoue avec
"ligne introuvable" sur **toutes** les lignes ajoutées à partir de
"Buchet Voyages" (06/08/2026, la ligne juste après le CORRECTIF du
06/08/2026 documenté dans `Code.gs`) — aussi bien des lignes `Envoyé` que
`Brouillon`, sans lien avec le contenu de la colonne Email (vérifié
caractère par caractère via un export CSV brut du Sheets : aucun caractère
invisible, ASCII pur). La coïncidence exacte de date avec le correctif est
le suspect numéro un : **il est probable que ce fichier ait été mis à jour
ici, dans le dépôt, sans jamais avoir été réellement recollé dans
l'éditeur Apps Script ni redéployé** (voir étapes 1-3 ci-dessus — ce geste
est resté manuel dans toutes les sessions précédentes, faute d'outil pour
l'automatiser). Avant toute autre piste, vérifier si ce redéploiement a
bien été fait, et le refaire si besoin — cela peut suffire à tout
résoudre sans aucun changement de code supplémentaire.

## ✅ Résolution (31/08/2026)

Le diagnostic ci-dessus était le bon. Un redéploiement du script a eu lieu
(nouvelle URL `/exec`, voir en tête de fichier), et cette nouvelle URL a été
testée en direct depuis cette session :
- Un appel `updateStatus` sur un email inexistant renvoie bien
  `{"ok":false,"error":"ligne introuvable pour ..."}` (recherche réelle
  effectuée, pas une fausse réponse positive).
- Un appel `updateStatus` idempotent sur une ligne réelle existante
  (Lassaigne Menuiserie, ligne 2) a renvoyé `{"ok":true,"row":2}`, et le
  `modifiedTime` du Google Sheets a changé en conséquence — confirmation
  que cette URL écrit bien dans le fichier SUIVI PROSPECTION réel.

**Toute automatisation du skill `prospection-roanne` doit désormais utiliser
la nouvelle URL en tête de ce fichier**, plus l'ancienne.
