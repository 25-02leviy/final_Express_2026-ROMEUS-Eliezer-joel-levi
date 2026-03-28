# API Gestion Credits Materiaux

API Express + MongoDB pour gerer les utilisateurs, les clients, les credits et les paiements.

## Demarrage

```bash
npm start
```

## Variables d'environnement

```env
MONGO_URI=mongodb://localhost:27017/final_com
PORT=2502
TOKEN_SECRET=romeus_dev_secret_2026
```

## Fonctionnalites

- Authentification : inscription, connexion, profil utilisateur
- Clients : ajout, liste, suppression, photo en Base64
- Credits : creation, liste, detail, reste a payer
- Paiements : ajout, historique par credit

## Format photo client

Envoyer `photoBase64` dans le corps JSON lors de la creation d'un client.

## Exemple de credit

```json
{
  "clientId": "ID_DU_CLIENT",
  "produit": "ciment",
  "quantite": 50,
  "montantTotal": 10000
}
```
