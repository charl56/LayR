import { ref, computed } from 'vue';

// 📐 Structure d'un projet enregistré dans la collection
export interface SavedProject {
  artistId: string;
  projectId: string;
  unlockedAt: string;
}

const STORAGE_KEY = 'layr_unlocked_projects';

// État GLOBAL et UNIQUE
const collection = ref<SavedProject[]>([]);

// 🚀 MÉTHODE DE LECTURE GLOBALE
const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    collection.value = data ? JSON.parse(data) : [];
    console.log("💾 Collection synchronisée depuis le localStorage :", collection.value);
  } catch (error) {
    console.error("❌ Erreur lors de la lecture du localStorage :", error);
    collection.value = [];
  }
};

// Auto-exécution immédiate au premier chargement de l'application
loadFromStorage();

export function useCollectionStore() {

  // --- 💾 MÉTHODE PRIVÉE : Sauvegarde dans le localStorage
  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collection.value));
  };

  // --- ➕ MÉTHODE : Ajouter un projet à la collection
  const addProjectToCollection = (artistId: string, projectId: string) => {
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
      console.log(`🎉 Projet [${projectId}] de l'artiste [${artistId}] ajouté !`);
    }
  };

  // --- ❌ MÉTHODE : Supprimer un projet de la collection
  const removeProjectFromCollection = (artistId: string, projectId: string) => {
    collection.value = collection.value.filter(
      (p) => !(p.artistId === artistId && p.projectId === projectId)
    );
    saveToStorage();
    console.log(`🗑️ Projet [${projectId}] supprimé.`);
  };

  // --- 🔍 MÉTHODES DE RECHERCHE
  const isProjectUnlocked = (artistId: string, projectId: string): boolean => {
    return collection.value.some((p) => p.artistId === artistId && p.projectId === projectId);
  };

  const isArtistUnlocked = (artistId: string): boolean => {
    return collection.value.some((p) => p.artistId === artistId);
  };

  const getProjectsByArtist = (artistId: string) => {
    console.log("getProjectsByArtist called with artistId:", artistId);
    return collection.value.filter((p) => p.artistId === artistId);
  };

  // --- 🗂️ GETTERS COMPUTED
  const allSavedProjects = computed(() => {
    return [...collection.value].sort(
      (a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime()
    );
  });

  const totalUnlockedCount = computed(() => collection.value.length);

  return {
    // État réactif
    collection,
    allSavedProjects,
    totalUnlockedCount,
    
    // Méthodes d'action
    loadFromStorage,
    addProjectToCollection,
    removeProjectFromCollection,
    isProjectUnlocked,
    isArtistUnlocked,
    getProjectsByArtist
  };
}