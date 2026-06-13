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
    
    // 💡 Calcul dynamique des positions pour éviter d'utiliser "left"
    const targetX = 49 - (window.innerWidth / 2);
    
    // On calcule l'écart pour le caler à 1.5rem (24px) du bas au lieu de 5rem
    // 5rem = 80px, 1.5rem = 24px -> Différence de 56px vers le bas
    const targetY = 56; 

    gsap.to(buttonRef.value, {
      scrollTrigger: {
        trigger: document.body,
        start: "top top",      
        end: "top -100px",      
        scrub: 0.5,             
      },
      width: '50px',            
      height: '50px',           
      // 💡 On utilise x et y à la place de left/bottom. C'est ultra fluide et safe !
      x: targetX,
      y: targetY,
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
    });

    const text = buttonRef.value?.querySelector('.btn-text');
    const icon = buttonRef.value?.querySelector('.btn-icon');

    if (text && icon) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "top -50px", 
          scrub: 0.5,
        }
      });

      // 💡 On utilise "autoAlpha" (mélange de opacity et visibility: hidden) 
      // à la place de display: none pour éviter le bug de layout mobile
      tl.to(text, { autoAlpha: 0 }, 0)
        .to(icon, { autoAlpha: 1 }, 0.2);
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
  z-index: 999;
  cursor: pointer;
  
  height: 50px;
  width: 50%;
  
  bottom: 5rem; 
  left: 50%;
  /* 💡 Le bouton est centré uniquement via le CSS initial */
  transform: translateX(-50%);
  
  /* Retrait de left, bottom et width de will-change car GSAP s'occupe de la transform (x, y) */
  will-change: transform;

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
}

h2 {
  text-shadow: 0px 6px 8px rgb(0 0 0 / 65%);
  pointer-events: none;
  margin: 0;
}

.btn-text {
  display: block;
  white-space: nowrap;
}

.btn-icon {
  /* 💡 On met position absolute pour que l'icône soit déjà centrée dans le bouton */
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  visibility: hidden; /* Géré par autoAlpha */
  opacity: 0;
}

/* 💡 Version corrigée du active sans casser les positions de GSAP */
.scanner-btn:active {
  opacity: 0.8;
}
</style>