# SEO local — règles pour les maquettes

Ces règles s'appliquent à l'étape 4 (construction de la maquette). Elles ne changent rien au mail : voir la clause « Ce que le SEO ne doit pas faire » en fin de fichier.

L'objectif n'est pas de faire ranker la maquette — c'est un fichier joint, jamais crawlé. C'est de **livrer une maquette déjà correcte techniquement**, pour que le client voie que le travail est sérieux jusque dans ce qui ne se voit pas, et pour qu'il n'y ait rien à refaire le jour où le site part en ligne.

---

## Étape préalable obligatoire : déterminer la vraie zone de chalandise

**Ne jamais écrire « Roanne » par défaut.** Le skill s'appelle « Prospection Roanne » parce que c'est là que se fait la prospection, pas parce que toutes les cibles travaillent à Roanne. Plaquer « Roanne » sur une entreprise de Saint-Cyr-de-Favières qui rayonne sur trente kilomètres, ou sur une entreprise dont les clients sont dispersés dans toute la France, produit un SEO faux — et un client qui le remarque perd confiance dans le reste.

Avant d'écrire le moindre `<title>`, répondre à cette question à partir de ce qui a été trouvé à l'étape 2 : **où sont les clients de cette entreprise, et qui se déplace ?**

### Signaux à regarder

- **Ce que l'entreprise affiche elle-même** : « nous intervenons dans un rayon de X km », une liste de communes, « toute la France », une carte de zone.
- **Qui se déplace.** Le client vient sur place (commerce, institut, restaurant, cabinet) → zone étroite. L'entreprise se déplace chez le client (artisan, dépanneur, paysagiste) → zone = son rayon d'intervention réel. Personne ne se déplace ou tout le monde se déplace (transport, activité en ligne, vente à distance) → la géographie n'est pas le bon axe.
- **Le nombre d'implantations.** Plusieurs agences ou dépôts → la zone est l'union des zones, pas la ville du siège.
- **La spécialité revendiquée.** Une niche nationale (une profession, un type de produit rare) attire des clients hors zone, même quand le siège est local.

### Les trois cas

#### 1. Entreprise strictement locale à une ville → la ville, normalement

Le client vient sur place, il ne fera pas trente kilomètres pour ça. La ville est le bon terme, et le seul.

> **Exemple — Escale Beauté**, institut de beauté à Roanne. On vient à l'institut ; personne ne traverse le département pour un soin. Zone SEO : **Roanne**.
>
> `<title>` type : `Escale Beauté — Institut de beauté à Roanne | Soins, rituels, chèques cadeaux`
> `areaServed` : `Roanne`

#### 2. Zone d'intervention plus large, ou plusieurs implantations → la zone réelle

L'entreprise se déplace, ou couvre plusieurs communes. Utiliser le terme qui décrit vraiment la zone : le nom du bassin (« le Roannais »), le rayon annoncé (« à 30 km de Roanne »), ou la liste des communes citées par l'entreprise. Mentionner la ville du siège reste utile — mais comme point d'ancrage, pas comme périmètre.

> **Exemple — Palluet Frères**, chauffagiste à Saint-Cyr-de-Favières. Le siège est à Saint-Cyr-de-Favières, mais l'entreprise annonce elle-même intervenir « dans l'agglomération roannaise et dans un rayon de 30 km », en citant Roanne, Riorges, Mably et Le Coteau. Écrire « chauffagiste à Roanne » serait faux (ce n'est pas là qu'ils sont) ; écrire « chauffagiste à Saint-Cyr-de-Favières » et s'arrêter là serait inutilement étroit (personne ne cherche ça).
>
> `<title>` type : `Palluet Frères — Chauffagiste et plombier dans le Roannais | Saint-Cyr-de-Favières`
> `areaServed` : la liste réelle — `Roanne`, `Riorges`, `Mably`, `Le Coteau`, plus une mention du rayon de 30 km
> `address` : l'adresse du siège, toujours exacte

#### 3. Clientèle non définie géographiquement → ne pas insister sur la localisation

Quand ce qui fait venir les clients n'est pas la proximité mais la spécialité, forcer la géographie dilue le message et cible mal. Garder le secteur d'activité et la spécialité ; l'adresse reste dans les données structurées (c'est une donnée d'identité, pas une cible), mais elle sort du `<title>`, de la meta description et des titres visibles.

> **Exemple — Terri Express**, déménagement et transport express à Saint-Léger-sur-Roanne. Le siège est bien dans le Roannais et une part de la clientèle est locale, mais la spécialité revendiquée — le transfert des gendarmes et des militaires — amène des clients en mutation depuis n'importe où en France, qui cherchent « devis déménagement militaire », pas « déménageur à Roanne ». La géographie n'est pas ce qui les fait arriver.
>
> `<title>` type : `Terri Express — Déménagement, transport express et garde-meubles | Spécialiste des mutations militaires`
> `areaServed` : le périmètre réellement couvert (national pour le déménagement) — ne pas le restreindre à une commune pour « faire local »
> L'adresse du siège reste dans le JSON-LD, mais pas dans le titre.
>
> **Cas mixte.** Terri Express illustre aussi la nuance : une entreprise peut avoir une clientèle locale *et* une clientèle nationale. Quand c'est le cas, c'est la clientèle que la maquette cherche à capter (celle du manque identifié à l'étape 2) qui décide du cadrage. Ici, l'outil central sert le militaire en mutation : le SEO suit.

### En cas de doute

Si les signaux se contredisent ou manquent, **choisir le cadrage le plus large des deux et le dire dans le compte rendu**, en éléments à vérifier. Un titre trop large se resserre en une ligne ; un titre faux se remarque tout de suite.

---

## Règle 1 — `<title>`

Gabarit : `Nom de l'entreprise — Métier + zone | Précision utile`

- Le **métier** en mots que les gens tapent réellement (« chauffagiste », « plombier », « institut de beauté »), pas en jargon de plaquette (« solutions thermiques »).
- La **zone** telle que déterminée ci-dessus. Au cas 3, elle disparaît et la spécialité prend sa place.
- Viser 55-65 caractères. Au-delà, c'est tronqué dans les résultats.
- Le nom de l'entreprise en premier : c'est ce qui identifie l'onglet quand le client ouvre la maquette, et c'est ce qu'on cherche quand on connaît déjà l'enseigne.

## Règle 2 — `<meta name="description">`

- Une à deux phrases, 140-160 caractères, écrites pour être lues par un humain dans une page de résultats.
- Contenir le métier, la zone (cas 1 et 2), et ce qui différencie l'entreprise — pas une liste de mots-clés séparés par des virgules.
- **Même registre que le reste de la maquette.** Une description qui sonne commerciale alors que le site est sobre casse la cohérence, et c'est exactement ce que l'étape 5 interdit dans le mail.
- Ne jamais y mettre un chiffre, une note ou une certification qui ne soit pas vérifié à l'étape 2.

## Règle 3 — Données structurées schema.org

Un bloc `<script type="application/ld+json">` en fin de `<head>`. Compatible avec la contrainte « un seul fichier HTML autonome » : c'est du texte inline, aucune ressource externe.

- **Utiliser le sous-type le plus précis de `LocalBusiness`** plutôt que `LocalBusiness` tout court : `Plumber`, `HVACBusiness`, `HealthAndBeautyBusiness`, `MovingCompany`, `HomeAndConstructionBusiness`, `Electrician`, `RealEstateAgent`… Le sous-type dit le métier mieux qu'un mot-clé.
- **Champs attendus** : `name`, `address` (`PostalAddress` complet), `telephone`, `email`, `url`, `openingHoursSpecification`, `areaServed`, `description`.
- **N'inclure que du vérifié.** Un champ absent est neutre ; un champ faux est un mensonge structuré, lisible par une machine, dans un fichier qu'on envoie à quelqu'un qui connaît son entreprise mieux que nous. En pratique :
  - horaires contradictoires selon les annuaires → **omettre `openingHoursSpecification`** et le signaler dans le compte rendu (c'est le cas rencontré chez Palluet Frères) ;
  - **jamais de `aggregateRating` ni de `review`** reconstitués à partir d'annuaires — voir l'interdiction générale des avis inventés ;
  - `priceRange` seulement si l'entreprise publie ses prix.
- **`areaServed`** applique directement la règle de zone : une commune au cas 1, une liste de communes (et/ou un `GeoCircle` avec le rayon annoncé) au cas 2, le périmètre réel au cas 3.
- Le JSON-LD doit **dire la même chose que la page**. Une adresse dans le JSON-LD qui ne correspond pas au pied de page est une incohérence que Google relève et qu'un client relève encore plus vite.

## Règle 4 — Métier et zone dans les titres visibles

Le `h1` et les `h2` doivent contenir le métier et la zone **de façon naturelle**, parce qu'ils décrivent le contenu — pas parce qu'on les y a poussés.

- Ça marche quand la phrase se tiendrait sans intention SEO : *« L'agglomération roannaise, et 30 km autour »*, *« Deux frères chauffagistes… »*.
- Ça ne marche pas quand la phrase ne sert qu'à placer les mots : *« Chauffagiste Roanne — chauffagiste Riorges — plombier Le Coteau »*. Une seule occurrence bien placée vaut mieux que trois forcées.
- Une section « zone d'intervention » avec les communes réelles est souvent le meilleur endroit : elle est utile au visiteur *et* elle porte les termes géographiques.
- Au cas 3, ne pas chercher à caser la ville dans un titre visible : le métier et la spécialité suffisent.

**Cette règle cède devant la continuité de charte (étape 4).** Si le client a déjà une baseline, un slogan ou des intitulés de rubriques à lui, on ne les réécrit pas pour y glisser des mots-clés — l'étape 4 dit explicitement de ne pas reformuler ce qui fonctionne déjà. Le SEO se loge alors dans le `title`, la meta description et le JSON-LD, qui sont invisibles, et dans les titres de sections qu'on écrit soi-même. Si un titre visible du client gagnerait vraiment à être reformulé, c'est une **proposition à mentionner dans le compte rendu**, pas une réécriture silencieuse.

---

## Ce que le SEO ne doit pas faire

- **Ne rien changer au mail.** Pas de paragraphe SEO, pas de mention des données structurées, pas de « visibilité Google » : c'est exactement le vocabulaire de plaquette que l'étape 5 interdit, et le mail est déjà calibré à 130-150 mots. Le mail part en HTML (`htmlBody` de l'étape 5) : ce n'est pas une raison d'y glisser des `<meta>`, un `<script type="application/ld+json">` ou une structure pensée pour un moteur de recherche — un mail n'est jamais crawlé, et ce balisage n'y a aucune fonction, seulement l'air d'un réflexe SEO mal placé. Le SEO ne se mentionne dans le mail **que** s'il est le manque principal identifié à l'étape 2 — et il est alors traité comme n'importe quel autre manque, en une observation en prose.
- **Ne pas devenir l'argument central de la maquette.** La pièce centrale reste l'outil interactif qui répond au manque identifié. Le SEO est de la finition.
- **Ne pas se substituer aux garde-fous existants.** Aucune donnée inventée, aucun avis reconstitué, aucune certification non vérifiée — y compris dans le JSON-LD, où c'est plus tentant parce que ça ne se voit pas.
- **Ne pas toucher aux conventions de nommage.** Le fichier reste `nom-entreprise-ville.html` et le titre de conversation reste « Nom entreprise - Ville », avec la ville du siège, même au cas 2 ou 3 : ces conventions servent au classement des dossiers, pas au référencement.
- **La maquette reste une démonstration.** Elle porte son bandeau et sa mention de pied de page, et il est cohérent d'y laisser `<meta name="robots" content="noindex, nofollow">` : le balisage SEO est livré prêt à servir sur le site réel, pas pour faire indexer un fichier de démonstration.
