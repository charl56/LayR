<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useNavigationStore } from '@/composables/useNavigationStore';
import { useRouter } from 'vue-router';
import { Controller } from 'mind-ar/dist/mindar-image.prod.js'; // Import de MindAR pour le scan d'images
import { useCollectionStore } from '@/composables/useCollectionStore';
import getAssetSrc from '@/utils/imageUtils';




const router = useRouter();
const { addProjectToCollection } = useCollectionStore();

// --- État Local
const videoRef = ref<HTMLVideoElement | null>(null);
const streamRef = ref<MediaStream | null>(null);
const hasAccess = ref<boolean | null>(null); // null = en attente, true = OK, false = refusé
const errorMessage = ref<string>('');

// --- Configuration et Accès Caméra
const initCamera = async () => {
  try {
    // Si c'est un mobile, on demande en priorité la caméra dorsale ('environment')
    // Sinon (ordinateur), on utilise la caméra frontale/intégrée ('user')
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const facingModeValue = isMobile ? 'environment' : 'user';

    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: facingModeValue,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false // On bloque le micro, inutile pour scanner
    };

    // Demande d'autorisation au navigateur
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

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

// --- Emplacement pour ta future logique d'analyse
// Cette fonction pourra être appelée en boucle (avec un requestAnimationFrame ou setInterval)
// pour analyser le flux vidéo image par image (ex: avec Tesseract.js, OpenCV, etc.)
const startImageAnalysis = async () => {
  if (!videoRef.value) {
    console.error("❌ Erreur : L'élément HTML <video> n'est pas disponible.");
    return;
  }

  // 1. Vérification de la taille de la vidéo (Crucial pour MindAR)
  console.log(`📹 Dimensions du flux vidéo reçues : ${videoRef.value.videoWidth}x${videoRef.value.videoHeight}`);
  // 1. Initialise le contrôleur MindAR avec la dimension de ton flux
  const controller = new Controller({
    inputWidth: videoRef.value?.videoWidth || 1280,
    inputHeight: videoRef.value?.videoHeight || 720,
    maxTrack: 1 // On cherche une seule affiche à la fois
  });



  console.log("⚙️ Compilations des matrices graphiques (controller.init)...");
  if (typeof controller.init === 'function') {
    await controller.init();
  }

  // 2. Charge ton fichier contenant les empreintes géométriques de tes affiches
  // (généré à partir de tes images d'affiches dans l'outil mind-ar compiler)
  console.log("⏳ Chargement du fichier de cibles (.mind)...");
  console.log(getAssetSrc('mind-targets/kelaggs_nvlvie.mind'))
  await controller.addImageTargets(getAssetSrc('mind-targets/kelaggs_nvlvie.mind'));


  // 3. Associe le flux vidéo au moteur d'analyse
  console.log("⏳ Initialisation du dummyRun (Warmup du moteur)...");
  const warmup = await controller.dummyRun(videoRef.value);
  // On inspecte ce que le moteur a compris de la vidéo
  console.log("⚙️ Statut du moteur après dummyRun :", warmup);

  let frameCount = 0;

  // 4. Lance la boucle d'analyse en temps réel
  const detectLoop = () => {
    // 1. Sécurité : si l'utilisateur quitte la page ou coupe la caméra, on stoppe tout
    if (!streamRef.value || !videoRef.value) return;

    try {
      frameCount++;
      const results = controller.processVideo(videoRef.value);

      // Log d'échantillonnage : On affiche un log toutes les 100 frames 
      // pour éviter de saturer ta console, tout en vérifiant que ça tourne
      if (frameCount % 100 === 0) {
        console.log(`📸 Frame #${frameCount} analysée. Résultat brut du controller :`, results);
      }

      // 2. Si le moteur n'a rien renvoyé sur cette frame (results est undefined ou nul)
      // On passe tranquillement à la frame suivante sans crasher !
      if (!results) {
        requestAnimationFrame(detectLoop);
        return;
      }

      // 3. Gestion du format de MindAR : results peut être directement la prédiction, 
      // ou un tableau contenant les prédictions de chaque affiche.
      let prediction = null;
      if (Array.isArray(results)) {
        prediction = results[0]?.prediction; // Récupère la première affiche si c'est un tableau
      } else {
        prediction = results.prediction; // Récupère directement si c'est un objet
      }

      // 4. Si une affiche commence à être analysée
      if (prediction && prediction.score > 0.7) {
        console.log("Affiche détectée ! Score de confiance :", prediction.score);
        console.log("Index de l'affiche :", prediction.targetIndex);

        const video = mapTargetIndexToVideo(prediction.targetIndex);
        onScanSuccess(video);
        return; // 🎯 SUCCÈS : On arrête définitivement la boucle
      }

    } catch (loopError) {
      // Si une frame a un bug mineur, on l'attrape ici pour éviter de bloquer l'application
      console.warn("Erreur mineure pendant l'analyse de la frame :", loopError);
    }

    // 5. RECHARGE : Si on n'a rien trouvé à cette frame, on demande la frame suivante !
    requestAnimationFrame(detectLoop);
  };

  requestAnimationFrame(detectLoop);
};


const mapTargetIndexToVideo = (index: number): string => {
  // Exemple : si ton image 0 dans le fichier .mind est celle de l'artiste 1, etc.
  const mapping: Record<number, string> = {
    0: 'kelaggs_nvlvie',
    1: 'kelaggs_nvlvie',
    2: 'kelaggs_nvlvie',
    3: 'kelaggs_nvlvie',
  };
  return mapping[index] || 'unknown';
};

const onScanSuccess = (video: string) => {
  console.log("Affiche scannée avec succès ! ID de l'artiste :", video.split('_'));
  // addProjectToCollection(video);

  // goToCollection(detectedArtistId);
  // router.push('/');
};

// --- Cycle de vie
onMounted(() => {
  // Debug : inspecte ce que le CDN expose réellement
  console.log('window.MINDAR :', (window as any).MINDAR);
  console.log('window.MindAR :', (window as any).MindAR);
  console.log('window keys with "mind" :',
    Object.keys(window).filter(k => k.toLowerCase().includes('mind'))
  );

  initCamera();
});

onBeforeUnmount(() => {
  // ⚠️ CRUCIAL : On coupe proprement la caméra quand on quitte la page
  // Sinon la LED verte/orange du téléphone reste allumée en tâche de fond !
  if (streamRef.value) {
    streamRef.value.getTracks().forEach(track => track.stop());
  }
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