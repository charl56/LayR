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
    homeKeyCounter,
    goToCollection
} = useNavigationStore();


</script>

<template>
    <BtnScanner :key="'btnScanner-' + (currentData.id || 'home') + '-' + homeKeyCounter" />

    <div v-if="currentPage == 'home'">
        <InfoLayout :key="'layout-' + (currentData.id || 'home') + '-' + homeKeyCounter" :text1="currentData.shortBio1" :text2="currentData.shortBio2" :image-url="currentData.image1"
            :current-page="currentPage" />
        <Collection :onCollectionButton="goToCollection" @update:isOpen="isCollectionOpen = $event" />
        <InfoLayout2 :text1="currentData.description" :image-url="currentData.image2" :links="currentData.links"
            :isCollectionOpen="isCollectionOpen" />
        <WhoAreWe />
    </div>

    <div v-else-if="currentPage == 'collection'">
        <InfoLayout :key="'layout-' + (currentData.id || 'home') + '-' + homeKeyCounter" :text1="currentData.shortBio1" :text2="currentData.shortBio2" :image-url="currentData.image1"
            :current-page="currentPage" />
        <PhotoGallery :key="'gallery-' + (currentData.id || 'collection') + '-' + homeKeyCounter" :currentData="currentData" />
        <InfoLayout2 :text1="currentData.description" :image-url="currentData.image2" :links="currentData.links"
            :isCollectionOpen="isCollectionOpen" />
        <Collection :onCollectionButton="goToCollection" @update:isOpen="isCollectionOpen = $event" />
    </div>

    <Contact />
</template>

<style scoped></style>