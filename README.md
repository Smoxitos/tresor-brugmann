# À la recherche du trésor de Brugmann

Petit jeu de piste React + TypeScript conçu pour accompagner le départ d’un collègue vers le Liban.

Site public : <https://smoxitos.github.io/tresor-brugmann/>

## Lancer le projet

Sur cette machine, le plus simple est de double-cliquer sur `LANCER-LE-SITE.bat` à la racine du dossier.

Avec une installation classique de Node.js :

```bash
npm install
npm run dev
```

Vite affiche ensuite l’adresse locale à ouvrir dans le navigateur (généralement `http://localhost:5173`).

Commandes de vérification :

```bash
npm run typecheck
npm test
npm run build
```

## Remplacer les images

- Carte principale : `public/images/carte-brugmann.png`
- Photo réelle de l’équipe : `public/images/equipe.jpg`

Le fichier `equipe.jpg` livré avec le projet est un placeholder. Remplacez-le simplement par la vraie photo, en conservant exactement ce nom. Si le fichier est absent, invalide ou correspond encore au placeholder très vertical, le site affiche automatiquement un visuel de remplacement élégant.

## Personnaliser le jeu

Tous les contenus modifiables se trouvent dans `src/data/gameData.ts` : textes, énigmes, choix, réponses correctes, indices, messages, chemins d’images et coordonnées des marqueurs.

Les positions utilisent des pourcentages : `x: 0` correspond au bord gauche, `x: 100` au bord droit, `y: 0` au haut et `y: 100` au bas de la carte.
