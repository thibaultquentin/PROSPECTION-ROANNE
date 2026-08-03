# Webhook SUIVI PROSPECTION — mise à jour manuelle requise

`Code.gs` est la nouvelle version du script Apps Script derrière le webhook
utilisé par la routine (`https://script.google.com/macros/s/AKfycbydrO4qczgwdeAP8Z2NGE73L6LWQvLyt1IrmNpWW2hKxG6xepQ4h2PHVa_9UitGYxxn/exec`).

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
