#!/bin/bash

# Configuration SSL avec Let's Encrypt
# Usage: ./ssl-setup.sh your-domain.com

DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo "Usage: ./ssl-setup.sh your-domain.com"
    exit 1
fi

echo "🔒 Configuration SSL pour $DOMAIN..."

# Installer Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtenir le certificat SSL
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN

# Configurer le renouvellement automatique
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -

echo "✅ SSL configuré avec succès!"
echo "🌐 Votre site est maintenant accessible en HTTPS: https://$DOMAIN" 