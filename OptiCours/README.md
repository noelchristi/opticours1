# OptiCours - Optimisation de cours pour enseignants universitaires

Une application web moderne pour aider les enseignants universitaires à optimiser leurs cours grâce à l'analyse de contenu et des suggestions pédagogiques.

## 🚀 Fonctionnalités

- **Authentification** : Inscription et connexion des enseignants
- **Upload de documents** : Support pour PDF, DOCX, PPTX
- **Analyse de contenu** : Analyse automatique des documents de cours
- **Suggestions pédagogiques** : Recommandations pour améliorer l'enseignement
- **Interface moderne** : Design responsive avec Tailwind CSS

## 🛠️ Technologies

- **Frontend** : React 18, Vite, Tailwind CSS, Material UI
- **Routing** : React Router DOM
- **Authentification** : Context API avec localStorage (démo)
- **Build** : Vite
- **Linting** : ESLint

## 📁 Structure du projet

```
├── src/
│   ├── components/      # Composants réutilisables
│   │   └── layout/      # Composants de mise en page
│   ├── context/         # Contextes React (Auth)
│   ├── pages/           # Pages de l'application
│   ├── services/        # Services API
│   ├── App.jsx          # Composant principal
│   ├── main.jsx         # Point d'entrée
│   └── index.css        # Styles globaux
├── public/              # Assets statiques
├── index.html           # Template HTML
├── vite.config.js       # Configuration Vite
├── tailwind.config.js   # Configuration Tailwind
├── postcss.config.js    # Configuration PostCSS
└── eslint.config.js     # Configuration ESLint
```

## 🚀 Installation et développement

### Prérequis
- Node.js 18 ou supérieur
- npm

### Installation
```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Lancer le linting
npm run lint

# Construire pour la production
npm run build
```

## 🐳 Déploiement avec Docker

```bash
# Construire l'image Docker
docker build -t opticours .

# Lancer avec Docker Compose
docker-compose up -d
```

## 📝 Scripts disponibles

- `npm install` - Installer les dépendances
- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Construire pour la production
- `npm run lint` - Linter les fichiers source
- `npm run preview` - Prévisualiser la build de production

## 🔧 Configuration

### Variables d'environnement
Créez un fichier `.env` à la racine du projet :

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=OptiCours
```

### Déploiement
- **Apache** : Utilisez le fichier `.htaccess` fourni
- **Nginx** : Utilisez le fichier `nginx.conf` fourni
- **Docker** : Utilisez le `Dockerfile` et `docker-compose.yml`

## 📄 Licence

Ce projet est sous licence MIT.
