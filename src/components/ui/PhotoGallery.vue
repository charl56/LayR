<script setup lang="ts">
import type { Artist, ScannedPhoto } from '@/types/types';
import getAssetSrc from '@/utils/imageUtils';

const props = defineProps<{
  currentData: Artist;
}>();
</script>

<template>
  <div id="galery" class="photo-galery">
    <h2>Galerie</h2>
    <div class="galery-grid">
      <div
        v-for="src in currentData.images" :key="src" class="photo-card">
        <img :src="getAssetSrc(src)" :alt="`Photo: ${src}`" class="photo-image" />
        <div class="photo-info">
          <!-- <p class="photo-project">{{ photo.projectName }}</p> -->
          <p class="photo-date">
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.photo-galery {
  height: 100svh;
  width: 100%;
  text-align: center;
  position: relative; /* Pour positionner les textes par rapport à ce conteneur */
  overflow: hidden; /* Empêche le défilement horizontal */
  background: #000000;
  padding: 1rem;
  color: #fff;
}

.galery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.photo-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.photo-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.photo-info {
  padding: 0.5rem;
}

.photo-project {
  margin: 0;
  font-weight: bold;
}

.photo-date {
  margin: 0.25rem 0 0;
  color: #666;
}
</style>