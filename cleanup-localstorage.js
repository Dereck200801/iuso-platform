// Script de nettoyage localStorage - À exécuter dans la console du navigateur
console.log('🧹 Nettoyage localStorage...');

// Supprimer toutes les données de test du localStorage
const keysToClean = [
  'inscrits_data',
  'user_data', 
  'form_data',
  'messages_data',
  'last_sync_time',
  'has_unsynced_changes'
];

keysToClean.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log('✅ Supprimé:', key);
  }
});

// Nettoyer les données spécifiques à Jean Dupont
const allKeys = Object.keys(localStorage);
allKeys.forEach(key => {
  try {
    const value = localStorage.getItem(key);
    if (value && (value.includes('Jean') || value.includes('Dupont') || value.includes('jean.dupont') || value.includes('t095381@test.com'))) {
      localStorage.removeItem(key);
      console.log('✅ Supprimé données de test:', key);
    }
  } catch (e) {
    // Ignorer les erreurs de parsing
  }
});

console.log('🎉 Nettoyage localStorage terminé !');
console.log('⚠️  Rechargez la page pour appliquer les changements');