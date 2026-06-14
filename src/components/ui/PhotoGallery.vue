<script setup lang="ts">
import { ARTISTS } from '@/data/artists';
import type { Artist, Info } from '@/types/types';
import getAssetSrc from '@/utils/imageUtils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { useCollectionStore } from '@/composables/useCollectionStore';

gsap.registerPlugin(ScrollTrigger);


const props = defineProps<{
  currentData: Info;
}>();
const currentProjectImg = ref<string>('');
const showImage = ref<boolean>(false);
const triggerRefs = ref<ScrollTrigger[]>([]);
const artist = ref<Artist>(ARTISTS[0]!);
const { loadFromStorage, getProjectsByArtist } = useCollectionStore();
const activeVideoUrl = ref<string | null>(null);
const showVideo = ref<boolean>(false);


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
      pinSpacing: true,
      // markers: true,
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


const handleProjectClick = (index: number) => {
  if (!isArtist(props.currentData)) return;

  const targetProject = props.currentData.projets[index];
  if (!targetProject) return;

  // 1. Vérifier dans le localStorage via l'état chargé au mounted
  const unlockedProjects = getProjectsByArtist(props.currentData.id);
  const isUnlocked = unlockedProjects.some(p => p.projectId === targetProject.videoId);

  // 2. Si le projet est débloqué, on récupère et lance la vidéo
  if (isUnlocked && targetProject.video) {
    activeVideoUrl.value = getAssetSrc(targetProject.video);
    showVideo.value = true;
  } else {
    console.log(`🔒 Le projet [${targetProject.name}] n'est pas encore débloqué.`);
  }
};

const closeVideo = () => {
  showVideo.value = false;
  activeVideoUrl.value = null;
};

onMounted(() => {
  // Délai pour laisser le DOM se rendre
  setTimeout(() => {
    initAnimations();
  }, 100);

  loadFromStorage();
  let projets = getProjectsByArtist(props.currentData.id);
  console.log(projets)


});

onBeforeUnmount(() => {
  triggerRefs.value.forEach(trigger => {
    trigger.kill();
  });
});


</script>

<template>
  <div id="galery" class="photo-galery">
    <div class="photo-galery-header">
      <h2>GALERIE</h2>
    </div>

    <!-- PreLoad imgs -->
    <div style="display: none;">
      <img v-for="projet in isArtist(currentData) ? currentData.projets : []" :key="projet.img"
        :src="getAssetSrc(`artists/${projet.img}`)" :alt="projet.name" />
    </div>

    <div class="image-overlay" :class="[showImage ? '' : 'hide-image']"
      @click="isArtist(currentData) && handleProjectClick(currentData.projets.findIndex(p => p.img === currentProjectImg))">
      <img :src="getAssetSrc(`artists/${currentProjectImg}`)" :alt="'Project image'" class="overlay-image" />
    </div>

    <div v-if="isArtist(currentData)" class="galery-div">
      <div v-for="(projet, index) in currentData.projets" :key="projet.img" @click="handleProjectClick(index)" class="photo-card">
        <div class="photo-info">
          <p class="photo-project">{{ projet.name }}</p>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showVideo && activeVideoUrl" class="video-overlay" @click.self="closeVideo">
        <video class="project-video" :src="activeVideoUrl" autoplay loop playsinline />
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.photo-galery {
  width: 100%;
  padding-bottom: 5vh;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: #000000;
  padding: 1rem 0rem;
  color: #fff;
}

.photo-galery-header {
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  pointer-events: none;
  transition: 0.2s ease-in-out;
}

.hide-image {
  position: fixed;
  opacity: 0;
}

.overlay-image {
  border-radius: 5px;
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


.video-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

.project-video {
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  border-radius: 12px;
  outline: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

/* --- Transition Fade --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>