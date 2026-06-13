<template>
    <div id="contact" class="contact">
        <div class="contact-header">
            <h2>CONTACT</h2>
        </div>
        
        <div class="contact-icons">
            <!-- <a class="icon-contact" aria-label="Toggle menu" href="https://www.facebook.com/" target="_blank"
                rel="noopener noreferrer">
                <img alt="Logo" class="logo" src="@/assets/facebook.webp"/>
            </a>
            <a class="icon-contact" aria-label="Toggle menu" href="https://www.x.com/" target="_blank"
                rel="noopener noreferrer">
                <img alt="Logo" class="logo" src="@/assets/x.webp"/>
            </a>
            <a class="icon-contact" aria-label="Toggle menu" href="https://www.instagram.com/" target="_blank"
                rel="noopener noreferrer">
                <img alt="Logo" class="logo" src="@/assets/insta.webp"/>
            </a>
            <a class="icon-contact" aria-label="Toggle menu" href="https://www.youtube.com/" target="_blank"
                rel="noopener noreferrer">
                <img alt="Logo" class="logo" src="@/assets/youtube.webp"/>
            </a> -->
            <a class="icon-contact" aria-label="Toggle menu" href="https://www.youtube.com/" target="_blank"
                rel="noopener noreferrer">
                <img alt="Logo" class="logo" src="@/assets/mail.webp"/>
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
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 0.1rem;
}

.icon-contact img {
    height: 50px;
    width: 50px;
}
</style>