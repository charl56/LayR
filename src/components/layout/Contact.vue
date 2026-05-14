<script setup lang="ts">
import { ref } from 'vue';

// État pour gérer l'ouverture/fermeture du contenu
const isOpen = ref(false);

// Fonction pour basculer l'état
const toggleContent = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
    <div id="contact" class="contact">
        <!-- En-tête cliquable pour déployer/fermer la liste -->
        <div class="contact-header" @click="toggleContent">
            <h2>CONTACT</h2>
        </div>
        
        <!-- Contenu des icônes (affichée si isOpen = true) -->
        <div v-if="isOpen" class="contact-icons">
            <a class="icon-contact" aria-label="Toggle menu" href="https://www.facebook.com/" target="_blank"
                rel="noopener noreferrer">
                <img alt="Logo" class="logo" src="@/assets/facebook.svg"/>
            </a>
            <a class="icon-contact" aria-label="Toggle menu" href="https://www.x.com/" target="_blank"
                rel="noopener noreferrer">
                <img alt="Logo" class="logo" src="@/assets/x.svg"/>
            </a>
            <a class="icon-contact" aria-label="Toggle menu" href="https://www.instagram.com/" target="_blank"
                rel="noopener noreferrer">
                <img alt="Logo" class="logo" src="@/assets/instagram.svg"/>
            </a>
            <a class="icon-contact" aria-label="Toggle menu" href="https://www.youtube.com/" target="_blank"
                rel="noopener noreferrer">
                <img alt="Logo" class="logo" src="@/assets/youtube.svg"/>
            </a>
        </div>

    </div>
</template>

<style scoped>
.contact {
    width: 100%;
    overflow: hidden;
}

.contact-header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 5rem;
    padding: 1rem;
    cursor: pointer;
    user-select: none;
    background-color: white;
    color: black;
    transition: background-color 0.3s, color 0.3s;
}

.contact-header h2 {
    margin: 0;
}

.contact-icons {
    display: flex;
    justify-content: center;
    height: 56px;
    margin-bottom: 2rem;
}

.icon-contact{
    height: 100%;
    width: 70px;
}

.icon-contact img {
    height: 56px;
    width: 56px;
}
</style>