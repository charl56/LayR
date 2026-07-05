<!-- VideoPlayer.vue -->
<template>
    <div class="video-wrapper">
        <video ref="videoRef" class="video-player" :src="src" :poster="poster" controls playsinline webkit-playsinline
            preload="metadata" @loadedmetadata="onLoadedMetadata" @error="onError">
            Votre navigateur ne supporte pas la balise vidéo.
        </video>

        <p v-if="hasError" class="video-error">
            Impossible de charger la vidéo.
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
    src: string
    poster?: string
    autoplay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    autoplay: false,
})

const videoRef = ref<HTMLVideoElement | null>(null)
const hasError = ref(false)

function onLoadedMetadata() {
    hasError.value = false

    // Autoplay fiable sur mobile : nécessite muted + playsinline
    if (props.autoplay && videoRef.value) {
        videoRef.value.muted = true
        videoRef.value.play().catch((err) => {
            console.warn('Autoplay bloqué par le navigateur :', err)
        })
    }
}

function onError() {
    hasError.value = true
}

defineExpose({ videoRef })
</script>

<style scoped>
.video-wrapper {
    width: 100%;
}

.video-player {
    width: 100%;
    height: auto;
    display: block;
    /* iOS applique parfois un rendu bizarre sans ça */
    border-radius: 8px;
    background-color: #000;
}

.video-error {
    color: #d32f2f;
    font-size: 0.875rem;
    margin-top: 8px;
}
</style>