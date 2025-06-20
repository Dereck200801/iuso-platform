# Correction des Erreurs d'Inscription

## Problèmes Identifiés

1. **Erreur "User not allowed"** : Le code tentait d'utiliser l'API Admin de Supabase depuis le frontend
2. **Clé de service exposée** : La clé service_role était exposée dans le code client (grave problème de sécurité)
3. **Rate limiting (429)** : Trop de tentatives d'inscription en peu de temps

## Solutions Apportées

### 1. Suppression de la Clé Service Role

La clé service role a été supprimée du code client (`src/lib/supabase.ts`). Cette clé ne doit JAMAIS être exposée côté client car elle donne un accès administrateur complet à votre base de données.

### 2. Nouveau Système de Stockage Temporaire

Au lieu d'utiliser l'API Admin, nous utilisons maintenant :
- Une table `inscrits_temp` pour stocker temporairement les données d'inscription
- localStorage comme solution de secours
- Une fonction SQL sécurisée pour transférer les données après vérification

### 3. Gestion du Rate Limiting

- Ajout d'un compteur qui affiche le temps d'attente restant
- Désactivation du bouton de soumission pendant la période d'attente
- Message d'alerte clair pour l'utilisateur

## Instructions d'Installation

### Étape 1 : Exécuter le Script SQL

1. Connectez-vous à votre dashboard Supabase
2. Allez dans SQL Editor
3. Copiez et exécutez le contenu du fichier `fix-inscription-system.sql`

### Étape 2 : Redémarrer l'Application

```bash
npm run dev
```

## Flux d'Inscription Corrigé

1. **Inscription** : Les données sont stockées temporairement dans `inscrits_temp` ou localStorage
2. **Vérification Email** : L'utilisateur clique sur le lien de vérification
3. **Transfert** : Les données sont transférées automatiquement vers la table `inscrits`
4. **Nettoyage** : Les données temporaires sont supprimées

## Sécurité

- ✅ Plus d'exposition de clés sensibles
- ✅ Utilisation de RLS (Row Level Security) pour protéger les données
- ✅ Fonctions SQL sécurisées avec `SECURITY DEFINER`
- ✅ Gestion appropriée des permissions

## Test de l'Inscription

1. Allez sur la page d'inscription
2. Remplissez le formulaire
3. Si vous voyez une erreur de rate limiting, attendez le temps indiqué
4. Après soumission, vérifiez votre email
5. Cliquez sur le lien de vérification
6. Votre inscription sera finalisée automatiquement

## En Cas de Problème

Si vous rencontrez encore des erreurs :

1. Vérifiez que le script SQL a été exécuté correctement
2. Videz le cache du navigateur (Ctrl+Shift+Delete)
3. Vérifiez les logs dans Supabase Dashboard > Logs
4. Assurez-vous que les emails de vérification sont activés dans Authentication > Settings

## Notes Importantes

- Ne jamais exposer les clés service_role dans le code frontend
- Toujours utiliser RLS pour protéger vos tables
- Implémenter une gestion appropriée du rate limiting
- Tester le flux complet d'inscription avant la mise en production 