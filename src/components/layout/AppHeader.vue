<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useNavigationStore } from '@/composables/useNavigationStore';


const { 
  currentPage, 
} = useNavigationStore();

const menuOpen = ref(false);
const headerNavRef = ref<HTMLElement | null>(null);
const router = useRouter();

const onHomeEvent = (path?: string) => {
  menuOpen.value = false;
  router.push(`/${path ? `#${path}` : ''}`);
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
        <img alt="Logo" class="logo" src="@/assets/burger.svg" width="50" height="50" />
      </button>
      <nav class="header-nav" :class="{ 'header-nav--open': menuOpen }" ref="headerNavRef">
        <ul class="nav-list">
          <li class="nav-item">
            <a  @click.stop="onHomeEvent()"><h2>ACCUEIL</h2></a>
          </li>
          <li class="nav-item">
            <a @click.stop="onHomeEvent('collection')"><h2>COLLECTIONS</h2></a>
          </li>

          <li v-if="currentPage == 'home'" class="nav-item">
            <a @click.stop="onHomeEvent('about')"><h2>QUI SOMMES-NOUS</h2></a>
          </li>
          <li v-else class="nav-item">
            <a @click.stop="onHomeEvent('gallery')"><h2>GALLERIE</h2></a>
          </li>

          <li class="nav-item">
            <a @click.stop="onHomeEvent('contact')"><h2>CONTACT</h2></a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  height: 5rem;
  width: 100%;
  padding: 0rem 1rem;
  padding-top: 0.5rem ;
  position: fixed;
  top: 0;
  z-index: 100;
  transition: 0.3s;
}

.app-header--open {
  background-color: black;
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
}

.menu-toggle a {
  padding: 0;
}

.header-nav {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: black;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-20rem);
  transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
  z-index: 99;
}

.header-nav--open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.header-nav--open .nav-list{
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-list {
  height: 120svh;
  list-style: none;
  padding: 1rem;
  padding-top: 1.2rem;
  margin: 0;
  display: none;
}

.nav-item h2 {
  display: block;
  /* padding: 1rem 1rem; */
  text-decoration: none;
  color: white;
  transition: background 0.2s;
}

.nav-item h2:hover {
  cursor: pointer;
  background: rgba(255, 255, 255, 0.274);
}
</style>