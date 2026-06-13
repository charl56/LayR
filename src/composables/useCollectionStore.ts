import { ref, computed } from 'vue';

// 📐 Structure d'un projet enregistré dans la collection
export interface SavedProject {
  artistId: string;
  projectId: string;
  unlockedAt: string; // Date du scan pour pouvoir trier par nouveauté
}

const STORAGE_KEY = 'layr_unlocked_projects';

// 💡 État GLOBAL et UNIQUE (Déclaré en dehors du hook pour agir comme un Store)
// On tente de charger les données existantes du localStorage au démarrage
const initialData = localStorage.getItem(STORAGE_KEY);
const collection = ref<SavedProject[]>(initialData ? JSON.parse(initialData) : []);

export function useCollectionStore() {

  // --- 💾 MÉTHODE PRIVÉE : Sauvegarde dans le localStorage
  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collection.value));
  };

  // --- ➕ MÉTHODE : Ajouter un projet à la collection
  const addProjectToCollection = (artistId: string, projectId: string) => {
    // On vérifie si ce projet exact n'est pas déjà enregistré
    const exists = collection.value.some(
      (p) => p.artistId === artistId && p.projectId === projectId
    );

    if (!exists) {
      collection.value.push({
        artistId,
        projectId,
        unlockedAt: new Date().toISOString()
      });
      saveToStorage();
      console.log(`🎉 Projet [${projectId}] de l'artiste [${artistId}] ajouté à la collection !`);
    }
  };

  // --- ❌ MÉTHODE : Supprimer un projet de la collection
  const removeProjectFromCollection = (artistId: string, projectId: string) => {
    collection.value = collection.value.filter(
      (p) => !(p.artistId === artistId && p.projectId === projectId)
    );
    saveToStorage();
    console.log(`🗑️ Projet [${projectId}] supprimé de la collection.`);
  };

  // --- 🔍 MÉTHODE : Consulter si un projet spécifique est débloqué (Retourne un Boolean)
  const isProjectUnlocked = (artistId: string, projectId: string): boolean => {
    return collection.value.some(
      (p) => p.artistId === artistId && p.projectId === projectId
    );
  };

  // --- 🔍 MÉTHODE : Consulter si un artiste a au moins un projet débloqué
  const isArtistUnlocked = (artistId: string): boolean => {
    return collection.value.some((p) => p.artistId === artistId);
  };

  // --- 🗂️ CONSULTATION GÉNÉRALE (Getters)
  
  // Récupérer toute la collection (triée du plus récent au plus ancien scanné)
  const allSavedProjects = computed(() => {
    return [...collection.value].sort(
      (a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime()
    );
  });

  // Récupérer uniquement les projets liés à un artiste précis
  const getProjectsByArtist = (artistId: string) => {
    return collection.value.filter((p) => p.artistId === artistId);
  };

  // Nombre total de projets débloqués
  const totalUnlockedCount = computed(() => collection.value.length);

  return {
    // État réactif
    collection,
    allSavedProjects,
    totalUnlockedCount,
    
    // Méthodes d'action
    addProjectToCollection,
    removeProjectFromCollection,
    isProjectUnlocked,
    isArtistUnlocked,
    getProjectsByArtist
  };
}