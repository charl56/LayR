<script setup lang="ts">
import type { ScannedPhoto } from '@/types/types';

const props = defineProps<{
  photos: ScannedPhoto[];
}>();
</script>

<template>
  <div class="photo-gallery">
    <h2>Photos scannées</h2>
    <div class="gallery-grid">
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="photo-card"
      >
        <img
          :src="photo.src"
          :alt="`Photo: ${photo.projectName}`"
          class="photo-image"
        />
        <div class="photo-info">
          <p class="photo-project">{{ photo.projectName }}</p>
          <p class="photo-date">
            {{ new Date(photo.timestamp).toLocaleDateString() }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.photo-gallery {
  background: #f9f9f9;
  padding: 1rem;
  margin-top: 2rem;
  border-top: 1px solid #eee;
}

.gallery-grid {
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
  font-size: 0.9rem;
}

.photo-date {
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  color: #666;
}
</style>