<script setup lang="ts">
import getAssetSrc from '@/utils/imageUtils';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const props = defineProps<{
  text1: string,
  text2?: string,
  imageUrl: string
}>();

const containerRef = ref<HTMLElement | null>(null);
const text1Ref = ref<HTMLElement | null>(null);
const text2Ref = ref<HTMLElement | null>(null);

const createWordRevealAnimation = (textElement: HTMLElement, textContent: string, staggerDelay: number = 0) => {
  const words = textContent.split(' ');
  
  textElement.innerHTML = words
    .map(word => `<span style="opacity: 0;">${word}</span>`)
    .join(' ');

  const wordSpans = textElement.querySelectorAll('span');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: "top top",
      end: "bottom bottom",
      scrub: 1
    }
  });

  // Phase 1 : Apparition progressive des mots
  wordSpans.forEach((span, index) => {
    tl.to(span, { 
      opacity: 1, 
      duration: 0.5 
    }, staggerDelay + index * 0.1);
  });

  // Phase 2 : Disparition progressive des mots
  wordSpans.forEach((span, index) => {
    tl.to(span, { 
      opacity: 0, 
      duration: 1
    }, staggerDelay + wordSpans.length * 0.1 + index * 0.1);
  });
};

const createPositionAnimation = (textElement: HTMLElement) => {
  const viewportHeight = window.innerHeight;

  gsap.to(textElement, {
    scrollTrigger: {
      trigger: containerRef.value,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const containerTop = containerRef.value!.getBoundingClientRect().top;
        const containerBottom = containerRef.value!.getBoundingClientRect().bottom;

        if (containerTop <= 0 && containerBottom >= viewportHeight) {
          // Phase 2: Le texte est fixe à l'écran
          gsap.set(textElement, { position: 'fixed', y: 0 });
        } else if (containerTop > 0) {
          // Phase 1: Scroll normal
          gsap.set(textElement, { position: 'absolute', y: 0 });
        } else if (containerBottom < viewportHeight) {
          // Phase 3: Montée accélérée avec le container
          const exitProgress = 1 - (containerBottom / viewportHeight);
          const acceleratedExit = exitProgress * exitProgress * viewportHeight;
          console.log(acceleratedExit)
          gsap.set(textElement, { position: 'absolute', y: -acceleratedExit });
        }
      }
    }
  });
};

onMounted(() => {
  if (!containerRef.value) return;

  // Animation pour text1
  if (text1Ref.value) {
    createWordRevealAnimation(text1Ref.value, props.text1, 0);
    createPositionAnimation(text1Ref.value);
  }

  // Animation pour text2 (si existe)
  if (text2Ref.value && props.text2) {
    createWordRevealAnimation(text2Ref.value, props.text2, 0.3);
    createPositionAnimation(text2Ref.value);
  }
});

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.vars.trigger === containerRef.value) {
      trigger.kill();
    }
  });
});
</script>

<template>
    <div ref="containerRef" class="info-layout">
        <img class="info-layout_img" :src="getAssetSrc(imageUrl)" />

        <div ref="text1Ref" :class="text2 == undefined ? 'only-one-text' : 'two-text first'">
            <p>{{ text1 }}</p>
        </div>

        <div v-if="text2 != undefined" ref="text2Ref" class="two-text second">
            <p>{{ text2 }}</p>
        </div>
    </div>
</template>

<style scoped>
.info-layout {
    height: 150svh;
    width: 100%;
    padding: 0;
    position: relative;
    overflow: hidden;
}

.info-layout_img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

.only-one-text {
    width: 90%;
    position: absolute;
    top: 50svh;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #fff;
    will-change: transform;
}

.only-one-text p {
    margin: 0;
}

.two-text {
    width: 80%;
    position: absolute;
    color: #fff;
    will-change: transform;
}

.two-text p {
    margin: 0;
}

.first {
    top: 120px;
    left: 1rem;
}

.second {
    bottom: 120px;
    right: 1rem;
    text-align: end;
}

.two-text span {
    display: inline;
    margin-right: 0.3em;
}

.only-one-text span {
    display: inline;
    margin-right: 0.3em;
}
</style>