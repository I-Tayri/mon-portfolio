# Génération de l'image OG (Open Graph)

L'image `og-image.png` est utilisée pour les partages sur les réseaux sociaux (LinkedIn, Twitter, Facebook).

## Dimensions requises
- Largeur : 1200px
- Hauteur : 630px

## Option 1 : Avec Node.js (recommandé)

```bash
cd /Users/amazigh/Desktop/mon-portfolio
npm install canvas
node scripts/generate-og-image.js
```

## Option 2 : Conversion manuelle du SVG

1. Ouvrir `assets/images/og-image.svg` dans un navigateur
2. Faire une capture d'écran aux dimensions 1200x630
3. Sauvegarder sous `assets/images/og-image.png`

## Option 3 : Utiliser un convertisseur en ligne

1. Aller sur https://svgtopng.com/ ou https://cloudconvert.com/svg-to-png
2. Uploader `assets/images/og-image.svg`
3. Définir les dimensions : 1200x630
4. Télécharger le PNG et le placer dans `assets/images/og-image.png`

## Vérification

Une fois l'image créée, vous pouvez tester le rendu sur :
- https://www.opengraph.xyz/
- https://cards-dev.twitter.com/validator
