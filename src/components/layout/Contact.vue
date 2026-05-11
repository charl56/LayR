<script setup lang="ts">
import { ref } from 'vue';


</script>

<template>
    <div id="contact" class="contact">
        <!-- En-tête cliquable pour déployer/fermer la liste -->
        <div class="contact-header">
            <h2>Contact</h2>
        </div>
        <div class="contact-icons">
            <a class="btn-contact" aria-label="Toggle menu" href="https://www.facebook.com/" target="_blank"
                rel="noopener noreferrer">
                <img alt="Logo" class="logo" src="@/assets/facebook.svg" width="80" height="70" />
            </a>
            <a class="btn-contact" aria-label="Toggle menu" href="https://www.x.com/" target="_blank"
                rel="noopener noreferrer">
                <img alt="Logo" class="logo" src="@/assets/x.svg" width="80" height="70" />
            </a>
            <a class="btn-contact" aria-label="Toggle menu" href="https://www.instagram.com/" target="_blank"
                rel="noopener noreferrer">
                <img alt="Logo" class="logo" src="@/assets/instagram.svg" width="80" height="70" />
            </a>
            <a class="btn-contact" aria-label="Toggle menu" href="https://www.youtube.com/" target="_blank"
                rel="noopener noreferrer">
                <img alt="Logo" class="logo" src="@/assets/youtube.svg" width="80" height="70" />
            </a>
        </div>

    </div>
</template>

<style scoped>
.contact {
    width: 100%;
    border-radius: 4px;
    overflow: hidden;
}

.contact-header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    cursor: pointer;
    /* Curseur "main" pour indiquer que c'est cliquable */
    user-select: none;
    /* Empêche la sélection du texte */
    background-color: #ffffff;
    color: black;
    transition: background-color 0.3s, color 0.3s;
    /* Animation pour la transition */
}

.contact-header h2 {
    margin: 0;
    font-size: 1.2rem;
}

.contact-icons {
    display: flex;
    justify-content: center;
}

.btn-contact{

}
</style>