# Projet Gestion Agricole

Application de gestion de production agricole (Produits, Variétés, Récoltes, Ventes, Pertes).

## 🚀 Prérequis

*   **Node.js** (v18 ou plus recommand estallé)
*   **Oracle Database** (XE ou Enterprise) installée localement ou accessible à distance.

## 🛠️ Configuration de la Base de Données (Oracle)

Pour que l'application Node.js puisse se connecter à Oracle, suivez ces étapes :

### 1. Installation du Client Oracle (Si nécessaire)
Si vous n'avez pas installé la base de données complète sur votre machine, installez **Oracle Instant Client**.

### 2. Configuration des Identifiants
Le fichier de configuration de la base de données se trouve dans `backend/db.js`.
Assurez-vous que les informations correspondent à votre installation Oracle locale :

```javascript
// backend/db.js
user: "mamadou",             // Votre utilisateur Oracle
password: "pass2025",        // Votre mot de passe
connectString: "localhost:1521/XEPDB1" // Hôte:Port/Service
```

### 3. Initialisation des Tables
Un script est disponible pour créer les tables nécessaires.
Depuis le dossier `backend`, exécutez :
```bash
node setup.js
```

## 📦 Installation et Lancement

### Backend
```bash
cd backend
npm install
node index.js
```
Le serveur démarrera sur `http://localhost:3001`.

### Frontend
```bash
cd frontend
npm install
npm start
```
L'application s'ouvrira sur `http://localhost:3000`.
