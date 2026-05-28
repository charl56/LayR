<script setup lang="ts">
// --- Imports : Composants
import AppHeader from '@/components/layout/AppHeader.vue';
import InfoLayout from './components/layout/InfoLayout.vue';
import InfoLayout2 from './components/layout/InfoLayout2.vue';
import Collection from '@/components/artists/Collection.vue';
import PhotoGallery from '@/components/ui/PhotoGallery.vue';
import WhoAreWe from './components/layout/WhoAreWe.vue';
import Contact from './components/layout/Contact.vue';

// --- Imports : Vue
import { ref, computed, type Ref, nextTick } from 'vue';

// --- Imports : Données et Types
import { ARTISTS, ACCUEIL } from '@/data/artists';
import type { ScannedPhoto, Page } from '@/types/types';




// --- State
const currentPage: Ref<Page> = ref('home');
const currentArtistId: Ref<string | null> = ref(null);
const scannedPhotos: Ref<ScannedPhoto[]> = ref([]);
const isCollectionOpen: Ref<boolean> = ref(false);
// --- Computed
const currentData = computed(() =>
  ARTISTS.find((a) => a.id === currentArtistId.value) || ACCUEIL
);

// --- Methods
const goHome = async () => {
  currentArtistId.value = null;
  currentPage.value = 'home';

  await nextTick();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const goToCollection = async (artistId: string) => {
  currentArtistId.value = artistId;
  currentPage.value = 'collection';

  await nextTick();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// const addScannedPhoto = (photo: ScannedPhoto) => {
//   scannedPhotos.value.push(photo);
// };




</script>

<template>
  <div class="app">


    <AppHeader :current-page="currentPage" :onHomeButton="goHome" />

    <InfoLayout :text1="currentData.shortBio1" :text2="currentData.shortBio2" :image-url="currentData.image1" />
    <Collection :onCollectionButton="goToCollection" @update:isOpen="isCollectionOpen = $event"/>
    <InfoLayout2 :text1="currentData.description" :image-url="currentData.image2" :isCollectionOpen="isCollectionOpen" />

    <PhotoGallery v-if="currentPage=='collection'" :currentData="currentData" />
    <WhoAreWe v-else />

    <Contact />

  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>