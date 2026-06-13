<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { ARTISTS } from '@/data/artists';
import { useCollectionStore } from '@/composables/useCollectionStore';
import { useRouter } from 'vue-router';
import getAssetSrc from '@/utils/imageUtils';
import jsQR from 'jsqr';


const router = useRouter();

// --- État Local
const videoRef = ref<HTMLVideoElement | null>(null);
const streamRef = ref<MediaStream | null>(null);
const hasAccess = ref<boolean | null>(null); // null = en attente, true = OK, false = refusé
const errorMessage = ref<string>('');
const controllerRef = ref<any>(null);
const activeVideoUrl = ref<string | null>(null); // URL de la vidéo à afficher
const isDetecting = ref(true); // Pour stopper la boucle après détection


// --- Configuration et Accès Caméra
const initCamera = async () => {
  try {
    // Si c'est un mobile, on demande en priorité la caméra dorsale ('environment')
    // Sinon (ordinateur), on utilise la caméra frontale/intégrée ('user')
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const facingModeValue = isMobile ? 'environment' : 'user';

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facingModeValue, width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    });

    streamRef.value = stream;
    hasAccess.value = true;

    await nextTick();

    // Injecte le flux vidéo dans notre balise HTML <video>
    if (videoRef.value) {
      videoRef.value.srcObject = stream;

      // 💡 SÉCURITÉ MOBILE : Force le lancement de la vidéo au cas où le autoplay soit bloqué
      videoRef.value.play().catch(playErr => {
        console.warn("Le autoplay a été bloqué par le navigateur, tentative de relance...", playErr);
      });
    }
  } catch (err: any) {
    hasAccess.value = false;
    errorMessage.value = "Impossible d'accéder à l'appareil photo. Assurez-vous d'avoir accordé les autorisations nécessaires.";
    console.error("Erreur caméra :", err);
  }
};

// --- Scan QR Code
const startImageAnalysis = () => {
  if (!videoRef.value) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  isDetecting.value = true;

  const detectLoop = () => {
    if (!videoRef.value || !streamRef.value || !isDetecting.value) return;

    canvas.width = videoRef.value.videoWidth;
    canvas.height = videoRef.value.videoHeight;
    ctx.drawImage(videoRef.value, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) {
      onScanSuccess(code.data);
      return; // Stop la boucle
    }

    requestAnimationFrame(detectLoop);
  };

  requestAnimationFrame(detectLoop);
};



// --- Gestion du résultat
const onScanSuccess = (lien: string) => {
  isDetecting.value = false; // Stop la boucle de scan

  // Extrait l'id du projet depuis l'URL : https://layr.ostudio426.com/scanner/kelaggs_nvlvie
  const projectId = lien.split('/').pop();
  console.log(projectId)
  if (!projectId) return;

  // Recherche le projet dans les données ARTISTS
  let videoUrl: string | undefined;

  for (const artist of ARTISTS) {
    const project = artist.projets.find(p => p.videoId === projectId);
    if (project?.video) {
      videoUrl = project.video;
      break;
    }
  }

  if (!videoUrl) {
    console.warn('Projet introuvable pour id :', projectId);
    isDetecting.value = true; // Reprend le scan si rien trouvé
    requestAnimationFrame(() => startImageAnalysis());
    return;
  }

  // Ajoute l'id dans l'URL sans recharger la page
  router.replace({ query: { video: projectId } });

  // Lance la vidéo
  activeVideoUrl.value = videoUrl;
};

// --- Ferme la vidéo
const closeVideo = () => {
  activeVideoUrl.value = null;
  router.replace({ query: {} }); // Retire le param de l'URL
  isDetecting.value = true;
  startImageAnalysis(); // Reprend le scan
};

onScanSuccess("https://layr.ostudio426.com/scanner/kelaggs_nvlvie");


// --- Cycle de vie
onMounted(() => {
  initCamera();


  // Vérifie si une vidéo est demandée dans l'URL (arrivée depuis app externe)
  const videoId = router.currentRoute.value.query.video as string | undefined;
  if (videoId) {
    for (const artist of ARTISTS) {
      const project = artist.projets.find(p => p.videoId === videoId);
      if (project?.video) {
        console.log('Vidéo demandée dans l\'URL :', project?.video);
        activeVideoUrl.value = getAssetSrc(project.video);
        break;
      }
    }
  }

});

onBeforeUnmount(() => {
  controllerRef.value?.stopProcessVideo();
  streamRef.value?.getTracks().forEach(track => track.stop());
});
</script>

<template>
  <div class="scanner-container">

    <div v-if="hasAccess === null" class="message-overlay text-center">
      <div class="spinner"></div>
      <p>Veuillez autoriser l'accès à votre appareil photo pour scanner l'affiche...</p>
    </div>

    <div v-else-if="hasAccess === false" class="message-overlay text-center error">
      <p>⚠️ Accès caméra requis</p>
      <p class="sub-error">{{ errorMessage }}</p>
      <button @click="router.push('/')" class="btn-back">Retour à l'accueil</button>
    </div>

    <div v-else class="camera-wrapper">
      <video ref="videoRef" autoplay playsinline muted controls="false" @loadedmetadata="startImageAnalysis"
        class="video-feed"></video>

      <div class="scanner-overlay">
        <div class="scan-frame">
          <div class="scan-laser"></div>
        </div>
        <p class="scan-instructions">Cadrez l'affiche à l'intérieur du rectangle</p>
      </div>
    </div>


    <!-- Overlay vidéo -->
    <Transition name="fade">
      <div v-if="activeVideoUrl" class="video-overlay" @click.self="closeVideo">
        <button class="btn-close" @click="closeVideo">✕</button>
        <video class="project-video" :src="activeVideoUrl" autoplay controls playsinline />
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.scanner-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #0c0c0c;
  z-index: 99;
  overflow: hidden;
  font-family: sans-serif;
}

/* --- Messages de chargement et d'erreur --- */
.message-overlay {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 2rem;
  box-sizing: border-box;
  color: #ffffff;
  text-align: center;
}

.sub-error {
  font-size: 0.9rem;
  color: #aaaaaa;
  margin-top: 0.5rem;
  max-width: 300px;
}

.btn-back {
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

/* --- Flux Vidéo plein écran --- */
.camera-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.video-feed {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Remplit l'écran sans déformer */
}

/* --- Viseur CSS --- */
.scanner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* Assombrit subtilement le contour du viseur */
  background: rgba(0, 0, 0, 0.4);
  z-index: 2;
  pointer-events: none;
  /* Laisse l'utilisateur cliquer à travers si besoin */
}

/* 📐 Dimensions du rectangle demandées (200px haut, 100px large) */
.scan-frame {
  width: 200px;
  height: 300px;
  border: 3px solid #ffffff;
  /* Le bandeau blanc autour */
  border-radius: 12px;
  background: transparent;
  /* Fond transparent */
  position: relative;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2), 0 0 0 4000px rgba(0, 0, 0, 0.3);
  /* Crée la découpe sombre autour */
}

/* ⚡ Petit effet sympa de ligne de scan (laser) */
.scan-laser {
  position: absolute;
  left: 5%;
  width: 90%;
  height: 2px;
  background-color: var(--layr-color-1);
  box-shadow: 0 0 8px var(--layr-color-1);
  animation: scanMove 2.5s infinite ease-in-out;
}

.scan-instructions {
  color: #ffffff;
  margin-top: 2rem;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

/* --- Animations --- */
@keyframes scanMove {
  0% {
    top: 5%;
  }

  50% {
    top: 95%;
  }

  100% {
    top: 5%;
  }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 1s infinite linear;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>