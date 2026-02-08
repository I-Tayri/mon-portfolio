#!/bin/bash

# Audit complet du portfolio avec Claude Code
# Usage: ./scripts/audit.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
REPORTS_DIR="$PROJECT_DIR/reports"
DATE=$(date +%Y-%m-%d)

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}       Audit du Portfolio - $DATE${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""

# Créer le dossier reports
mkdir -p "$REPORTS_DIR"

cd "$PROJECT_DIR"

# 1. Audit d'accessibilité
echo -e "${GREEN}[1/3]${NC} Audit d'accessibilité..."
claude -p "Utilise l'agent accessibility-checker pour auditer l'accessibilité du site. Génère un rapport détaillé avec les problèmes trouvés et les recommandations." --output-format text > "$REPORTS_DIR/accessibilite-$DATE.md"
echo "     → $REPORTS_DIR/accessibilite-$DATE.md"

# 2. Revue de code
echo -e "${GREEN}[2/3]${NC} Revue de code..."
claude -p "Utilise l'agent code-reviewer pour faire une revue de code complète. Vérifie la qualité, la performance et la maintenabilité." --output-format text > "$REPORTS_DIR/revue-code-$DATE.md"
echo "     → $REPORTS_DIR/revue-code-$DATE.md"

# 3. Checklist de déploiement
echo -e "${GREEN}[3/3]${NC} Checklist de déploiement..."
claude -p "/deploy-checklist" --output-format text > "$REPORTS_DIR/deploiement-$DATE.md"
echo "     → $REPORTS_DIR/deploiement-$DATE.md"

# Résumé
echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}                 Résumé${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""
echo "Rapports générés dans $REPORTS_DIR :"
echo ""
ls -la "$REPORTS_DIR"/*-$DATE.md 2>/dev/null | awk '{print "  " $NF " (" $5 " bytes)"}'
echo ""
echo -e "${GREEN}Audit terminé.${NC}"
