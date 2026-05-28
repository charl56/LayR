<script setup lang="ts">
import getAssetSrc from '@/utils/imageUtils';
import { ref, onMounted, onBeforeUnmount, watchEffect, nextTick } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const props = defineProps<{
  text1: string,
  imageUrl: string
}>();

const containerRef = ref<HTMLElement | null>(null);
const text1Ref = ref<HTMLElement | null>(null);

// ✅ Stocker les triggers de cette instance
const triggerRefs = ref<ScrollTrigger[]>([]);

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
      scrub: 1,
    }
  });

  // ✅ Sauvegarder le trigger
  if (tl.scrollTrigger) {
    triggerRefs.value.push(tl.scrollTrigger);
  }

  wordSpans.forEach((span, index) => {
    tl.to(span, { 
      opacity: 1, 
      duration: 0.2,
    }, staggerDelay + index * 0.1);
  });

};

const createPositionAnimation = (textElement: HTMLElement) => {
  const viewportHeight = window.innerHeight;

  const animation = gsap.to(textElement, {
    scrollTrigger: {
      trigger: containerRef.value,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      // markers: true,
      onUpdate: (self) => {
        if (self.progress < 1) {
          // ✅ FIXED pendant qu'on scrolle dans le container
          gsap.set(textElement, { 
            position: 'fixed',
            top: '50svh',
          });
        } else {
          // ✅ ABSOLUTE une fois qu'on atteint le bas du container
          gsap.set(textElement, { 
            position: 'absolute',
            top: (viewportHeight)+'px',
          });
        }
      }
    }
  });

  // ✅ Sauvegarder le trigger directement
  if (animation.scrollTrigger) {
    triggerRefs.value.push(animation.scrollTrigger);
  }
};

const initAnimations = async () => {
  if (!containerRef.value) return;

  triggerRefs.value.forEach(trigger => trigger.kill());
  triggerRefs.value = [];

  await nextTick();

  if (text1Ref.value) {
    createWordRevealAnimation(text1Ref.value, props.text1, 0);
    createPositionAnimation(text1Ref.value);
  }

  ScrollTrigger.refresh();
};

onMounted(() => {
   initAnimations();
});

watchEffect(async () => {
  props.text1;
  await initAnimations();
});

onBeforeUnmount(() => {
  // ✅ Nettoyer SEULEMENT cette instance
  triggerRefs.value.forEach(trigger => {
    trigger.kill();
  });
  triggerRefs.value = [];
});
</script>

<template>
    <div ref="containerRef" class="info-layout">
        <img class="info-layout_img" :src="getAssetSrc(imageUrl)" />

        <div ref="text1Ref" class="only-one-text">
            <p>{{ text1 }}</p>
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
    /* position: absolute; */
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

.only-one-text span {
    display: inline;
    margin-right: 0.3em;
}
</style>