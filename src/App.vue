<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppHeader from '@/components/layout/AppHeader.vue';

// État pour afficher ou masquer l'écran d'accueil
const isSplashVisible = ref(true);
const splashVideoRef = ref<HTMLVideoElement | null>(null);


const onSplashVideoEnded = () => {
  isSplashVisible.value = false;
};


onMounted(() => {
  // On laisse une frame au DOM pour s'installer
  requestAnimationFrame(() => {
    if (!splashVideoRef.value) return;

    // 1. Sécurité absolue : On force le volume à 0 au niveau du code
    splashVideoRef.value.muted = true;

    // 2. On lance la lecture via une Promesse JavaScript
    splashVideoRef.value.play().catch((error) => {
      console.warn("L'autoplay a été bloqué par le navigateur/système :", error);
      
      /* 🚀 PLAN DE SECOURS ULTRA-PRO :
         Si le téléphone bloque la vidéo et exige un appui sur 'Play', 
         on ne force pas l'utilisateur à attendre sur un écran figé.
         On désactive immédiatement le splash screen pour le laisser entrer sur le site ! */
      isSplashVisible.value = false;
    });
  });
});


</script>

<template>
  <div class="app">
    <Transition name="fade-splash">
      <div v-if="isSplashVisible" class="splash-screen">

        <video ref="splashVideoRef" autoplay muted playsinline webkit-playsinline preload="auto" class="splash-gif" @ended="onSplashVideoEnded">
          <source src="@/assets/logo-animation.mp4" type="video/mp4" />
        </video>

      </div>
    </Transition>

    <AppHeader v-if="!isSplashVisible" />
    <RouterView v-if="!isSplashVisible" />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #000000;
  /* Optionnel : Évite un flash blanc pendant le chargement */
}

/* --- Style du Splash Screen --- */
.splash-screen {
  position: fixed;
  inset: 0;
  background-color: #000000;
  /* Fond noir pour que le GIF s'intègre parfaitement */
  z-index: 9999;
  /* Toujours au-dessus de tout le reste (header, GSAP...) */
  display: flex;
  justify-content: center;
  align-items: center;
}

.splash-gif {
  width: 90%;
  max-width: 400px;
  /* Ajuste la taille maximale de ton GIF sur grand écran */
  height: auto;
  object-fit: contain;
}

/* --- Transition Fondu Sortant --- */
.fade-splash-leave-active {
  transition: opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.fade-splash-leave-to {
  opacity: 0;
}
</style>