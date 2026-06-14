<script setup lang="ts">
import getAssetSrc from '@/utils/imageUtils';
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Links } from '@/types/types';
import { useNavigationStore } from '@/composables/useNavigationStore';

gsap.registerPlugin(ScrollTrigger);

const { currentPage } = useNavigationStore();
const props = defineProps<{
  text1: string,
  imageUrl: string,
  isCollectionOpen: boolean,
  links?: Links
}>();

const containerRef = ref<HTMLElement | null>(null);
const text1Ref = ref<HTMLElement | null>(null);

const ctx = ref<gsap.Context | null>(null);

const prepareText = (textElement: HTMLElement, textContent: string) => {
  const words = textContent.split(' ');
  textElement.innerHTML = words
    .map(word => `<span class="word-span">${word}</span>`)
    .join(' ');
};

const initAnimations = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));

  
  if (!containerRef.value) return;

  if (ctx.value) {
    ctx.value.revert();
    ctx.value = null;
  }

  await nextTick();

  if (text1Ref.value) prepareText(text1Ref.value, props.text1);

  ctx.value = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: "top top",
        end: "+=50%",
        scrub: 1,
        pin: true,
        pinSpacing: true, // 📌 Indique à GSAP de pousser proprement le composant du dessous (Collection)
        invalidateOnRefresh: true,
        // markers: true,
      }
    });

    // 1. Révélation du texte
    if (text1Ref.value) {
      const spans = text1Ref.value.querySelectorAll('.word-span');
      tl.to(spans, {
        opacity: 1,
        duration: 0.5,
        stagger: 0.1
      }, 0);
    }

    // 2. Animation des icônes de musique avec un .to()
    const icons = containerRef.value?.querySelector('.icons-music__div');
    if (icons) {
      tl.to(icons, {
        opacity: 1,          // Deviennent visibles
        y: 0,                // Reviennent à leur position d'origine (0)
        scale: 1,            // Reprennent leur taille normale (1)
        rotation: 0,         // Redeviennent droites (0)
        duration: 0.6,
        stagger: 0.15,
        ease: "back.out(1.7)"
      }, 1);
    }

  }, containerRef.value);

};

watch(() => props.links, async () => {
  await initAnimations();
}, { deep: true, immediate: false });

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
  <div ref="containerRef" class="info-layout">
    <img class="info-layout_img" :src="getAssetSrc(imageUrl)" />

    <div class="content-overlay">
      <div ref="text1Ref" class="only-one-text" :class="currentPage === 'home' ? 'text-color-white' : 'text-color-red'">
        <p>{{ text1 }}</p>
      </div>

      <div v-if="links" class="icons-music__div">

        <a v-if="links.apple" class="icon-music" aria-label="Apple Music" :href="links.apple" target="_blank"
          rel="noopener noreferrer">
          <img alt="Apple Music" class="logo" src="@/assets/apple.webp" />
        </a>
        <a v-if="links.spotify" class="icon-music" aria-label="Spotify" :href="links.spotify" target="_blank"
          rel="noopener noreferrer">
          <img alt="Spotify" class="logo" src="@/assets/spotify.webp" />
        </a>
        <a v-if="links.deezer" class="icon-music" aria-label="Deezer" :href="links.deezer" target="_blank"
          rel="noopener noreferrer">
          <img alt="Deezer" class="logo" src="@/assets/deezer.webp" />
        </a>
        <a v-if="links.soundcloud" class="icon-music" aria-label="Soundcloud" :href="links.soundcloud" target="_blank"
          rel="noopener noreferrer">
          <img alt="Soundcloud" class="logo" src="@/assets/soundcloud.webp" />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info-layout {
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  isolation: isolate;
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

.content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 0 1rem;
  box-sizing: border-box;
  /* mix-blend-mode: difference; */
}

.only-one-text {
  width: 100%;
  max-width: 600px;
  color: #fff;
  text-align: center;
  pointer-events: none;
}

.only-one-text p {
  margin: 0;
}

:deep(.word-span) {
  display: inline-block;
  opacity: 0;
  margin-right: 0.25rem;
}

.icons-music__div {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  
  padding: 4px;
  border-radius: 50px;
  background-color: var(--layr-pink-1);

    opacity: 0;
  transform: translateY(60px) scale(0.3) rotate(-15deg);
}

.icon-music {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  will-change: transform, opacity;


}

.icons-music__div {
  transform: scale(0.95);
  transition: transform 0.1s ease;
}

.icon-music img {
  height: 50px;
  width: 50px;
  object-fit: contain;
}

.text-color-white {
  color: #fff;
}

.text-color-red {
  color: var(--layr-pink-1);
}
</style>