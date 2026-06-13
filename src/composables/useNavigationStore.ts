// src/composables/useNavigationStore.ts
import { ref, computed } from 'vue';
import { ARTISTS, ACCUEIL } from '@/data/artists';
import type { Page } from '@/types/types';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRouter } from 'vue-router';

// State global partagé
const currentPage = ref<Page>('home');
const currentArtistId = ref<string | null>(null);
const isCollectionOpen = ref<boolean>(false);
const router = useRouter();

export function useNavigationStore() {

  // Computed global
  const currentData = computed(() =>
    ARTISTS.find((a) => a.id === currentArtistId.value) || ACCUEIL
  );

  // Actions globales
  const goToCollection = async (artistId: string) => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill(true));

    window.scrollTo(0, 0);

    currentArtistId.value = artistId;
    currentPage.value = 'collection';

    // Sécurité pour le cycle de vie du DOM
    await new Promise(resolve => setTimeout(resolve, 50));
    window.scrollTo(0, 0);

    await new Promise(resolve => setTimeout(resolve, 100));
    ScrollTrigger.refresh();
  };



  const resetToHome = () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill(true));

    currentArtistId.value = null;
    currentPage.value = 'home';
    isCollectionOpen.value = false;

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
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