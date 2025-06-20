# 🎓 Guide d'Inscription au Concours L1 & BTS - IUSO-SNE

## 📋 **Vue d'ensemble**

Le formulaire d'inscription au concours L1 & BTS est maintenant entièrement fonctionnel avec :
- ✅ Création automatique de compte utilisateur
- ✅ Upload sécurisé des documents
- ✅ Attribution automatique d'un numéro de dossier
- ✅ Enregistrement dans la base de données Supabase
- ✅ Page de confirmation avec récapitulatif

## 🔧 **Configuration technique**

### **Base de données**
La table `inscrits` contient tous les champs nécessaires :
- Informations personnelles (prénom, nom, genre, date de naissance, etc.)
- Coordonnées (email, téléphone, adresse)
- Formation choisie (cycle, filière)
- Documents uploadés (photo, attestation bac)
- Statut et matricule auto-généré

### **Storage Supabase**
- Bucket `pieces-candidats` configuré
- Dossiers séparés : `photos/` et `attestations-bac/`
- Validation des formats et tailles de fichiers

## 📝 **Processus d'inscription**

### **Étape 1 : Informations personnelles**
- Prénom et nom (obligatoires)
- Genre : Masculin / Féminin / Autre
- Date de naissance (input date)
- Lieu de naissance (liste des villes du Gabon + Autre)
- Nationalité (liste complète des pays)

### **Étape 2 : Coordonnées**
- Email (servira d'identifiant de connexion)
- Téléphone (format +241 XX XX XX XX)
- Adresse complète

### **Étape 3 : Accès au compte**
- Mot de passe sécurisé (8 caractères min + complexité)
- Confirmation du mot de passe
- Boutons de visualisation des mots de passe

### **Étape 4 : Choix de formation**
- Cycle d'études : Licence L1 ou BTS 1ère année
- Filières dynamiques selon le cycle :

#### **Licence L1 (7 filières) :**
- Management des Organisations
- Gestion des Ressources Humaines
- Économie et Finance
- Analyse Économique
- Droit des Affaires
- Droit Public
- Communication des Organisations

#### **BTS 1ère année (2 filières) :**
- Carrières Juridiques et Judiciaires
- Gestion de l'Information et de la Documentation

### **Étape 5 : Documents et finalisation**
- **Photo d'identité** : JPEG/PNG, max 2MB, fond clair
- **Attestation du Baccalauréat** : PDF/JPEG/PNG, max 5MB
- Case d'acceptation des conditions obligatoire
- Récapitulatif complet avant soumission

## 🔄 **Flux technique de soumission**

1. **Validation du formulaire** (tous les champs requis)
2. **Création du compte Supabase Auth** avec email/mot de passe
3. **Upload de la photo d'identité** vers `pieces-candidats/photos/`
4. **Upload de l'attestation du bac** vers `pieces-candidats/attestations-bac/`
5. **Insertion dans la table `inscrits`** avec tous les champs
6. **Génération automatique du matricule** (ex: LIC24XXXX, DUT24XXXX)
7. **Redirection vers page de confirmation** avec numéro de dossier

## 📊 **Numérotation des dossiers**

Le système génère automatiquement des matricules uniques :
- **Format** : `[CYCLE][ANNÉE][4 CHIFFRES ALÉATOIRES]`
- **Exemples** :
  - Licence L1 : `LIC241234`
  - BTS : `DUT241234`

## 🎯 **Fonctionnalités de sécurité**

### **Validation côté client**
- Formats de fichiers vérifiés
- Tailles de fichiers limitées
- Critères de mot de passe stricts
- Validation des emails

### **Validation côté serveur**
- Vérification des uploads
- Nettoyage en cas d'erreur
- Unicité des emails
- Attribution sécurisée des matricules

### **Row Level Security (RLS)**
- Accès sécurisé aux données
- Permissions par rôle (candidat/admin)
- Protection des fichiers uploadés

## 📧 **Après l'inscription**

### **Page de confirmation**
- Affichage du numéro de dossier
- Récapitulatif des documents soumis
- Prochaines étapes du processus
- Liens vers l'espace candidat

### **Email de confirmation**
- Envoi automatique à l'adresse fournie
- Confirmation du numéro de dossier
- Instructions pour la suite

### **Processus de validation**
1. **Validation du dossier** (5 jours ouvrables)
2. **Convocation aux épreuves** (si retenu)
3. **Communication des résultats**

## 🛠 **Maintenance et administration**

### **Statistiques disponibles**
- Vue `stats_candidatures` : statistiques globales
- Vue `stats_par_filiere` : répartition par filière
- Vue `stats_par_ville` : répartition géographique
- Fonction `get_stats_detaillees()` : statistiques complètes

### **Gestion des candidatures**
- Interface admin pour consulter les dossiers
- Possibilité de valider/refuser les candidatures
- Système de messagerie intégré
- Export des données pour les convocations

## 🔍 **Vérification du bon fonctionnement**

Pour tester l'inscription :
1. Accéder à `/inscription`
2. Remplir toutes les étapes
3. Vérifier l'upload des documents
4. Confirmer la création du compte
5. Vérifier l'insertion en base de données
6. Contrôler l'attribution du matricule
7. Valider la redirection vers la confirmation

## 📞 **Support technique**

En cas de problème :
- Vérifier la configuration Supabase
- Contrôler les permissions de la table `inscrits`
- Vérifier la configuration du bucket `pieces-candidats`
- Consulter les logs d'erreur dans la console

---

✅ **Le système d'inscription au concours L1 & BTS est maintenant pleinement opérationnel !** 