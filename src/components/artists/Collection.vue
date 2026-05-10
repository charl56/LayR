<script setup lang="ts">
import type { Artist } from '@/types/types';
import { ref } from 'vue';
import { ARTISTS } from '@/data/artists';

const props = defineProps<{
  onCollectionButton: (id: String) => void;
}>();

const emit = defineEmits(['selectArtist']);

// État pour gérer l'ouverture/fermeture de la liste
const isOpen = ref(false);

// Fonction pour basculer l'état de la liste
const toggleList = () => {
  isOpen.value = !isOpen.value;
};

// Fonction pour gérer le clic sur un artiste
const handleArtistClick = (artist: Artist) => {
  props.onCollectionButton(artist.id);
  isOpen.value = false;
};
</script>

<template>
  <div id="collection" class="artist-list">
    <!-- En-tête cliquable pour déployer/fermer la liste -->
    <div class="artist-list-header" @click="toggleList">
      <h2>Collection</h2>
    </div>

    <!-- Liste des artistes (affichée si isOpen = true) -->
    <div v-if="isOpen" class="artist-list-content">
      <ul>
        <li
          v-for="artist in ARTISTS"
          :key="artist.id"
          @click="handleArtistClick(artist)"
        >
          {{ artist.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.artist-list {
  width: 100%; /* Prend toute la largeur */
  font-family: Arial, sans-serif;
  border-radius: 4px;
  overflow: hidden; /* Évite les débordements */
}

.artist-list-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  cursor: pointer; /* Curseur "main" pour indiquer que c'est cliquable */
  user-select: none; /* Empêche la sélection du texte */
  background-color: v-bind('isOpen ? "white" : "black"'); /* Fond blanc si ouvert, noir sinon */
  color: v-bind('isOpen ? "black" : "white"'); /* Texte noir si ouvert, blanc sinon */
  transition: background-color 0.3s, color 0.3s; /* Animation pour la transition */
}

.artist-list-header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.artist-list-content {
  background-color: white; /* Fond blanc pour la liste */
  padding: 0.5rem 0; /* Padding vertical pour délimiter */
}

.artist-list-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.artist-list-content li {
  padding: 0.75rem 1rem; /* Padding pour espacer le texte des bords */
  cursor: pointer;
  background-color: #f0f0f0; /* Bandeau gris clair */
  margin: 0.25rem 0; /* Espacement entre les éléments */
  width: 100%; /* Prend toute la largeur */
  box-sizing: border-box; /* Inclut le padding dans la largeur */
}

.artist-list-content li:hover {
  background-color: #d0d0d0; /* Gris plus foncé au survol */
}
</style>