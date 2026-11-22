# Active ton Superpouvoir

Site React et TypeScript construit avec Vite. La navigation fonctionne côté navigateur; aucun serveur applicatif n’est requis pour le parcours courant.

## Prérequis

- Node.js `22.23.4` (voir `.nvmrc`)
- npm `10.9.9` (version déclarée dans `package.json`)

## Installation et développement

```bash
npm ci
npm run dev
```

Vite démarre par défaut sur le port `5173`. Pour lancer la prévisualisation Webdev configurée sur `3000`, utilisez `npm run dev -- --host 0.0.0.0 --port 3000`.

## Build statique

```bash
npm run build
```

Le site compilé est écrit dans `dist/`.

## Structure

- `src/components/` : composants réutilisables, navigation et éléments de marque.
- `src/pages/` : pages et parcours du site.
- `src/data/` : contenus, catalogue et données des médias.
- `public/` : logo, visuels de cartes, motif décoratif de la hero et logos de presse.
- `qa/` : scripts de contrôle du rendu et des parcours.

Les logos et visuels locaux sont inclus dans `public/`. Les photographies éditoriales de `src/data/media.ts` restent référencées depuis Pexels et nécessitent une connexion Internet. Les logos de presse sont des marques protégées; vérifier les autorisations applicables avant toute publication publique.

Le panier et le checkout constituent un parcours de démonstration côté navigateur; aucun paiement réel n’est déclenché.
