<script setup lang="ts">
// --- Imports : Composants
import AppHeader from '@/components/layout/AppHeader.vue';
import InfoLayout from './components/layout/InfoLayout.vue';
import Collection from '@/components/artists/Collection.vue';


// import AppScanner from '@/components/layout/AppScanner.vue';
// import ArtistDetail from '@/components/artists/ArtistDetail.vue';
// import PhotoGallery from '@/components/ui/PhotoGallery.vue';

// --- Imports : Vue
import { ref, computed, type Ref } from 'vue';

// --- Imports : Données et Types
import { ARTISTS, ACCUEIL } from '@/data/artists';
import type { Artist, ScannedPhoto, Page } from '@/types/types';
import type { DTOInfo } from '@/types/DTOInfo';

// --- Types







// --- State
const currentPage: Ref<Page> = ref('home');
const currentArtistId: Ref<String | null> = ref(null);
const scannedPhotos: Ref<ScannedPhoto[]> = ref([]);
const currentInfo: Ref<DTOInfo> = ref(ACCUEIL);

// --- Computed
const currentArtist = computed(() =>
  ARTISTS.find((a) => a.id === currentArtistId.value) || null
);

// --- Methods
const goHome = () => {
  currentPage.value = 'home';
  currentArtistId.value = null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setCurrentInfo();
};

const goToCollection = (artistId: String) => {
  currentArtistId.value = artistId;
  currentPage.value = 'collection';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setCurrentInfo();
};

// const addScannedPhoto = (photo: ScannedPhoto) => {
//   scannedPhotos.value.push(photo);
// };





const setCurrentInfo = () => {
console.log(currentPage.value)
  if(currentPage.value == 'home'){
    currentInfo.value = ACCUEIL;
  } else if(currentPage.value == 'collection'){
    currentInfo.value = ARTISTS.find((artiste) => artiste.id == currentArtistId.value)
  }

}

</script>

<template>
  <div class="app">


    <AppHeader :current-page="currentPage" :onHomeButton="goHome" />

    <InfoLayout :text1="currentInfo.shortBio1" :text2="currentInfo.shortBio2" :image-url="currentInfo.image1" />
    <Collection :onCollectionButton="goToCollection" />
    <InfoLayout :text1="currentInfo.description" :image-url="currentInfo.image2" />













    <main class="main-content">
      <!-- Page Home : Liste des artistes -->
      <!-- <Collection
        v-if="currentPage === 'home'"
        :artists="ARTISTS"
        @select-artist="goToCollection"
      /> -->





      <!-- Page Collection : Détails d'un artiste -->
      <!-- <ArtistDetail
        v-else-if="currentPage === 'collection' && currentArtist"
        :artist="currentArtist"
      /> -->

      <!-- Page Scanner : Caméra -->
      <!-- <AppScanner
        v-else-if="currentPage === 'scanner'"
        @photo-captured="addScannedPhoto"
      /> -->
    </main>

    <!-- Galerie des photos scannées (affichée en bas de toutes les pages) -->
    <PhotoGallery
      v-if="scannedPhotos.length > 0"
      :photos="scannedPhotos"
    />
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