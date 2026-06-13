<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// État pour gérer l'ouverture/fermeture de la liste
const isOpen = ref(false);
const headerRef = ref<HTMLElement | null>(null);
const titleRef = ref<HTMLElement | null>(null);
const ctx = ref<gsap.Context | null>(null);

// Fonction pour basculer l'état de la liste
const toggleList = () => {
  isOpen.value = !isOpen.value;
};

const initScrollEffects = async () => {
  if (!headerRef.value || !titleRef.value) return;

  if (ctx.value) ctx.value.revert();
  await nextTick();

  ctx.value = gsap.context(() => {
    // 💡 Synchronisation millimétrée avec le scroll entre le bas et le milieu de l'écran
    gsap.fromTo(titleRef.value, 
      { scale: 1.15 }, // Plus grand à l'apparition en bas
      {
        scale: 1, // Revient à la normale
        ease: "none",
        scrollTrigger: {
          trigger: headerRef.value,
          start: "top bottom", // Quand le haut du bandeau passe le bas de l'écran
          end: "top 50%",      // Jusqu'à ce qu'il atteigne le milieu
          scrub: true,         // Suit le mouvement du doigt
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
  <div id="about" class="about">
    <div ref="headerRef" class="about-header" @click="toggleList">
      <h2 ref="titleRef" class="about-title">QUI SOMMES-NOUS</h2>
    </div>

    <div v-if="isOpen" class="about-content">
        <p class="about-text">
            Fondée à Bordeaux en 2026, LayR est née d'un constat simple : les affiches urbaines sont devenues banales, souvent ignorées.
        </p>
        <p class="about-text">
            Portée par une passion pour la musique et les cultures visuelles, LayR transforme ces supports en expériences vivantes grâce à la réalité augmentée.
        </p>
        <p class="about-text">
            Les affiches prennent vie, se découvrent, et peuvent être conservées dans une collection personnelle.
        </p>
        <p class="about-text">
            LayR redonne à la rue son pouvoir d'expression, en transformant chaque affiche en expérience à vivre et à garder.
        </p>
    </div>
  </div>
</template>

<style scoped>
.about {
  width: 100%;
  overflow: hidden;
}

.about-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  cursor: pointer; /* Curseur "main" pour indiquer que c'est cliquable */
  user-select: none; /* Empêche la sélection du texte */
  background-color: var(--layr-yellow-2);
  color: black;
  transition: background-color 0.3s, color 0.3s; /* Animation pour la transition */
}

.about-title {
  margin: 0;
  color: black;
  will-change: transform; /* Option d'optimisation GPU pour le scale au scroll */
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