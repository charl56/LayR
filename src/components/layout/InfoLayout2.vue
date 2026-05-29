<script setup lang="ts">
import getAssetSrc from '@/utils/imageUtils';
import { ref, onMounted, onBeforeUnmount, watch, watchEffect, nextTick } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Collection from '@/components/artists/Collection.vue';
import type { Links } from '@/types/types';


gsap.registerPlugin(ScrollTrigger);

const props = defineProps<{
  text1: string,
  imageUrl: string,
  isCollectionOpen: boolean
  links?: Links
}>();

const containerRef = ref<HTMLElement | null>(null);
const text1Ref = ref<HTMLElement | null>(null);
const linksRef = ref<HTMLElement | null>(null);
  
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
      marginRight: '0.2rem',
    }, staggerDelay + index * 0.1);
  });

};

const createPositionAnimation = (textElement: HTMLElement) => {
  const viewportHeight = window.innerHeight;
  console.log("CreatePoitioANiation")

  const animation = gsap.to(textElement, {
    scrollTrigger: {
      trigger: containerRef.value,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      // markers: true,
      onUpdate: (self) => {
        if (self.progress < 1) {
          console.log("Height " + viewportHeight + " | bottom " + (viewportHeight/2))
          // ✅ FIXED pendant qu'on scrolle dans le container
          gsap.set(textElement, {
            position: 'fixed',
            bottom: (viewportHeight*0.6) + 'px',
          });
        } else {
          // ✅ ABSOLUTE une fois qu'on atteint le bas du container
          console.log("Height " + viewportHeight + " | bottom " + (viewportHeight/2))
          gsap.set(textElement, {
            position: 'absolute',
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

    if (linksRef.value) {
    // createWordRevealAnimation(linksRef.value, props.text1, 0);
    createPositionAnimation(linksRef.value);
  }

  ScrollTrigger.refresh();
};

onMounted(() => {
  initAnimations();

    const resizeObserver = new ResizeObserver(async () => {
      await initAnimations();
    });

    if(containerRef.value) resizeObserver.observe(containerRef.value);

    onBeforeUnmount(() => {
      resizeObserver.disconnect();
    });
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
    <div v-if="links != null" class="icons-music__div" ref="linksRef">
      <a v-if="links.soundcloud" class="icon-music" aria-label="Toggle menu" :href="links.soundcloud" target="_blank" rel="noopener noreferrer">
        <img alt="Logo" class="logo" src="@/assets/youtube.webp"/>
      </a>
      <a v-if="links.spotify" class="icon-music" aria-label="Toggle menu" :href="links.spotify" target="_blank" rel="noopener noreferrer">
        <img alt="Logo" class="logo" src="@/assets/youtube.webp"/>
      </a>
      <a v-if="links.deezer" class="icon-music" aria-label="Toggle menu" :href="links.deezer" target="_blank" rel="noopener noreferrer">
        <img alt="Logo" class="logo" src="@/assets/youtube.webp"/>
      </a>
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
  left: 5%;
  /* position: absolute; */
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  will-change: transform;
  pointer-events: none;

  span {
    display: inline;
    margin-right: 0.3em;
  }
}

.only-one-text p {
  margin: 0;
}



.only-one-text + .icons-music__div{
  position: relative;
  bottom: 20rem;
  display: flex;
  justify-content: center;
}


.icon-music{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 0.1rem;
}

.icon-music img {
    height: 50px;
    width: 50px;
}
</style>