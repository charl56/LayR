<script setup lang="ts">
import getAssetSrc from '@/utils/imageUtils';

const props = defineProps<{
  text1: string,
  text2?: string,
  imageUrl: string
}>();


</script>

<template>

    <div class="info-layout" >
        <img class="info-layout_img" :src="getAssetSrc(imageUrl)" />

        <div :class="text2 == undefined ? 'only-one-text' : 'two-text first'">
            <p>{{ text1 }}</p>
        </div>

        <div v-if="text2 != undefined" class="two-text second">
            <p>{{ text2 }}</p>
        </div>

    </div>
</template>

<style scoped>
.info-layout {
    height: 100svh;
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
    top: -100svh;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #fff;
}

.two-text{
    width: 80%;
position: absolute;
    color: #fff;

}

.first{
    top: 120px;
    left: 1rem;
}

.second{
    bottom: 120px;
    right: 1rem;
    text-align: end;
}
</style>