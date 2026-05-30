<script setup lang="ts">
import { useNavigationStore } from '@/composables/useNavigationStore';
import { useRouter } from 'vue-router';

const { goToCollection } = useNavigationStore();
const router = useRouter();

const onScanSuccess = (detectedArtistId: string) => {
  // 1. Met à jour l'artiste et passe la page en mode 'collection' globalement
  goToCollection(detectedArtistId); 
  
  // 2. Redirige l'utilisateur sur la Home (qui affichera direct la galerie de l'artiste !)
  router.push('/'); 
};


</script>

<template>
scanner
</template>

<style scoped>

</style>