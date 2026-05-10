<script setup lang="ts">
import { computed } from 'vue';
import type { Artist } from '@/types/types';

const props = defineProps<{
  currentPage: 'home' | 'collection' | 'scanner';
  currentArtist: Artist | null;
}>();

const emit = defineEmits(['navigateHome']);

const navItems = computed(() => {
  if (props.currentPage === 'home') {
    return [
      { id: 'hero', label: 'Accueil' },
      { id: 'collections', label: 'Collections' },
      { id: 'about', label: 'Qui sommes-nous' },
      { id: 'contact', label: 'Contact' },
    ];
  } else if (props.currentPage === 'collection') {
    return [
      { id: 'hero', label: props.currentArtist?.name || 'Artiste' },
      { id: 'artist-collections', label: 'Collections' },
      { id: 'gallery', label: 'Galerie' },
      { id: 'about-artist', label: 'À propos' },
    ];
  }
  return [];
});

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<template>
  <!-- <nav class="app-nav">
    <ul class="nav-list">
      <li
        v-for="item in navItems"
        :key="item.id"
        class="nav-item"
      >
        <button @click="scrollToSection(item.id)">
          {{ item.label }}
        </button>
      </li>
      <li v-if="currentPage !== 'home'" class="nav-item">
        <button @click="emit('navigateHome')">
          Retour à l'accueil
        </button>
      </li>
    </ul>
  </nav> -->
</template>

<style scoped>
.app-nav {
  background: #f5f5f5;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #ddd;
}

.nav-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
  justify-content: center;
}

.nav-item button {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}

.nav-item button:hover {
  background: rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .nav-list {
    gap: 2rem;
  }
}
</style>