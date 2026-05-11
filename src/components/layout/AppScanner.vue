<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { CameraService } from '@/services/CameraService';
import { CacheService } from '@/services/CacheService';
import type { ScannedPhoto } from '@/types/types';

const emit = defineEmits(['photoCaptured']);

const videoRef = ref<HTMLVideoElement | null>(null);
const cameraService = new CameraService();
const cacheService = new CacheService();

const capturePhoto = async () => {
  if (!videoRef.value) return;

  try {
    const src = await cameraService.captureFrame(videoRef.value);
    const photo: ScannedPhoto = {
      id: Date.now().toString(),
      projectName: 'Projet', // Peut être dynamique si on passe l'artiste en props
      src,
      timestamp: Date.now(),
    };
    cacheService.savePhoto(photo);
    emit('photoCaptured', photo);
  } catch (e) {
    console.error('Erreur de capture:', e);
    alert(`Erreur : ${e instanceof Error ? e.message : 'Inconnu'}`);
  }
};

onMounted(() => {
  cameraService.startCamera().then((stream) => {
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
    }
  }).catch(console.error);
});

onUnmounted(() => {
  cameraService.stopCamera();
});
</script>

<template>
  <div class="scanner-container">
    <h2>Scanner une affiche</h2>
    <div class="video-wrapper">
      <video
        ref="videoRef"
        id="video"
        autoplay
        playsinline
        class="video-preview"
      />
    </div>
    <button
      class="capture-button"
      @click="capturePhoto"
    >
      Capturer
    </button>
  </div>
</template>

<style scoped>
.scanner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.video-wrapper {
  width: 100%;
  max-width: 500px;
  aspect-ratio: 4/3;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.video-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.capture-button {
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.capture-button:hover {
  background: #0056b3;
}
</style>