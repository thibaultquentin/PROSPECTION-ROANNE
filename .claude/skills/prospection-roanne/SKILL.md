---
name: prospection-roanne
description: "Méthodologie complète pour prospecter une entreprise locale du Roannais (Roanne et alentour) en vue de lui vendre un site web ou une application sur mesure : repérage d'un commerce ou artisan cible, recherche de son site actuel, construction d'une maquette HTML qui reprend la direction artistique existante du client (couleurs, typographie, structure, formulations) en y ajoutant des fonctionnalités vivantes plutôt que de la remplacer, rédaction d'un mail de démarchage dans un format et un ton précis, et création d'un rappel de relance sur Google Calendar. Utilise ce skill dès que l'utilisateur demande de \"faire pareil avec une autre entreprise/boîte\", de prospecter un nouveau client, de lancer le processus sur un nouveau secteur, ou fait référence à sa méthodologie habituelle de prospection à Roanne. Règle impérative : un seul projet par conversation, si l'utilisateur demande d'enchaîner sur une nouvelle entreprise, le signaler et proposer d'ouvrir une nouvelle conversation."
---

# Prospection Roanne — de la cible au mail envoyé

Cette méthodologie sert à démarcher, un commerce ou artisan du Roannais à la fois, en lui envoyant une maquette de site construite spécifiquement pour lui, accompagnée d'un mail qui ne ressemble pas à du démarchage générique. La maquette part toujours de la direction artistique déjà en place chez le client — pas d'une identité neuve imaginée pour l'occasion — et y ajoute des fonctionnalités qui rendent le site plus vivant.

## Règle n°1 : un projet par conversation

**Chaque entreprise a sa propre conversation.** Ne jamais construire deux maquettes ni préparer deux mails de démarchage dans le même fil, même si l'utilisateur enchaîne les demandes.

- Si l'utilisateur demande d'enchaîner sur une nouvelle cible dans une conversation qui a déjà produit un projet complet, le dire clairement et proposer d'ouvrir une nouvelle conversation pour ce nouveau projet plutôt que de le faire ici.
- Exception : si l'utilisateur demande explicitement de rattraper un oubli sur un projet déjà commencé dans cette conversation (ex. « tu as fait le site mais pas le mail, remédie à ça »), on peut compléter ce qui manque.
- À la toute fin de chaque projet mené à bien, renommer mentalement/proposer le titre de conversation au format **« Nom de l'entreprise - Ville »** (ex. *Lassaigne Menuiserie - Roanne*), à l'identique du format déjà utilisé par l'utilisateur. Si l'outil de renommage n'est pas disponible, indiquer le titre à donner pour que l'utilisateur le fasse lui-même.

## Vue d'ensemble du processus

1. Choisir ou confirmer la cible (secteur + entreprise précise à Roanne ou dans le Roannais)
2. Rechercher l'entreprise (site actuel, avis Google, coordonnées, positionnement)
3. Rechercher le contexte utile (prix de marché du secteur, actualité réglementaire, aides, etc. — tout ce qui rend le mail crédible et pertinent)
4. Construire la maquette HTML autonome
5. Rédiger le mail de démarchage (voir format strict ci-dessous) et créer le brouillon Gmail
6. Créer un rappel de relance sur Google Calendar
7. Livrer la maquette à l'utilisateur et lui indiquer ce qui reste éventuellement à faire manuellement (coller la ligne de suivi dans le Sheets si aucun outil d'édition Sheets n'était disponible)

## Étape 1 — Choisir la cible

Si l'utilisateur ne nomme pas d'entreprise précise :
- Utiliser `places_search` pour trouver des commerces/artisans réels à Roanne dans le secteur visé (ou un secteur pas encore couvert dans les conversations précédentes — vérifier avec `conversation_search` / `recent_chats` quelles entreprises ont déjà été démarchées pour ne pas répéter).
- Préférer les entreprises indépendantes (pas de franchise nationale — leur site est décidé au siège, personne sur place ne peut signer) avec une bonne réputation (note Google élevée, volume d'avis correct) et un site actuel visiblement faible (template générique, pas d'outil interactif, PDF à télécharger, prise de contact uniquement par téléphone…).
- Écarter les entreprises en difficulté visible (redressement judiciaire, etc.) si l'info apparaît dans la recherche.

Si l'utilisateur nomme l'entreprise, passer directement à l'étape 2.

## Étape 2 — Rechercher l'entreprise

- `web_search` puis `web_fetch` le site actuel de l'entreprise (attention : certains sites bloquent le fetch — utiliser alors les extraits de recherche).
- Relever : nom du dirigeant ou de la dirigeante (souvent dans les mentions légales), adresse, téléphone, horaires, adresse mail de contact, positionnement/ton, avis Google (note + nombre), produits ou services réels, prix quand ils sont publiés.
- Repérer le manque principal du site actuel : ce qui manque concrètement à l'internaute (pas de réservation en ligne, pas de chiffrage, pas de catalogue interactif, information capitale absente comme une certification non affichée, etc.). C'est ce manque qui devient l'angle du mail et le cœur de la maquette.

## Étape 3 — Rechercher le contexte utile

Selon le secteur, chercher ce qui rend la maquette crédible et le mail pertinent :
- Prix de marché réalistes pour le secteur (fenêtres, cuisines, prestations beauté, immobilier…) via `web_search`, pour calibrer un simulateur de prix qui retombe juste.
- Actualité réglementaire ou saisonnière qui crée une urgence légitime (ex. échéance d'aide publique, changement de réglementation, saison) — jamais inventée, toujours vérifiée par recherche datée.
- Toujours vérifier la date du jour via `user_time_v0` avant de raisonner sur des échéances.

## Étape 4 — Construire la maquette

**Principe directeur : partir de la charte existante, pas la remplacer.** Le client a déjà payé pour son site actuel — logo, couleurs, typographie, structure des rubriques, formulations. Une maquette qui ignore tout ça et repart d'une direction artistique neuve, aussi réussie soit-elle esthétiquement, donne au client le sentiment qu'il faut tout jeter et recommencer à zéro. C'est le contraire de l'effet recherché : la maquette doit se lire comme *son* site avec quelque chose en plus, pas comme le site d'un concurrent qui aurait volé son adresse.

- Avant de lire `frontend-design/SKILL.md`, `web_fetch` le site actuel du client (page d'accueil et au moins une page intérieure) et relever : sa palette (couleurs dominantes, boutons, liens), sa typographie perçue (empattée/sans-serif, condensée/large), la structure exacte de son menu et de ses rubriques, ses formulations propres (baseline, slogans, intitulés de sections, sous-titres), son ton (institutionnel, familial, artisanal…), et tout élément d'identité déjà en place (logo, pictogrammes, mise en page des horaires, etc.).
- Si le CSS ou les images ne sont pas accessibles au fetch (site protégé, JS lourd, robots.txt), le dire explicitement au client dans le mail plutôt que d'improviser une palette en la faisant passer pour la sienne — voir la clause de tempérance ci-dessous.
- Regrouper les couleurs et polices dans des variables CSS commentées en tête de fichier, pour qu'un ajustement (le jour où le client fournit ses vrais codes ou son logo) tienne en quelques lignes plutôt qu'en une reprise complète.
- Reprendre à l'identique ce qui peut l'être sans perte : la baseline, les intitulés de rubriques et leurs sous-titres, la structure de navigation, la présentation des horaires et coordonnées, les formulations déjà en place sur le site (« Nos atouts », « Nos zones d'intervention »…). Ne pas reformuler ce qui fonctionne déjà juste pour faire « plus propre ».
- Lire ensuite `/mnt/skills/public/frontend-design/SKILL.md`, mais l'appliquer *à l'intérieur* de cette contrainte : la prise de risque esthétique doit rester au niveau du détail (un signature element, une micro-interaction, un traitement de balance/compteur…), jamais au niveau de l'identité globale. Le risque à prendre ici n'est pas de proposer une nouvelle direction artistique, mais de rendre l'existant plus vivant : une navigation qui répond, un premier écran qui bouge légèrement, un mode sombre s'il existe déjà chez le client, des micro-interactions sur les éléments interactifs — sans jamais changer la palette, la typographie ou le ton pour quelque chose de plus générique.
- Se méfier en particulier des trois looks par défaut listés dans `frontend-design/SKILL.md` (fond crème + accent terracotta, fond noir + accent acide, maquette façon presse à filets) : sur ce skill, ils sont presque toujours un signe qu'on a ignoré la charte du client plutôt qu'un choix pour cette entreprise précise.
- Un seul fichier HTML autonome (CSS + JS inline), construit en local puis copié dans `/mnt/user-data/outputs/` pour l'aperçu immédiat dans la conversation.
- Utiliser les vraies données récupérées à l'étape 2 : vrai nom, vraie adresse, vrais horaires, vraies photos si accessibles, vrai avis Google.
- Construire un outil interactif qui répond exactement au manque identifié à l'étape 2 (chiffrage en ligne, simulateur, configurateur, prise de rendez-vous avec export .ics, galerie filtrable…) — c'est la pièce centrale de l'argumentaire commercial, pas un site vitrine de plus. C'est là que doit se concentrer l'essentiel du travail « fonctionnalités » : le client doit voir tout de suite ce que son site ne sait pas faire aujourd'hui.
- Appliquer les règles de SEO local — `title` et meta description (métier + zone), données structurées schema.org `LocalBusiness`, présence naturelle du métier et de la zone dans les titres visibles : **voir `references/seo-local.md`**. La zone géographique ne se met jamais en dur sur « Roanne » : elle se déduit de la vraie zone de chalandise de l'entreprise (zone d'intervention affichée, nombre d'implantations, clientèle locale ou non) selon la règle de décision détaillée dans ce fichier. Ces règles restent subordonnées au principe de continuité de charte ci-dessus.
- Nommer le fichier `nom-entreprise-ville.html` (minuscules, tirets), cohérent avec le nom qui sera donné à la conversation.
- Ajouter un bandeau de démonstration discret en haut de page et une mention en pied de page précisant que c'est une maquette de démonstration, prix indicatifs non contractuels, et — si la charte exacte n'a pas pu être récupérée — que les couleurs sont approchées et ajustables.

### Publication : dépôt GitHub, pas Drive

La maquette ne se dépose plus dans un dossier Drive : elle est publiée directement dans le dépôt GitHub `thibaultquentin/PROSPECTION-ROANNE`, servi par GitHub Pages.

- Ajouter le fichier dans `maquettes/` du dépôt (même nom `nom-entreprise-ville.html`) avec l'outil GitHub disponible (`create_or_update_file` ou équivalent) — `owner: thibaultquentin`, `repo: PROSPECTION-ROANNE`, `path: maquettes/nom-entreprise-ville.html`, `branch: main`. Message de commit court, ex. `Add maquette for [Nom entreprise]`. Commit direct sur `main` : c'est un dépôt personnel, pas de pull request pour ce geste routinier.
- L'URL publique qui en résulte suit toujours ce format : `https://thibaultquentin.github.io/PROSPECTION-ROANNE/maquettes/nom-entreprise-ville.html`. C'est cette URL — jamais un lien Drive — qui sert ensuite pour le mail (étape 5) et pour la ligne du tableau de suivi ci-dessous.
- Ajouter une ligne dans le Google Sheets **SUIVI PROSPECTION** (dossier "02 - Maquettes créées") : colonnes Date (date du jour) et Entreprise remplies, colonne **Lien maquette** = l'URL GitHub Pages ci-dessus. Utiliser un outil d'édition/ajout de ligne Sheets s'il est disponible dans la session. À défaut (aucun outil de ce type n'existait dans l'environnement standard à la rédaction de ce skill — les outils Drive ne permettent que lire, créer un nouveau fichier ou copier, jamais modifier un fichier existant en place) : ne surtout pas créer un nouveau fichier Sheets à chaque maquette, ça disperserait le suivi. Donner plutôt à l'utilisateur, en clair dans la conversation, la ligne prête à copier-coller (Date, Entreprise, Lien maquette ; le reste vide) et signaler ce geste comme le seul reste manuel de l'étape 7.
- **Si l'ajout de ligne passe par un webhook (Apps Script ou équivalent) appelé en `curl -X POST` :** ne jamais suivre les redirections (`-L`). Ce type d'endpoint répond souvent par une redirection HTTP (302) vers l'URL d'exécution réelle (`script.googleusercontent.com`) une fois l'action déjà effectuée côté serveur ; suivre cette redirection avec `-L` réémet la requête et l'action se répète, créant des lignes en double dans le Sheets. Ce bug est la cause identifiée de plusieurs doublons observés dans SUIVI PROSPECTION (Léonard Parmentier, SOTTON Père & Fils) fin juillet 2026.

## Étape 5 — Le mail de démarchage

C'est la partie la plus sensible : le format et le ton doivent être respectés à la lettre. Un mail qui ressemble à du démarchage générique ne sera pas lu.

### Ce qu'il faut absolument éviter
- Les listes à puces énumérant les fonctionnalités — c'est le signal le plus reconnaissable d'un mail de prospection, ça donne envie de fermer l'onglet.
- Un ton commercial, des superlatifs, un vocabulaire de plaquette ("solution innovante", "optimisez votre présence en ligne"…).
- Nommer des tiers non destinataires du mail (salariés, collègues du destinataire) au-delà de ce qui est strictement public et neutre — ça peut mettre mal à l'aise.
- Proposer de passer voir l'entreprise en personne, sauf si l'utilisateur dit explicitement qu'il est disponible pour ça.
- Toute phrase qui sonne comme une excuse ("je ne suis pas souvent à Roanne en ce moment donc...") — ça sème le doute sur la sincérité de la démarche plutôt que de la justifier. Aller droit au but.
- Sur-vendre la maquette comme un produit fini et parfait.
- Afficher l'URL brute de la maquette, ou tout ce qui l'entoure (pseudo GitHub, nom du dépôt) : le client ne doit voir qu'un texte de lien, jamais l'adresse elle-même.
- **Un mail trop long.** Le destinataire est un professionnel occupé, souvent lu depuis un téléphone entre deux clients : il doit saisir l'essentiel en moins d'une minute. Viser autour de 130-150 mots hors formule de politesse et signature. Chaque partie de la structure ci-dessous tient en une à trois phrases, jamais un pavé.
- **Un ton trop lisse, trop écrit, qui sonne artificiel.** Éviter les phrases trop parfaitement construites, les connecteurs logiques appuyés ("ainsi", "par conséquent", "il convient de"), le vocabulaire de plaquette même discret. Viser un ton professionnel mais dégraissé : sobre, direct, sans jargon commercial — phrases courtes, parfois une virgule plutôt qu'une conjonction — sans pour autant tomber dans le familier ou l'oral (pas d'interjections du type "hein", pas de tournures relâchées).

### Structure du mail (à suivre dans cet ordre)

1. **Se présenter d'abord, brièvement, de façon sobre et minimale.** Formule type validée : « [Prénom Nom]. Je conçois des sites sur mesure pour des artisans et commerces du Roannais, et votre site a retenu mon attention. » Deux phrases courtes, rien de plus — pas de récit sur la façon dont on est tombé sur leur site, pas de "tour des artisans du secteur" détaillé. L'ancrage local (le fait d'être du Roannais) ne doit jamais être affirmé frontalement comme argument de vente ("Je suis de Roanne") — ça sonne comme une formule commerciale et ça sonne faux. L'activité (conçoit des sites sur mesure pour des entreprises locales) suffit à situer la démarche sans qu'il soit besoin de revendiquer son origine ni de la justifier davantage.
2. **Une observation précise et sincère sur ce qui manque à leur présence en ligne actuelle**, formulée en prose, jamais en liste. Cette observation doit être spécifique à cette entreprise (pas transposable telle quelle à n'importe quel concurrent) et si possible en lien avec un enjeu concret pour eux (perte de clients, image en décalage avec leur savoir-faire réel, opportunité manquée...).
3. **Annoncer qu'on a construit une maquette plutôt que d'envoyer une plaquette**, en une phrase, sans détailler la liste des fonctionnalités.
4. **Décrire le cœur de la maquette (l'outil central) en un paragraphe narratif**, pas une liste — ce que fait l'outil, pourquoi c'est utile concrètement pour eux et pour leurs clients.
5. **Insérer le lien vers la maquette, en texte cliquable uniquement — jamais l'URL affichée en clair.** Le texte du lien est toujours au format « Maquette – [Nom de l'entreprise] » (tiret cadratin), pointant vers l'URL GitHub Pages de l'étape 4. La phrase autour invite à cliquer, précise que ça s'ouvre directement dans un navigateur, rien à installer.
6. **Paragraphe obligatoire de tempérance**, resserré en 2-3 phrases, glissant naturellement (jamais en liste à puces) cinq éléments :
   - **Ébauche/point de départ**, pas un produit fini — tout est ajustable (textes, couleurs, présentation, et les prix/tarifs si la maquette en affiche) selon les retours du destinataire.
   - **La maquette leur appartient déjà**, quoi qu'il arrive — qu'ils donnent suite ou non.
   - **Un prix garanti nettement en dessous du marché** pour la suite (le vrai site, sur devis). Justifier ce prix bas, mais à peine — une incise de quelques mots glissée dans la même phrase, jamais une phrase à part entière ni un paragraphe de justification : ça attirerait l'attention sur le prix au lieu de le faire passer naturellement, et une justification trop développée éveille le soupçon inverse ("si c'est si peu cher, c'est louche"). L'angle qui fonctionne : travailler en direct, sans structure d'agence ni intermédiaire. Éviter d'insister davantage ou de comparer explicitement à des concurrents ou une fourchette de prix chiffrée dans le mail.
   - **Un rendu final entièrement personnalisable**, pas un gabarit figé.
   - **Un suivi/accompagnement dans la durée si souhaité** (ajustements, évolutions) — sans s'imposer, en le formulant comme une option disponible plutôt qu'un engagement obligatoire.

   Ne pas affirmer dans le mail que "rien n'est à jeter" ou que la maquette "part de son site actuel plutôt que de le remplacer" : c'est en pratique inexact, le client finira par changer de site entièrement, et cette promesse ne tiendrait pas. Le principe de continuité visuelle (étape 4) est une contrainte de conception, pas un argument commercial à formuler explicitement — il doit se voir dans la maquette, pas se lire dans le mail. En revanche, si les couleurs exactes de sa charte n'ont pas pu être récupérées (site protégé au fetch, logo inaccessible), le dire franchement reste utile : ça évite de laisser croire que la palette reproduite est fidèle à 100 %.
7. **Appel à l'action, sans détour ni excuse** : proposer directement soit un retour par mail (ce qui plaît, ce qui ne colle pas avec leur façon de travailler), soit un créneau pour un appel téléphonique. Ne proposer une rencontre en personne que si l'utilisateur a indiqué être disponible pour ça dans cette conversation.
8. **Formule de politesse courte + signature** : prénom, nom, téléphone, ville — chacun sur sa propre ligne (jamais regroupés sur une seule ligne ni séparés par des virgules), par exemple :
   ```
   Thibault Quentin
   06 43 00 21 80
   Roanne
   ```
   (Reprendre les coordonnées personnelles de l'utilisateur telles que déjà connues/mémorisées — nom, numéro de téléphone — sans les lui redemander si elles sont déjà disponibles dans le contexte ou la mémoire.)

### Sujet du mail
Format fixe, toujours le même gabarit : `Nom de l'entreprise - Optimisation de site internet (Maquette créée)`. Exemple : « Immo Factory - Optimisation de site internet (Maquette créée) ». Ne pas varier ce gabarit d'une entreprise à l'autre, même si un objet plus accrocheur semble possible.

**Nom de l'entreprise, pas nom du destinataire.** Utiliser la raison commerciale / l'enseigne telle qu'affichée publiquement (site, Google, Pages Jaunes) — jamais le nom de la personne à qui le mail est adressé, même quand le mail commence par "Bonjour Monsieur/Madame [Nom]". Quand l'entreprise est individuelle et que son enseigne reprend le nom du gérant (cas fréquent chez les artisans), utiliser l'enseigne complète telle qu'elle apparaît sur la devanture ou le site (ex. « Boucherie Jean-Yves Demont », pas simplement « Jean-Yves Demont » qui se lit comme le nom d'un particulier) : le mot d'activité (Boucherie, Menuiserie, Immobilier…) accolé au nom suffit à signaler qu'il s'agit de l'entreprise et non du destinataire personnel.

### Création du brouillon
- Le mail part toujours en HTML, plus jamais en texte brut : utiliser `Gmail:create_draft` avec `to`, `subject`, `htmlBody` (version riche, avec le vrai lien `<a href="URL GitHub Pages">Maquette – [Nom entreprise]</a>` inséré au paragraphe correspondant) et `body` en complément (version texte de secours, pour les clients qui ne rendent pas le HTML) — dans `body` non plus, ne jamais faire apparaître l'URL : reformuler simplement, ex. « Maquette – [Nom entreprise] (lien cliquable dans ce message) ».
- Dans `htmlBody`, séparer les trois lignes de la signature (prénom+nom / téléphone / ville) par des balises `<br>` explicites — un simple saut de ligne dans le HTML est ignoré au rendu et les regrouperait sur une seule ligne. Dans `body` (texte brut), un saut de ligne normal entre chaque suffit.
- Plus de pièce jointe à gérer : la maquette vit sur GitHub Pages, pas dans le mail. Ne pas joindre le fichier HTML au brouillon.

## Étape 6 — Rappel de relance

- Créer un événement `Google Calendar:create_event` environ 2 jours après l'envoi prévu, 15 minutes de durée, avec rappel popup 30 minutes avant.
- Titre : `Relancer [Nom entreprise] (maquette de site)`.
- Description : rappelle à qui le mail a été envoyé (nom + mail), donne le(s) numéro(s) de téléphone de l'entreprise trouvés en étape 2, et résume en une phrase l'angle de relance (l'observation ou l'urgence identifiée en étape 2/3).
- Si plusieurs rappels sont créés le même jour dans des conversations différentes, les décaler de 15-30 minutes les uns des autres pour éviter le chevauchement (vérifier via `recent_chats`/mémoire si un autre rappel a déjà été pris à ce créneau).

## Étape 7 — Livraison

- Copier le fichier final dans `/mnt/user-data/outputs/` et le présenter avec `present_files`, en plus de sa publication sur GitHub (étape 4).
- Résumer en quelques lignes ce qui a été fait (maquette publiée + URL GitHub Pages + brouillon + rappel), sans reformuler tout le mail dans le chat.
- Rappeler explicitement le seul geste manuel qui reste, le cas échéant : coller la ligne dans le Sheets SUIVI PROSPECTION si aucun outil d'édition Sheets n'était disponible (voir étape 4). Il n'y a plus de fichier à joindre manuellement au brouillon.
- Indiquer le titre à donner à la conversation (`Nom entreprise - Ville`).

## Référence

- `references/exemple-mail.md` : un exemple complet de mail conforme au format, à utiliser comme calibrage de ton — ne pas copier son contenu, seulement sa structure et son registre.
- `references/seo-local.md` : les règles de SEO local appliquées à l'étape 4 (title, meta description, schema.org `LocalBusiness`, titres visibles) et surtout la règle de décision qui détermine la zone géographique à employer pour chaque entreprise. À lire avant d'écrire le `<head>` de la maquette.
