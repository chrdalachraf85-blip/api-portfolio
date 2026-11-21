# Atelier Fetch × GitHub — Guide de l'Atelier

Bienvenue dans cet atelier ! L'objectif est de créer un **portfolio dynamique** en récupérant les données d'un utilisateur depuis l'API de GitHub grâce à JavaScript (`fetch`), puis de les afficher dans une interface HTML préexistante.

Le design (HTML/CSS) et le dossier `mock/` sont déjà prêts. Vous devez uniquement coder la logique dans le fichier **`app.js`**.

---

## Sommaire
1. [Configuration et Variables Globales](#1-configuration-et-variables-globales)
2. [Étape 1 : Récupération des données (`fetch`)](#2-étape-1--récupération-des-données-fetch)
3. [Étape 2 : Affichage du profil utilisateur](#3-étape-2--affichage-du-profil-utilisateur)
4. [Étape 3 : Affichage des dépôts (Repositories)](#4-étape-3--affichage-des-dépôts-repositories)
5. [Étape 4 : Gestion du chargement, des erreurs et de la fonction principale](#5-étape-4--gestion-du-chargement-des-erreurs-et-de-la-fonction-principale)
6. [Étape 5 : Explorer un autre profil](#6-étape-5--explorer-un-autre-profil)
7. [Étape 6 : Filtrer les dépôts en direct](#7-étape-6--filtrer-les-dépôts-en-direct)
8. [Lancement de l'application](#8-lancement-de-lapplication)
9. [⚠️ Note importante sur l'API GitHub](#-note-importante-sur-lapi-github)

---

### 1. Configuration et Variables Globales
Commencez par définir les variables de base nécessaires au bon fonctionnement de l'application :
* Un nom d'utilisateur par défaut (ex: `'octocat'`).
* Un booléen `USE_MOCK` réglé sur `false` (passez-le à `true` si l'API GitHub vous bloque).
* Un tableau `allRepos` pour stocker les projets de l'utilisateur.
* Une variable `currentUser` pour retenir le profil actuellement affiché (utile pour le bouton "Réessayer").

---

### 2. Étape 1 : Récupération des données (`fetch`)
Vous devez créer deux fonctions pour gérer les requêtes réseau :
1. **`getUrl(path)`** : Retourne l'URL vers l'API officielle (`https://api.github.com${path}`) ou vers les fichiers du dossier `mock/` si `USE_MOCK` est à `true`.
2. **`fetchJSON(path)`** : Une fonction asynchrone (`async/await`) qui appelle `fetch()`, vérifie si la réponse est valide (`response.ok`), lance une erreur si ce n'est pas le cas, et retourne les données au format JSON.

---

### 3. Étape 2 : Affichage du profil utilisateur
Créez une fonction `renderProfile(user)` qui prend en paramètre l'objet utilisateur renvoyé par l'API. Elle doit mettre à jour les éléments du DOM :
* L'avatar (`src` et `alt`)
* Le nom et le pseudo (`@login`)
* La biographie, la localisation, la date de création du compte et le lien vers le profil GitHub.
* Les statistiques (nombre de dépôts, abonnés, abonnements).

---

### 4. Étape 3 : Affichage des dépôts (Repositories)
Cette étape se divise en deux parties :
1. **`createRepoCard(repo)`** : Utilise la balise `<template id="repo-template">` du HTML pour cloner et remplir une carte de dépôt (nom, description, étoiles, forks, langage, date de mise à jour).
2. **`renderRepos(repos)`** : Vide la grille des dépôts, parcourt le tableau des projets pour y ajouter les cartes générées, met à jour le compteur de projets, et gère l'affichage du message "Aucun projet" si la liste est vide.

---

### 5. Étape 4 : Gestion du chargement, des erreurs et de la fonction principale
L'application doit gérer trois états visuels (chargement, erreur, contenu) :
1. **`showSection(id)`** : Masque tous les blocs d'état et affiche uniquement celui demandé.
2. **`getErrorMessage(error, username)`** : Traduit les codes d'erreur HTTP (comme `404` ou `403`) en messages clairs pour l'utilisateur.
3. **`loadPortfolio(username)`** : La fonction principale qui orchestre le tout de manière asynchrone :
   * Affiche l'état de chargement.
   * Récupère en parallèle ou à la suite les données de l'utilisateur et ses dépôts (`/users/${username}` et `/users/${username}/repos`).
   * Filtre les dépôts pour ignorer les forks (`!repo.fork`).
   * Appelle `renderProfile` et `renderRepos`.
   * Gère les erreurs dans un bloc `try...catch` en affichant le message approprié.
   * Gère l'écouteur d'événements du bouton **"Réessayer"**.

---

### 6. Étape 5 : Explorer un autre profil
Permettez à l'utilisateur de chercher un autre profil GitHub en écoutant la soumission (`submit`) du formulaire de recherche. Récupérez la valeur saisie dans l'input, nettoyez les espaces superflus avec `.trim()`, puis relancez `loadPortfolio(username)`.

---

### 7. Étape 6 : Filtrer les dépôts en direct
Ajoutez un écouteur d'événements de type `input` sur la barre de recherche des dépôts. À chaque frappe :
* Récupérez la valeur de l'input en minuscules.
* Filtrez le tableau global `allRepos` en vérifiant si le nom du dépôt contient la recherche.
* Réaffichez les résultats filtrés en appelant `renderRepos(filtered)`.

---

### 8. Lancement de l'application
Pour terminer, n'oubliez pas d'appeler `loadPortfolio(USERNAME)` tout en bas du script pour lancer l'application dès le chargement de la page.

---

### ⚠️ Note importante sur l'API GitHub
> **Attention à la limite de requêtes (Rate Limit) :**
> L'API publique de GitHub limite les requêtes non authentifiées à **60 requêtes par heure et par adresse IP**. 
> Si vous dépassez cette limite, l'API renverra une erreur `403`. Pour éviter d'être bloqué pendant le développement ou en salle de cours, passez la variable de configuration **`USE_MOCK` à `true`** pour utiliser les fichiers locaux du dossier `mock/`.


### Test the api using your github username via Browser (Chrome, Brave, Edge)
- getting the profile information
> https://api.github.com/users/zakariabensaid-360

- getting user repos
> https://api.github.com/users/zakariabensaid-360/repos?sort=updated&per_page=100
