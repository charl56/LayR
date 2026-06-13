<script setup lang="ts">
import BtnScanner from '@/components/ui/BtnScanner.vue';
import InfoLayout from '@/components/layout/InfoLayout.vue';
import InfoLayout2 from '@/components/layout/InfoLayout2.vue';
import Collection from '@/components/artists/Collection.vue';
import PhotoGallery from '@/components/ui/PhotoGallery.vue';
import WhoAreWe from '@/components/layout/WhoAreWe.vue';
import Contact from '@/components/layout/Contact.vue';

// --- Imports : Données et Types
import { useNavigationStore } from '@/composables/useNavigationStore';
import { onMounted } from 'vue';
// --- State
const { 
  currentPage, 
  isCollectionOpen, 
  currentData, 
  goToCollection 
} = useNavigationStore();


</script>

<template>
    <BtnScanner />

    <InfoLayout :text1="currentData.shortBio1" :text2="currentData.shortBio2" :image-url="currentData.image1" />
    <Collection :onCollectionButton="goToCollection" @update:isOpen="isCollectionOpen = $event" />
    <InfoLayout2 :text1="currentData.description" :image-url="currentData.image2" :links="currentData.links"
        :isCollectionOpen="isCollectionOpen" />
    <PhotoGallery v-if="currentPage == 'collection'" :currentData="currentData" />
    <WhoAreWe v-else />

    <Contact />
</template>

<style scoped></style>