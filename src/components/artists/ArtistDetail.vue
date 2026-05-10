<script setup lang="ts">
import type { Artist } from '@/types/types';

const props = defineProps<{
  artist: Artist;
}>();
</script>

<template>
  <div class="artist-detail">
    <div class="artist-header">
      <h1>{{ artist.name }}</h1>
      <div class="artist-bio">
        <p>{{ artist.shortBio1 }}</p>
        <p>{{ artist.shortBio2 }}</p>
      </div>
    </div>

    <div class="artist-gallery">
      <h2>Galerie</h2>
      <div class="gallery-grid">
        <img
          v-for="(img, index) in artist.images"
          :key="index"
          :src="img"
          :alt="`${artist.name} - Image ${index + 1}`"
          class="gallery-image"
        />
      </div>
    </div>

    <div class="artist-description">
      <h2>À propos</h2>
      <p>{{ artist.description }}</p>
    </div>

    <div class="artist-links">
      <a
        v-if="artist.spotify"
        :href="artist.spotify"
        target="_blank"
        rel="noopener noreferrer"
        class="link-button"
      >
        Spotify
      </a>
      <a
        v-if="artist.soundcloud"
        :href="artist.soundcloud"
        target="_blank"
        rel="noopener noreferrer"
        class="link-button"
      >
        SoundCloud
      </a>
    </div>
  </div>
</template>

<style scoped>
.artist-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
}

.artist-header {
  text-align: center;
  margin-bottom: 2rem;
}

.artist-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.artist-bio {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.artist-bio p {
  margin: 0;
  color: #555;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.artist-gallery {
  margin-bottom: 2rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.gallery-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.artist-description {
  margin-bottom: 2rem;
}

.artist-description p {
  line-height: 1.6;
  color: #444;
}

.artist-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.link-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.2s;
}

.link-button:hover {
  background: #0056b3;
}
</style>