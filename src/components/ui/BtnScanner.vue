<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const router = useRouter();
const route = useRoute();

const buttonRef = ref<HTMLElement | null>(null);
const ctx = ref<gsap.Context | null>(null);

const initScannerAnimation = async () => {
  if (!buttonRef.value) return;

  if (ctx.value) ctx.value.revert();
  await nextTick();

  ctx.value = gsap.context(() => {
    
    gsap.to(buttonRef.value, {
      scrollTrigger: {
        trigger: document.body, // Se base sur le scroll de toute la page
        start: "top top",       // Dès qu'on quitte le pixel 0 du haut
        end: "top -100px",      // L'animation se termine après 100px de scroll réel
        scrub: 0.5,             // Transition très fluide au scroll
      },
      width: '50px',            // Devient un carré de la hauteur du bouton (ou adapte à 40px/50px)
      height: '50px',           // On le passe à 50px pour qu'il soit bien proportionné pour un logo
      
      left: '1.5rem',
      xPercent: 0,              // Annule le centrage initial (translate-x -50%)
      bottom: '1.5rem',         // Ajustement de sa distance du bas sur mobile
      
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
    });

    // Animation synchronisée pour masquer le texte et afficher le logo
    const text = buttonRef.value?.querySelector('.btn-text');
    const icon = buttonRef.value?.querySelector('.btn-icon');

    if (text && icon) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "top -50px", // Plus rapide que le bouton pour éviter les chevauchements
          scrub: 0.5,
        }
      });

      tl.to(text, { opacity: 0, display: 'none' }, 0)
        .to(icon, { opacity: 1, display: 'flex' }, 0.2);
    }

  }, buttonRef.value);
};

const goToScanner = () => {
  router.push('/scanner');
};


onMounted(() => {
  initScannerAnimation();

  let width = window.innerWidth;
  const onResize = () => {
    if (window.innerWidth !== width) {
      width = window.innerWidth;
      initScannerAnimation();
    }
  };
  window.addEventListener('resize', onResize);

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize);
    if (ctx.value) ctx.value.revert();
  });
});
</script>

<template>
  <button v-if="route.path !== '/scanner'" ref="buttonRef" class="scanner-btn" aria-label="Scanner" @click="goToScanner">
    <span class="btn-text"><h2>SCANNER</h2></span>
    
    <span class="btn-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>
    </span>
  </button>
</template>

<style scoped>




.scanner-btn {
  position: fixed;
  z-index: 999; /* Toujours au-dessus de tout le reste du site */
  cursor: pointer;
  
  height: 50px;
  width: 50%;
  
  bottom: 5rem; /* Aligné sur la même ligne que tes textes du premier layout */
  left: 50%;
  transform: translateX(-50%);
  will-change: transform, width, height, left, border-radius;

  background-color: white;
  border: none;
  font-weight: bold;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  border-radius: 50px; 
  
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  cursor: pointer;
}

h2{
    text-shadow: 0px 6px 8px rgb(0 0 0 / 65%);
    pointer-events: none;
}

.btn-text {
  display: block;
  opacity: 1;
  white-space: nowrap;
}

.btn-icon {
  display: none;
  opacity: 0;
  justify-content: center;
  align-items: center;
}

.scanner-btn:active {
  transform: scale(0.95) translateX(-50%);
}
</style>