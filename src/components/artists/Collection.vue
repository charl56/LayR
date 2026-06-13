<script setup lang="ts">
import type { Artist } from '@/types/types';
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { ARTISTS } from '@/data/artists';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigationStore } from '@/composables/useNavigationStore';


gsap.registerPlugin(ScrollTrigger);
const { currentArtistId, goToCollection } = useNavigationStore();

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
}>();

// États pour gérer l'ouverture, le DOM et GSAP
const isOpen = ref(false);
const headerRef = ref<HTMLElement | null>(null);
const titleRef = ref<HTMLElement | null>(null);
const ctx = ref<gsap.Context | null>(null);

// Fonction pour basculer l'état de la liste
const toggleList = () => {
  isOpen.value = !isOpen.value;
  emit('update:isOpen', isOpen.value); 
};

// Fonction pour gérer le clic sur un artiste
const handleArtistClick = (artist: Artist) => {
  currentArtistId.value = artist.id;
  goToCollection(artist.id);
  isOpen.value = false;
  emit('update:isOpen', false); // Émet false pour fermer proprement partout
};

const initScrollEffects = async () => {
  if (!headerRef.value || !titleRef.value) return;

  if (ctx.value) ctx.value.revert();
  await nextTick();

  ctx.value = gsap.context(() => {
    // 💡 L'animation est liée au doigt (scrub: true) entre le bas et le milieu de l'écran
    gsap.fromTo(titleRef.value, 
      { scale: 0.7 }, // Commence légèrement plus grand lorsqu'il apparaît tout en bas
      {
        scale: 1, // Revient à sa taille normale (1)
        ease: "none",
        scrollTrigger: {
          trigger: headerRef.value,
          start: "top bottom", // Quand le composant entre par le bas
          end: "top 40%",      // Jusqu'à ce qu'il atteigne le milieu de l'écran
          scrub: true,         // Synchronisation millimétrée avec le scroll
          invalidateOnRefresh: true
        }
      }
    );
  }, headerRef.value);
};

onMounted(() => {
  initScrollEffects();
});

onBeforeUnmount(() => {
  if (ctx.value) ctx.value.revert();
});
</script>

<template>
  <div id="collection" class="artist-list">
    <div ref="headerRef" class="artist-list-header" @click="toggleList">
      <h2 ref="titleRef" class="collection-title">COLLECTION</h2>
    </div>

    <div v-if="isOpen" class="artist-list-content">
      <div class="list-artist" v-for="artist in ARTISTS" :key="artist.id" @click="handleArtistClick(artist)">
        <h2>{{ artist.name }}</h2>
      </div>
    </div>
  </div>
</template>

<style scoped>
.artist-list {
  width: 100%;
  overflow: hidden;
}

.artist-list-header {
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  user-select: none;
  background-color: v-bind('isOpen ? "white" : "black"');
  color: v-bind('isOpen ? "black" : "white"');
  transition: background-color 0.3s, color 0.3s;
}

.collection-title {
  margin: 0;
  will-change: transform; /* Optimisation de performance pour le scale dynamique */
}

.artist-list-content {
  background-color: #f0f0f0;
  padding: 0.5rem 0;
}

.list-artist {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  height: 50px;
  margin-bottom: 2rem;
}

.list-artist h2 {
  margin: 0;
}

.list-artist:first-child {
  margin-top: 2.5rem;
}

.list-artist:last-child {
  margin-bottom: 1rem;
}

.list-artist:hover {
  color: white;
  background-color: var(--layr-color-1);
}

/* Nettoyage des styles obsolètes */
.artist-list-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.artist-list-content li {
  padding: 0.75rem 1rem;
  cursor: pointer;
  margin: 0.25rem 0;
  width: 100%;
  box-sizing: border-box;
}

.artist-list-content li:hover {
  background-color: #d0d0d0;
}
</style>