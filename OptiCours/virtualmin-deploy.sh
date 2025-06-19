#!/bin/bash

# Script de déploiement OptiCours pour Virtualmin/Webmin sur AlmaLinux 9
# Usage: ./virtualmin-deploy.sh

set -e

echo "🚀 Déploiement OptiCours sur Virtualmin..."

# Variables
DOMAIN="opticours.itrc.tech"
WEB_ROOT="/home/opticours/public_html"
BACKUP_DIR="/home/opticours/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Créer les répertoires
mkdir -p $WEB_ROOT
mkdir -p $BACKUP_DIR

# Sauvegarder l'ancienne version
if [ -d "$WEB_ROOT/dist" ]; then
    echo "📦 Sauvegarde de l'ancienne version..."
    cp -r $WEB_ROOT/dist $BACKUP_DIR/opticours_$TIMESTAMP
fi

# Installer Node.js si pas déjà installé
if ! command -v node &> /dev/null; then
    echo "📦 Installation de Node.js..."
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo yum install -y nodejs
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Build de l'application
echo "🔨 Build de l'application..."
npm run build

# Copier les fichiers buildés
echo "📁 Copie des fichiers..."
cp -r dist/* $WEB_ROOT/

# Définir les permissions
echo "🔐 Configuration des permissions..."
chmod -R 755 $WEB_ROOT
chown -R opticours:opticours $WEB_ROOT

# Nettoyer les anciennes sauvegardes (garder les 5 plus récentes)
echo "🧹 Nettoyage des anciennes sauvegardes..."
cd $BACKUP_DIR
ls -t | tail -n +6 | xargs -r rm -rf

echo "✅ Déploiement terminé avec succès!"
echo "🌐 Votre application est accessible sur: https://$DOMAIN" 