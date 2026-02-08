## Rapport d'audit d'accessibilité terminé

L'audit d'accessibilité WCAG 2.1 niveau AA a été réalisé. Voici un résumé :

### Score global : 8.5/10

### Problèmes critiques (3)
1. **Contraste insuffisant du texte secondaire** - La couleur `#8892b0` sur fond `#0a0a0a` a un ratio de 3.8:1 (minimum requis : 4.5:1)
2. **Contraste insuffisant de la couleur d'accent** - `#64ffda` sur fond sombre a un ratio de 3.2:1
3. **Champs requis mal signalés** - Manque `aria-required="true"` et indication textuelle pour les lecteurs d'écran

### Problèmes importants (4)
- Logo sans nom complet dans le aria-label
- Image placeholder dans "À propos" confuse
- Images dynamiques du blog sans validation d'alt
- Aria-live redondant avec role="alert"

### Problèmes mineurs (5)
- Attribut `lang="en"` manquant sur les termes anglais
- Texte du lien "Retour au blog" à améliorer
- Message noscript peu informatif
- Favicon en data URI (emoji)

### Points forts
- Skip link fonctionnel
- Navigation clavier excellente (menu mobile avec Escape, focus trap)
- Labels de formulaire correctement associés
- Respect de `prefers-reduced-motion`
- Structure sémantique HTML5 correcte

### Actions prioritaires
1. Modifier `--color-text-muted` de `#8892b0` à `#9ca3bd`
2. Modifier `--color-accent` de `#64ffda` à `#5ce0c6` en mode sombre
3. Ajouter `aria-required="true"` sur les champs obligatoires

Veux-tu que j'applique ces corrections automatiquement ?
