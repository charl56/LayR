<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import VideoPlayer from '@/components/ui/VideoPlayer.vue';

// État pour afficher ou masquer l'écran d'accueil
const isSplashVisible = ref(true);
const splashVideoRef = ref<HTMLVideoElement | null>(null);


const onSplashVideoEnded = () => {
  isSplashVisible.value = false;
};


onMounted(() => {
  // On laisse une frame au DOM pour s'installer
  // requestAnimationFrame(() => {
  //   if (!splashVideoRef.value) return;

  //   const video = splashVideoRef.value;

  //   // 🚀 LE FIX SENIOR : On force les propriétés directement sur le DOM natif
  //   // avant toute tentative de play(). Cela court-circuite la sécurité du navigateur.
  //   video.muted = true;
  //   video.defaultMuted = true; // Sécurité pour iOS
  //   video.setAttribute('muted', ''); // Double sécurité pour Opera/Chrome

  //   // On lance la lecture
  //   video.play().catch((error) => {
  //     alert("L'autoplay a été bloqué par la sécurité du navigateur :" + error);

  //     // 🛡️ PLAN DE SECOURS IMMÉDIAT : 
  //     // Si NotAllowedError apparaît, on ne laisse pas l'utilisateur bloqué.
  //     // On ferme le splash screen instantanément pour afficher le site.
  //     isSplashVisible.value = false;
  //   });
  // });
});


</script>

<template>
  <div class="app">
    <Transition name="fade-splash">
      <div v-if="isSplashVisible" class="splash-screen">

        <VideoPlayer src="@/assets/logo-animation2.mp4" :autoplay="true" />
        <!-- <video ref="splashVideoRef" autoplay muted playsinline webkit-playsinline preload="auto" class="splash-gif"
          @ended="onSplashVideoEnded">
          <source src="@/assets/logo-animation2.mp4" type="video/mp4" />
        </video> -->

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