<script setup lang="ts">
import getAssetSrc from '@/utils/imageUtils';
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const props = defineProps<{
  text1: string,
  text2: string,
  imageUrl: string
}>();

const containerRef = ref<HTMLElement | null>(null);
const text1Ref = ref<HTMLElement | null>(null);
const text2Ref = ref<HTMLElement | null>(null);

const ctx = ref<gsap.Context | null>(null);

const prepareText = (textElement: HTMLElement, textContent: string) => {
  const words = textContent.split(' ');
  textElement.innerHTML = words
    .map(word => `<span class="word-span">${word}</span>`)
    .join(' ');
};

const initAnimations = async () => {
  if (!containerRef.value) return;

  if (ctx.value) ctx.value.revert();

  await nextTick();

  if (text1Ref.value) prepareText(text1Ref.value, props.text1);
  if (text2Ref.value) prepareText(text2Ref.value, props.text2);

  ctx.value = gsap.context(() => {
    
    // 💡 La magie est ici : on pin le container complet.
    // L'écran va se figer pendant un scroll équivalent à "+=50%" de la hauteur de l'écran.
    // Cela simule parfaitement tes 150svh (100vh de base + 50% de scroll figé).
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: "top top",
        end: "+=50%", // ⬅️ Ajuste cette valeur pour scroller plus ou moins longtemps (+=100%, etc.)
        scrub: 1,
        pin: true, 
        pinSpacing: true, // 📌 Indique à GSAP de pousser proprement le composant du dessous (Collection)
        invalidateOnRefresh: true,
      }
    });

    if (text1Ref.value) {
      const spans1 = text1Ref.value.querySelectorAll('.word-span');
      tl.to(spans1, {
        opacity: 1,
        duration: 0.5,
        stagger: 0.1
      }, 0);
    }

    if (text2Ref.value) {
      const spans2 = text2Ref.value.querySelectorAll('.word-span');
      tl.to(spans2, {
        opacity: 1,
        duration: 0.5,
        stagger: 0.1
      }, 0.3); // Démarre pendant que le premier finit
    }

  }, containerRef.value);
};

onMounted(() => {
  initAnimations();

  let width = window.innerWidth;
  const onResize = () => {
    if (window.innerWidth !== width) {
      width = window.innerWidth;
      initAnimations();
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
  <div ref="containerRef" class="info-layout" id="home">
    <img class="info-layout_img" :src="getAssetSrc(imageUrl)" />

    <div ref="text1Ref" class="two-text first">
      <p>{{ text1 }}</p>
    </div>

    <div ref="text2Ref" class="two-text second">
      <p>{{ text2 }}</p>
    </div>
  </div>
</template>

<style scoped>
.info-layout {
  height: 100vh; /* Garder 100vh ici. C'est GSAP qui va créer l'espace de scroll virtuel en injectant du padding automatique */
  width: 100%;
  position: relative;
  overflow: hidden;
}

.info-layout_img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.two-text {
  width: 80%;
  color: #fff;
  position: absolute;
  z-index: 2;
  will-change: transform, opacity;
}

.two-text p {
  margin: 0;
}

.first {
  top: 15vh; /* Reste calé proprement en haut, sans sauter avec la barre mobile */
  left: 1rem;
}

.second {
  bottom: 15vh; /* Reste calé proprement en bas, sans sauter avec la barre mobile */
  right: 1rem;
  text-align: end;
}

:deep(.word-span) {
  display: inline-block;
  opacity: 0;
  margin-right: 0.25rem;
}
</style>