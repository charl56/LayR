<script setup lang="ts">
import { ref } from 'vue';

// État pour gérer l'ouverture/fermeture de la liste
const isOpen = ref(false);

// Fonction pour basculer l'état de la liste
const toggleList = () => {
  isOpen.value = !isOpen.value;
};

</script>

<template>
  <div id="about" class="about">
    <!-- En-tête cliquable pour déployer/fermer la liste -->
    <div class="about-header" @click="toggleList">
      <h2>QUI SOMMES-NOUS</h2>
    </div>

    <!-- Liste des artistes (affichée si isOpen = true) -->
    <div v-if="isOpen" class="about-content">
        <h2 class="about-text">
            Fondée à Bordeaux en 2026, LayR est née d'un constat simple : les affiches urbaines sont devenues banales, souvent ignorées.
        </h2>
        <h2 class="about-text">
            Portée par une passion pour la musique et les cultures visuelles, LayR transforme ces supports en expériences vivantes grâce à la réalité augmentée.
        </h2>
        <h2 class="about-text">
            Les affiches prennent vie, se découvrent, et peuvent être conservées dans une collection personnelle.
        </h2>
        <h2 class="about-text">
            LayR redonne à la rue son pouvoir d'expression, en transformant chaque affiche en expérience à vivre et à garder.
        </h2>
    </div>
  </div>
</template>

<style scoped>
.about {
  width: 100%; /* Prend toute la largeur */
  border-radius: 4px;
  overflow: hidden; /* Évite les débordements */
}

.about-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  cursor: pointer; /* Curseur "main" pour indiquer que c'est cliquable */
  user-select: none; /* Empêche la sélection du texte */
  background-color: var(--layr-color-1);
  color: black;
  transition: background-color 0.3s, color 0.3s; /* Animation pour la transition */
}

.about-header h2 {
  margin: 0;
}

.about-content {
  background-color: var(--layr-yellow-2); /* Fond blanc pour la liste */
  padding: 0.5rem 0;
}

.about-text{
  padding: 1rem 1rem;
  text-align: center;
}

</style>