# Workflow des Pages Légales IUSO

## Vue d'ensemble

Ce document décrit le workflow complet des pages légales de la plateforme IUSO et leur intégration dans l'application.

## 1. Pages Légales Créées

### 1.1 Mentions Légales (`/legal`)
- **Fichier**: `src/pages/LegalPage.tsx`
- **Contenu**: 
  - Identification de l'entreprise (IUSO-SNE)
  - Directeur de publication
  - Hébergement (Supabase)
  - Propriété intellectuelle
  - Limitation de responsabilité
  - Loi applicable et juridiction
  - Protection des données
  - Lois applicables au Gabon
  - Lexique juridique

### 1.2 Politique de Confidentialité (`/privacy`)
- **Fichier**: `src/pages/PrivacyPolicyPage.tsx`
- **Contenu**:
  - Introduction et engagement RGPD
  - Types de données collectées
  - Finalités du traitement
  - Base légale
  - Durée de conservation
  - Destinataires des données
  - Transferts internationaux
  - Sécurité des données
  - Droits des utilisateurs
  - Cookies et technologies similaires
  - Contact DPO
  - Modifications de la politique

### 1.3 Conditions d'Utilisation (`/terms`)
- **Fichier**: `src/pages/TermsPage.tsx`
- **Contenu**:
  - Objet et acceptation
  - Définitions
  - Conditions d'accès
  - Compte utilisateur
  - Règles d'utilisation
  - Propriété intellectuelle
  - Limitation de responsabilité
  - Indemnisation
  - Résiliation
  - Droit applicable et juridiction

### 1.4 Politique de Cookies (`/cookies`)
- **Fichier**: `src/pages/CookiesPage.tsx`
- **Contenu**:
  - Qu'est-ce qu'un cookie
  - Types de cookies utilisés
  - Finalités des cookies
  - Gestion des préférences
  - Services tiers
  - Instructions de gestion par navigateur

## 2. Système de Gestion des Cookies

### 2.1 Bannière de Cookies
- **Fichier**: `src/components/CookieBanner.tsx`
- **Fonctionnalités**:
  - Affichage automatique si pas de consentement
  - Options: Accepter tout / Refuser tout / Préférences
  - Panneau de préférences détaillé
  - 4 catégories de cookies:
    - Strictement nécessaires (toujours actifs)
    - Fonctionnels
    - Analytiques
    - Marketing

### 2.2 Hook de Gestion du Consentement
- **Fichier**: `src/hooks/useCookieConsent.ts`
- **Fonctionnalités**:
  - Lecture/écriture des préférences dans localStorage
  - Application des préférences (suppression cookies non consentis)
  - Événements personnalisés pour synchronisation
  - Méthodes: hasConsent, updatePreferences, revokeConsent

### 2.3 Bouton de Paramètres
- **Fichier**: `src/components/CookieSettingsButton.tsx`
- **Fonctionnalités**:
  - Bouton flottant en bas à gauche
  - Permet de rouvrir la bannière de consentement
  - Visible uniquement après avoir donné son consentement

## 3. Google Analytics avec Consentement

### 3.1 Utilitaire Analytics
- **Fichier**: `src/utils/analytics.ts`
- **Fonctionnalités**:
  - Initialisation conditionnelle selon consentement
  - File d'attente pour événements pré-consentement
  - Tracking de pages vues, événements, conversions
  - Anonymisation IP (RGPD)
  - Événements prédéfinis pour IUSO:
    - Début/fin d'inscription
    - Vue de formation
    - Téléchargement de document
    - Soumission formulaire contact

### 3.2 Intégration dans l'Application
- **Fichier**: `src/App.tsx`
- **Implémentation**:
  ```typescript
  // Initialisation au démarrage
  useEffect(() => {
    analytics.initialize()
  }, [])

  // Tracking des changements de page
  useEffect(() => {
    analytics.trackPageView(location.pathname)
  }, [location])
  ```

## 4. Navigation et Accessibilité

### 4.1 Routes
Toutes les pages sont accessibles via React Router:
```typescript
<Route path="/legal" element={<LegalPage />} />
<Route path="/privacy" element={<PrivacyPolicyPage />} />
<Route path="/terms" element={<TermsPage />} />
<Route path="/cookies" element={<CookiesPage />} />
```

### 4.2 Liens dans le Footer
- Section dédiée "Liens légaux" dans le footer
- Liens vers toutes les pages légales
- Toujours visibles et accessibles

### 4.3 Intégration dans le Layout
- CookieBanner ajoutée au Layout principal
- CookieSettingsButton ajouté au Layout principal
- S'affichent sur toutes les pages de l'application

## 5. Conformité RGPD/GDPR

### 5.1 Principes Respectés
- **Consentement explicite**: L'utilisateur doit activement accepter
- **Granularité**: Choix par catégorie de cookies
- **Révocabilité**: Possibilité de changer d'avis à tout moment
- **Transparence**: Information claire sur l'utilisation des données
- **Minimisation**: Seules les données nécessaires sont collectées

### 5.2 Droits des Utilisateurs
La politique de confidentialité détaille tous les droits:
- Droit d'accès
- Droit de rectification
- Droit à l'effacement
- Droit à la limitation
- Droit à la portabilité
- Droit d'opposition
- Droit de retrait du consentement

### 5.3 Contact DPO
Coordonnées complètes du Délégué à la Protection des Données:
- Email: dpo@iuso-sne.ga
- Téléphone: +241 01 76 59 60
- Adresse: Libreville, Gabon

## 6. Variables d'Environnement

Pour activer Google Analytics, ajouter dans `.env`:
```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 7. Test du Workflow

### 7.1 Première Visite
1. La bannière de cookies s'affiche après 1 seconde
2. L'utilisateur peut choisir ses préférences
3. Les préférences sont sauvegardées dans localStorage

### 7.2 Visites Suivantes
1. La bannière ne s'affiche plus
2. Le bouton de paramètres est visible
3. Les préférences sont appliquées automatiquement

### 7.3 Modification des Préférences
1. Clic sur le bouton de paramètres
2. La bannière réapparaît
3. L'utilisateur peut modifier ses choix

## 8. Design et UX

### 8.1 Cohérence Visuelle
- Toutes les pages utilisent le même template
- Gradient de fond bleu-violet
- Police Gilroy pour les titres
- Animations subtiles au scroll

### 8.2 Responsive Design
- Adaptation mobile/tablette/desktop
- Bannière de cookies responsive
- Navigation optimisée pour tous les écrans

### 8.3 Accessibilité
- Structure HTML sémantique
- Contraste de couleurs respecté
- Navigation au clavier possible
- Aria-labels sur les éléments interactifs

## 9. Maintenance et Mises à Jour

### 9.1 Mise à Jour des Contenus
Les contenus légaux doivent être revus régulièrement:
- Changements législatifs
- Nouveaux services tiers
- Modifications des traitements de données

### 9.2 Versioning
Chaque page légale contient une date de dernière mise à jour

### 9.3 Historique
Conserver un historique des versions précédentes pour traçabilité

## 10. Conclusion

Le workflow des pages légales est maintenant complet et fonctionnel:
- ✅ 4 pages légales complètes et conformes
- ✅ Système de gestion des cookies RGPD-compliant
- ✅ Google Analytics avec consentement
- ✅ Navigation et accessibilité optimales
- ✅ Design cohérent avec le reste de l'application

La plateforme IUSO est maintenant conforme aux exigences légales en matière de protection des données et d'information des utilisateurs. 