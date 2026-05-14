<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { Page } from '@/types/types';

const props = defineProps<{
  currentPage: Page;
  onHomeButton: () => void;
}>();

const menuOpen = ref(false);
const headerNavRef = ref<HTMLElement | null>(null);

const onHomeEvent = () => {
  menuOpen.value = false;
  props.onHomeButton()
};

// Fonction pour fermer le menu si on clique en dehors
const handleClickOutside = (event: MouseEvent) => {
  if (headerNavRef.value && !headerNavRef.value.contains(event.target as Node)) {
    menuOpen.value = false;
  }
};

// Ajouter l'écouteur d'événement au montage du composant
onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

// Nettoyer l'écouteur d'événement au démontage du composant
onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <header class="app-header" :class="{ 'app-header--open': menuOpen }">
    <div class="header-content">
      <button class="menu-toggle" @click.stop="onHomeEvent()" aria-label="Toggle menu">
        <img alt="Logo" class="logo" src="@/assets/logo.svg" width="70" height="70" />
      </button>
      <button class="menu-toggle" @click.stop="menuOpen = !menuOpen" aria-label="Toggle menu">
        <img alt="Logo" class="logo" src="@/assets/burger.svg" width="60" height="60" />
      </button>
      <nav class="header-nav" :class="{ 'header-nav--open': menuOpen }" ref="headerNavRef">
        <ul class="nav-list">
          <li class="nav-item">
            <a href="#" @click.stop="onHomeEvent()">Accueil</a>
          </li>
          <li class="nav-item">
            <a href="#collection" @click.stop="menuOpen = false">Collections</a>
          </li>

          <li v-if="currentPage == 'home'" class="nav-item">
            <a href="#about" @click.stop="menuOpen = false">Qui sommes-nous</a>
          </li>
          <li v-else class="nav-item">
            <a href="#galery" @click.stop="menuOpen = false">Gallerie</a>
          </li>

          <li class="nav-item">
            <a href="#contact" @click.stop="menuOpen = false">Contact</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  width: 100%;
  padding: 0.5rem 1rem;
  position: fixed;
  top: 0;
  z-index: 100;
  transition: 0.5s;
  /* Don't distrub clicks, for example */
  /* pointer-events: none; */
}

.app-header--open {
  backdrop-filter: blur(8px);
  transition: 0.5s;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  display: block;
}

.menu-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: #fff;
}

.header-nav {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
  z-index: 99;
}

.header-nav--open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.nav-list {
  list-style: none;
  padding: 1rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item a {
  display: block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #333;
  border-radius: 4px;
  transition: background 0.2s;
}

.nav-item a:hover {
  background: rgba(0, 0, 0, 0.05);
}
</style>