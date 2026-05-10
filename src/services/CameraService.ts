export class CameraService {
    private stream: MediaStream | null = null;

    /**
     * Démarre la caméra et retourne le flux vidéo.
     * @returns Promise résolue avec le flux vidéo.
     * @throws Erreur si l'accès à la caméra est refusé.
     */
    async startCamera(): Promise<MediaStream> {
        if (this.stream) {
            this.stopCamera(); // Arrête le flux existant avant d'en démarrer un nouveau
        }

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }, // Caméra arrière par défaut (pour mobile)
                audio: false,
            });
            return this.stream;
        } catch (error) {
            console.error('Erreur lors de l\'accès à la caméra:', error);
            throw new Error('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
        }
    }

    /**
     * Arrête la caméra et libère le flux vidéo.
     */
    stopCamera(): void {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }

    /**
     * Capture une frame depuis une balise `<video>`.
     * @param videoElement - L'élément vidéo source.
     * @returns Promise résolue avec l'URL de l'image capturée (base64).
     */
    async captureFrame(videoElement: HTMLVideoElement): Promise<string> {
        if (!this.stream) {
            throw new Error('Aucun flux vidéo actif. Appelez startCamera() d\'abord.');
        }

        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('Impossible de créer un contexte 2D pour le canvas.');
        }

        // Dessine la frame actuelle du vidéo sur le canvas
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Retourne l'image en base64 (format PNG)
        return canvas.toDataURL('image/png');
    }
}