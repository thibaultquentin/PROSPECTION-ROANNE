#!/usr/bin/env node
/**
 * Packaging Claude Design -> maquette HTML autonome.
 *
 * Prend un composant React/JSX (par ex. exporté d'un projet Claude Design)
 * et produit un unique fichier .html autonome : React + ReactDOM (build UMD
 * production officiel, inline) et le composant compilé sont inlinés dans
 * des <script>. Aucune dépendance chargée au runtime (pas de CDN, pas de
 * babel-standalone) : le JSX est précompilé une seule fois ici, à la
 * construction, via esbuild.
 *
 * Contrat sur le fichier d'entrée (--entry) :
 *   - Un seul fichier .jsx/.tsx, qui `export default` un composant.
 *   - Utiliser React via la globale `React` (ex. `const { useState } = React;`),
 *     JAMAIS `import React from "react"` ou `import ... from "react-dom"` :
 *     React n'est chargé qu'une seule fois, en UMD, pour éviter tout bug de
 *     double instance (hooks/contexte cassés). Le build échoue si ce
 *     contrat n'est pas respecté.
 *
 * Usage :
 *   node scripts/packaging-claude-design.js \
 *     --entry chemin/vers/App.jsx \
 *     --out maquettes/nom-entreprise-ville.html \
 *     --title "Nom Entreprise — Ville" \
 *     --description "Meta description SEO local" \
 *     [--fonts "Playfair+Display:wght@400;700&family=Nunito:wght@400;600"]
 */

const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true;
      args[key] = val;
    }
  }
  return args;
}

// Motifs interdits dans le code source ET dans le bundle compilé : tout ce
// qui introduirait React en double (ce script fournit déjà React/ReactDOM
// en UMD global, une seule fois).
const FORBIDDEN_IMPORT_PATTERNS = [
  { re: /from\s+["']react["']/, label: 'import ... from "react"' },
  { re: /require\(\s*["']react["']\s*\)/, label: 'require("react")' },
  { re: /from\s+["']react-dom(\/client)?["']/, label: 'import ... from "react-dom"' },
  { re: /require\(\s*["']react-dom(\/client)?["']\s*\)/, label: 'require("react-dom")' },
];

// Motifs interdits dans le bundle final : tout ce qui déclencherait un appel
// réseau au runtime en dehors de Google Fonts (chargé via <link> dans le
// <head>, pas depuis ce bundle JS).
const FORBIDDEN_NETWORK_PATTERNS = [
  { re: /\bfetch\s*\(/, label: "appel fetch()" },
  { re: /new\s+XMLHttpRequest/, label: "XMLHttpRequest" },
  { re: /\bimport\s*\(/, label: "import() dynamique" },
  { re: /<script[^>]+src=/i, label: "balise <script src=...> externe" },
  { re: /new\s+WebSocket/, label: "WebSocket" },
];

function assertNoForbiddenPatterns(code, patterns, context) {
  const hits = patterns.filter((p) => p.re.test(code));
  if (hits.length > 0) {
    const details = hits.map((h) => `  - ${h.label}`).join("\n");
    throw new Error(`${context} :\n${details}`);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function build({ entry, out, title, description, fonts, lang }) {
  const entryAbs = path.resolve(entry);
  if (!fs.existsSync(entryAbs)) {
    throw new Error(`Fichier d'entrée introuvable : ${entryAbs}`);
  }

  const entrySource = fs.readFileSync(entryAbs, "utf8");
  assertNoForbiddenPatterns(
    entrySource,
    FORBIDDEN_IMPORT_PATTERNS,
    `${path.basename(entryAbs)} importe React/ReactDOM directement — interdit (React est fourni une seule fois en UMD global par ce script, cf. contrat en tête de fichier). Utiliser la globale \`React\` (ex. const { useState } = React;) à la place`
  );

  // esbuild : précompilation JSX -> JS, une seule fois, ici (jamais dans le
  // navigateur). jsxFactory/jsxFragment pointent vers la globale React
  // fournie par le script (UMD), pas vers un import "react".
  const result = esbuild.buildSync({
    entryPoints: [entryAbs],
    bundle: true,
    write: false,
    format: "iife",
    globalName: "__ClaudeDesignApp",
    platform: "browser",
    target: ["es2019"],
    jsx: "transform",
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    minify: true,
    logLevel: "silent",
  });

  if (result.errors.length > 0) {
    throw new Error(
      "Échec de compilation esbuild :\n" + result.errors.map((e) => e.text).join("\n")
    );
  }

  const componentBundle = result.outputFiles[0].text;
  assertNoForbiddenPatterns(
    componentBundle,
    FORBIDDEN_NETWORK_PATTERNS,
    "Le composant compilé contient des appels réseau externes interdits pour une maquette autonome (aucune requête réseau au runtime en dehors de Google Fonts, chargé via <link> dans le <head>, pas depuis ce bundle)"
  );

  // react/react-dom 18+ restreignent les sous-chemins via "exports" dans
  // leur package.json (seul "./package.json" et quelques entrées precises
  // restent résolvables via require.resolve) — on retrouve donc la racine
  // du paquet via son package.json (toujours exposé), puis on lit le
  // fichier UMD directement sur disque, en dehors du système "exports".
  const reactRoot = path.dirname(require.resolve("react/package.json"));
  const reactDomRoot = path.dirname(require.resolve("react-dom/package.json"));
  const reactUmd = fs.readFileSync(
    path.join(reactRoot, "umd", "react.production.min.js"),
    "utf8"
  );
  const reactDomUmd = fs.readFileSync(
    path.join(reactDomRoot, "umd", "react-dom.production.min.js"),
    "utf8"
  );

  const mountCode = `
(function () {
  var mountPoint = document.getElementById("root");
  var App = window.__ClaudeDesignApp && window.__ClaudeDesignApp.default;
  if (typeof App !== "function") {
    mountPoint.innerHTML = "<p style='font-family:sans-serif;color:#b00'>Erreur de chargement de la maquette (export par défaut introuvable).</p>";
    return;
  }
  var root = ReactDOM.createRoot(mountPoint);
  root.render(React.createElement(App));
})();
`;

  const fontLink = fonts
    ? `<link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n  <link href="https://fonts.googleapis.com/css2?family=${fonts}&display=swap" rel="stylesheet">`
    : "";

  const html = `<!doctype html>
<html lang="${lang || "fr"}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title || "Maquette")}</title>
  ${description ? `<meta name="description" content="${escapeHtml(description)}">` : ""}
  ${fontLink}
</head>
<body>
  <div id="root"></div>
  <script>${reactUmd}</script>
  <script>${reactDomUmd}</script>
  <script>${componentBundle}</script>
  <script>${mountCode}</script>
</body>
</html>
`;

  const outAbs = path.resolve(out);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  fs.writeFileSync(outAbs, html, "utf8");
  return outAbs;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.entry || !args.out) {
    console.error(
      "Usage: node packaging-claude-design.js --entry <App.jsx> --out <sortie.html> [--title ...] [--description ...] [--fonts ...] [--lang fr]"
    );
    process.exit(1);
  }
  try {
    const outAbs = build(args);
    console.log(`OK — maquette packagée : ${outAbs}`);
  } catch (err) {
    console.error(`ÉCHEC packaging : ${err.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { build };
