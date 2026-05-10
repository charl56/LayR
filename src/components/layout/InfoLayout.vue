<script setup lang="ts">
import { computed } from 'vue';
import type { DTOInfo } from '@/types/DTOInfo';
import getAssetSrc from '@/utils/imageUtils';

const props = defineProps<{
  text1: String,
  text2?: String,
  imageUrl: String
}>();


</script>

<template>

    <div class="info-layout" >
        <img class="info-layout_img" :src="getAssetSrc(imageUrl)" />

        <div :class="text2 == undefined ? 'only-one-text' : 'first-text'">
            <p>{{ text1 }}</p>
        </div>

        <div v-if="text2 != undefined" class="second-text">
            <p>{{ text2 }}</p>
        </div>

    </div>
</template>

<style scoped>
.info-layout {
    height: 100dvh;
    width: 100%;
    padding: 0;
    position: relative; /* Pour positionner les textes par rapport à ce conteneur */
    overflow: hidden; /* Empêche le défilement horizontal */
}

.info-layout_img{
    width: 100%; /* Prend toute la largeur du conteneur */
    height: 100%; /* Prend toute la hauteur du conteneur */
    object-fit: cover; /* Conserve les proportions et remplit tout l'espace */
    object-position: center; /* Centre l'image si elle est recadrée */
}

.only-one-text{
    height: 100%;
    position: relative;
    display: flex;
    top: -100dvh;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #fff;
}

.first-text{
    width: 80%;
    position: absolute;
    top: 120px;
    left: 0.5rem;
    color: #fff;
}

.second-text{
    width: 80%;
    position: absolute;
    bottom: 120px;
    right: 0.5rem;
    color: #fff;
    text-align: end;
}
</style>