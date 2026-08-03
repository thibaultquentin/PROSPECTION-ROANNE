# packaging-claude-design.js

Transforme un composant React/JSX en un unique fichier `.html` autonome pour
une maquette de prospection : React + ReactDOM (build UMD production
officiel) et le composant compilé sont inlinés directement dans le fichier.
Aucune requête réseau au runtime en dehors, éventuellement, des polices
Google Fonts déclarées via `--fonts`.

Le JSX est précompilé une seule fois ici (via esbuild), jamais dans le
navigateur : pas de `babel-standalone` embarqué, pas de transform au chargement.

## Installation (une fois)

```
cd scripts
npm install
```

## Contrat sur le fichier d'entrée

- Un seul fichier `.jsx`/`.tsx`, qui `export default` un composant.
- Utiliser React via la globale `React` (ex. `const { useState } = React;`),
  **jamais** `import React from "react"` ni `import ... from "react-dom"` :
  React n'est chargé qu'une seule fois, en UMD, pour éviter tout bug de
  double instance (hooks/contexte cassés silencieusement). Le build échoue
  avec un message explicite si ce contrat n'est pas respecté.
- Aucun appel réseau au runtime dans le composant (`fetch`, `XMLHttpRequest`,
  `import()` dynamique, `<script src>`, `WebSocket`) : le build échoue si le
  bundle compilé en contient — cohérent avec la contrainte d'échec de la
  routine (jamais de maquette à moitié fonctionnelle envoyée au client).

## Usage

```
node packaging-claude-design.js \
  --entry chemin/vers/App.jsx \
  --out ../maquettes/nom-entreprise-ville.html \
  --title "Nom Entreprise — Ville" \
  --description "Meta description SEO local (métier + zone)" \
  --fonts "Playfair+Display:wght@400;700&family=Nunito:wght@400;600"
```

`--fonts` est le fragment de requête `family=...` tel qu'utilisé par
`fonts.googleapis.com/css2?family=...` (sans le préfixe) ; omettre l'option
si le client n'utilise pas de police Google Fonts.

## Vérification manuelle (smoke test)

Un composant de test minimal est fourni dans `__test__/App.test.jsx`. Pour
vérifier que le pipeline packaging fonctionne toujours après une mise à jour
d'esbuild/React :

```
node packaging-claude-design.js --entry __test__/App.test.jsx --out __test__/out.html --title "Test"
node __test__/verify.js   # nécessite playwright ; charge le fichier en Chromium headless
                           # et vérifie : rendu correct, interactivité (clic), zéro requête réseau, zéro erreur console
```

`__test__/out.html` est généré et ignoré par git (voir `.gitignore`).
