<script setup lang="ts">
import getAssetSrc from '@/utils/imageUtils';
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigationStore } from '@/composables/useNavigationStore';

gsap.registerPlugin(ScrollTrigger);

const { currentPage } = useNavigationStore();
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

  // ⚠️ CRUCIAL : On détruit proprement l'ancienne timeline et ses ScrollTriggers 
  // avant de reconstruire pour éviter les fuites de mémoire et les conflits
  if (ctx.value) {
    ctx.value.revert();
    ctx.value = null;
  }

  // Attend que Vue applique les nouveaux textes bruts dans le DOM
  await nextTick();

  // On injecte à nouveau les spans avec le nouveau contenu des props
  if (text1Ref.value) prepareText(text1Ref.value, props.text1);
  if (text2Ref.value) prepareText(text2Ref.value, props.text2);

  ctx.value = gsap.context(() => {
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: "top top",
        end: "+=50%", 
        scrub: 1,
        pin: true, 
        pinSpacing: true, 
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
      }, 0.3);
    }

  }, containerRef.value);

  // 🔄 Force ScrollTrigger à recalculer toutes les positions de la page
  ScrollTrigger.refresh();
};

// 🎯 SURVEILLANCE : Si les textes ou l'image changent, on relance tout !
watch(
  () => [props.text1, props.text2, props.imageUrl], 
  async () => {
    await initAnimations();
  }, 
  { deep: true }
);

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
    {{ currentPage }}
    <div ref="text1Ref" class="two-text first" :class="currentPage === 'home' ? 'text-color-white' : 'text-color-red'">
      <p>{{ text1 }}</p>
    </div>

    <div ref="text2Ref" class="two-text second" :class="currentPage === 'home' ? 'text-color-white' : 'text-color-red'">
      <p>{{ text2 }}</p>
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
  position: absolute; /* ⬅️ Pense à remettre l'image en absolute pour que le texte se pose dessus ! */
  top: 0;
  left: 0;
  z-index: 1;
}

.two-text {
  width: 80%;
  position: absolute;
  z-index: 2;
  will-change: transform, opacity;
}

.text-color-white {
  color: #fff;
}

.text-color-red {
  color: var(--layr-red-1);
}

.two-text p {
  margin: 0;
}

.first {
  top: 15vh;
  left: 1rem;
}

.second {
  bottom: 15vh;
  right: 1rem;
  text-align: end;
}

:deep(.word-span) {
  display: inline-block;
  opacity: 0;
  margin-right: 0.25rem;
}
</style>