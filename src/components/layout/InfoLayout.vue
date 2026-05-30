<script setup lang="ts">
import getAssetSrc from '@/utils/imageUtils';
import { ref, onMounted, onBeforeUnmount, watchEffect, nextTick } from 'vue';
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

const createPositionAnimation = (textElement: HTMLElement, isBottom: boolean) => {
  const viewportHeight = window.innerHeight;
  const animation = gsap.to(textElement, {
    scrollTrigger: {
      trigger: containerRef.value,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
       onUpdate: (self) => {
        if (self.progress < 1) {
          // ✅ FIXED pendant qu'on scrolle dans le container
          console.log("Height " + viewportHeight + " | bottom " + (viewportHeight/2))

          gsap.set(textElement, { 
            position: 'fixed',
            top: isBottom ? 'auto' : '15vh',
            bottom: isBottom ? '15vh' : 'auto',
          });
        } else {
          console.log("Height : " + viewportHeight + " | Top : " + (viewportHeight/2 + 120))
          // ✅ ABSOLUTE une fois qu'on atteint le bas du container
          gsap.set(textElement, { 
            position: 'absolute',
            top: isBottom ? 'auto' : '55svh',
            // top: isBottom ? 'auto' : (viewportHeight/2 + 120)+'px',

            
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
  console.log("initAniation")
  if (!containerRef.value) return;

  triggerRefs.value.forEach(trigger => trigger.kill());
  triggerRefs.value = [];

  await nextTick();

  if (text1Ref.value) {
    createWordRevealAnimation(text1Ref.value, props.text1, 0);
    createPositionAnimation(text1Ref.value, false);
  }

  if (text2Ref.value) {
    createWordRevealAnimation(text2Ref.value, props.text2, 2);
    createPositionAnimation(text2Ref.value, true);
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
    <div ref="containerRef" class="info-layout" id="home">
        <img class="info-layout_img" :src="getAssetSrc(imageUrl)" />

        <div ref="text1Ref" class="two-text first">
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


.two-text {
    width: 80%;
    /* position: absolute; */
    color: #fff;
    will-change: transform;
}

.two-text p {
    margin: 0;
}

.first {
    /* top: 120px; */
    left: 1rem;
}

.second {
    /* bottom: 120px; */
    right: 1rem;
    text-align: end;
}

.two-text span {
    display: inline;
    margin-right: 0.3em;
}
</style>