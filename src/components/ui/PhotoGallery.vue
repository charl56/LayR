<script setup lang="ts">
import { ARTISTS } from '@/data/artists';
import type { Artist, Info } from '@/types/types';
import getAssetSrc from '@/utils/imageUtils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onMounted, onBeforeUnmount, ref } from 'vue';

gsap.registerPlugin(ScrollTrigger);


const props = defineProps<{
  currentData: Info;
}>();
const currentProjectImg = ref<string>('');
const showImage = ref<boolean>(false);
const triggerRefs = ref<ScrollTrigger[]>([]);
const artist = ref<Artist>(ARTISTS[0]!);


function isArtist(data: Info): data is Artist {
  return 'projets' in data;
}

const initAnimations = () => {
  if (!isArtist(props.currentData)) return;

  artist.value = props.currentData as Artist;
  
  // Tuer les anciens triggers
  triggerRefs.value.forEach(trigger => {
    trigger.kill();
  });
  triggerRefs.value = [];

  const projectCards = document.querySelectorAll('.photo-card');

  projectCards.forEach((card, index) => {
    const trigger = ScrollTrigger.create({
      trigger: card,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        if (artist.value.projets[index] == undefined) return;
        currentProjectImg.value = artist.value.projets[index].img;
        showImage.value = true;
      },
      onLeave: () => {
        showImage.value = false;
      },
      onEnterBack: () => {
        if (artist.value.projets[index] == undefined) return;
        currentProjectImg.value = artist.value.projets[index].img;
        showImage.value = true;
      },
      onLeaveBack: () => {
        showImage.value = false;
      },
    });

    triggerRefs.value.push(trigger);
  });

}


onMounted(() => {
  // Délai pour laisser le DOM se rendre
  setTimeout(() => {
    initAnimations();
  }, 100);
});

onBeforeUnmount(() => {
  triggerRefs.value.forEach(trigger => {
    trigger.kill();
  });
});


</script>

<template>
  <div id="galery" class="photo-galery">
    <h2>Galerie</h2>

    <div v-if="showImage" class="image-overlay">
      <img :src="getAssetSrc(currentProjectImg)" :alt="'Project image'" class="overlay-image" />
    </div>

    <div v-if="isArtist(currentData)" class="galery-div">
      <div v-for="projet in currentData.projets" :key="projet.img" class="photo-card">
        <div class="photo-info">
          <p class="photo-project">{{ projet.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.photo-galery {
  width: 100%;
  min-height: 100svh;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: #000000;
  padding: 1rem 0rem;
  color: #fff;
}

.image-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  pointer-events: none;
}

.overlay-image {
  max-width: 50%;
  max-height: 85%;
  object-fit: contain;
}


.galery-div {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 1rem;
}

.photo-card {
  background: white;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.photo-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.photo-info {
  padding: 0.5rem;
}

.photo-project {
  margin: 0;
  font-weight: bold;
  color: #000;
}
</style>