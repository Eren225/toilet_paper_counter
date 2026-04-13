# PQ_Counter - 4eme 204

## 📝 Présentation du projet

PQ_Counter est une application web professionnelle et minimaliste permettant de gérer la consommation de rouleaux de papier toilette au sein d'une colocation (désignée sous le nom de **4eme 204**).

L'application est utilisée par 4 colocataires : **Mattéo, Mathis, Erwan, et Elie**.

Le but principal est d'éviter les conflits et de savoir avec précision qui consomme quoi, afin de répartir équitablement la responsabilité de l'achat du prochain paquet.

## 🎯 Fonctionnalités principales

- **Authentification complète (via Supabase)** : Chaque colocataire possède son compte sécurisé.
- **Comptabilisation Individuelle** : Suivi du nombre de rouleaux consommés par chaque personne au cours du "cycle" (paquet) actuel.
- **Nouveau Paquet (Reset)** : Lorsqu'un membre achète un nouveau paquet, il indique le nombre de rouleaux contenus. Cela réinitialise la session en cours et remet les compteurs à 0 pour démarrer un nouveau cycle.
- **Suivi de l'Acheteur** : Permet de déterminer à qui c'est le tour de faire cet achat lors du prochain épuisement des stocks.

## 💻 Stack Technique

- **Frontend** : React (via Vite)
- **Backend & Base de données** : Supabase (Authentification, PostgreSQL)
- **Design & UI** : Interface minimaliste, sérieuse et claire.
- **Architecture & Code** : Une **énorme séparation des responsabilités** (Separation of Concerns) est attendue. Le code métier, l'accès aux données (Supabase), les composants visuels et la gestion d'état doivent être strictement découplés pour garantir la maintenabilité du projet.

## 🚀 Évolutions futures et base de données (Prévisionnel)

**Tables Supabase (à créer) :**

1.  users : Gère le profil des 4 colocataires.
2.  packs : Historique des achats de paquets (date, acheteur, quantité de rouleaux).
3.  usages : Chaque utilisation d'un rouleau, liée à l'utilisateur et au paquet courant.

## 👨‍💻 Installation & Démarrage (À compléter)

_Cette section sera enrichie au fur et à mesure du développement de l'application React/Vite._
