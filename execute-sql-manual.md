# 📋 Guide pour exécuter manuellement le script SQL

Comme il y a des problèmes avec Docker, voici comment exécuter manuellement les commandes SQL pour mettre à jour la table `inscrits` :

## 🔧 **Option 1 : Via Supabase Dashboard**

1. **Connectez-vous à votre tableau de bord Supabase**
2. **Allez dans l'éditeur SQL** (SQL Editor)
3. **Copiez et exécutez les commandes suivantes une par une :**

```sql
-- Ajouter les colonnes manquantes pour le concours
ALTER TABLE inscrits 
ADD COLUMN IF NOT EXISTS genre VARCHAR(20),
ADD COLUMN IF NOT EXISTS date_naissance DATE,
ADD COLUMN IF NOT EXISTS lieu_naissance VARCHAR(100),
ADD COLUMN IF NOT EXISTS nationalite VARCHAR(100);
```

```sql
-- Créer des index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_inscrits_genre ON inscrits(genre);
CREATE INDEX IF NOT EXISTS idx_inscrits_date_naissance ON inscrits(date_naissance);
CREATE INDEX IF NOT EXISTS idx_inscrits_lieu_naissance ON inscrits(lieu_naissance);
CREATE INDEX IF NOT EXISTS idx_inscrits_nationalite ON inscrits(nationalite);
```

```sql
-- Mettre à jour la vue des statistiques
CREATE OR REPLACE VIEW stats_candidatures AS
SELECT 
    COUNT(*) as total_candidats,
    COUNT(CASE WHEN status = 'en_cours' THEN 1 END) as en_cours,
    COUNT(CASE WHEN status = 'valide' THEN 1 END) as valides,
    COUNT(CASE WHEN status = 'refuse' THEN 1 END) as refuses,
    COUNT(CASE WHEN studycycle = 'licence1' THEN 1 END) as licence1,
    COUNT(CASE WHEN studycycle = 'dut' THEN 1 END) as bts_dut,
    COUNT(CASE WHEN genre = 'masculin' THEN 1 END) as masculin,
    COUNT(CASE WHEN genre = 'feminin' THEN 1 END) as feminin,
    COUNT(CASE WHEN genre = 'autre' THEN 1 END) as autre,
    COUNT(CASE WHEN nationalite = 'Gabon' THEN 1 END) as gabonais,
    COUNT(CASE WHEN nationalite != 'Gabon' THEN 1 END) as etrangers
FROM inscrits;
```

```sql
-- Créer une vue pour les candidats par ville de naissance
CREATE OR REPLACE VIEW stats_par_ville AS
SELECT 
    lieu_naissance,
    COUNT(*) as total,
    COUNT(CASE WHEN status = 'valide' THEN 1 END) as valides,
    COUNT(CASE WHEN status = 'refuse' THEN 1 END) as refuses,
    COUNT(CASE WHEN status = 'en_cours' THEN 1 END) as en_cours
FROM inscrits
WHERE lieu_naissance IS NOT NULL
GROUP BY lieu_naissance
ORDER BY total DESC;
```

## 🔧 **Option 2 : Via psql (si PostgreSQL local)**

Si vous avez PostgreSQL installé localement :

```bash
psql -U postgres -d votre_base -f update-inscrits-table.sql
```

## 🔧 **Option 3 : Via Docker (si ça marche)**

```bash
# Copier le fichier SQL dans le conteneur
docker cp update-inscrits-table.sql nom_conteneur_db:/tmp/

# Exécuter le script
docker exec nom_conteneur_db psql -U postgres -d postgres -f /tmp/update-inscrits-table.sql
```

## ✅ **Vérification**

Après avoir exécuté les commandes, vérifiez que tout fonctionne :

```sql
-- Vérifier la structure de la table
\d inscrits

-- Vérifier les nouvelles colonnes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'inscrits' 
AND column_name IN ('genre', 'date_naissance', 'lieu_naissance', 'nationalite');

-- Tester la vue des statistiques
SELECT * FROM stats_candidatures;
```

## 🎯 **Une fois terminé**

Le système d'inscription sera prêt à :
- ✅ Recevoir les nouvelles candidatures
- ✅ Générer automatiquement les matricules  
- ✅ Stocker tous les champs du formulaire
- ✅ Afficher les statistiques détaillées

---

**Note :** Si vous rencontrez des problèmes, vous pouvez toujours tester le formulaire d'inscription même sans la base de données complètement configurée. Le formulaire est fonctionnel et affichera les erreurs de connexion de manière appropriée. 