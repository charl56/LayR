// src/composables/useNavigationStore.ts
import { ref, computed } from 'vue';
import { ARTISTS, ACCUEIL } from '@/data/artists';
import type { Page } from '@/types/types';

// State global partagé
const currentPage = ref<Page>('home');
const currentArtistId = ref<string | null>(null);
const isCollectionOpen = ref<boolean>(false);

export function useNavigationStore() {
  
  // Computed global
  const currentData = computed(() =>
    ARTISTS.find((a) => a.id === currentArtistId.value) || ACCUEIL
  );

  // Actions globales
  const goToCollection = async (artistId: string) => {
    currentArtistId.value = artistId;
    currentPage.value = 'collection';

    // Sécurité pour le cycle de vie du DOM
    await new Promise(resolve => setTimeout(resolve, 100));
    window.scroll({ top: 0, behavior: 'auto' });
  };

  const resetToHome = () => {
    currentArtistId.value = null;
    currentPage.value = 'home';
    isCollectionOpen.value = false;
  };

  return {
    currentPage,
    currentArtistId,
    isCollectionOpen,
    currentData,
    goToCollection,
    resetToHome
  };
}