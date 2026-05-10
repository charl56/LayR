import type { ScannedPhoto } from '@/types/types';

const STORAGE_KEY = 'scannedPhotos';

export class CacheService {
  /**
   * Sauvegarde une photo dans le localStorage.
   * @param photo - La photo à sauvegarder.
   */
  savePhoto(photo: ScannedPhoto): void {
    const photos = this.getPhotos();
    photos.push(photo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  }

  /**
   * Récupère toutes les photos sauvegardées.
   * @returns Tableau des photos scannées.
   */
  getPhotos(): ScannedPhoto[] {
    const storedPhotos = localStorage.getItem(STORAGE_KEY);
    return storedPhotos ? JSON.parse(storedPhotos) : [];
  }

  /**
   * Supprime une photo du cache.
   * @param photoId - L'ID de la photo à supprimer.
   */
  deletePhoto(photoId: string): void {
    const photos = this.getPhotos().filter(photo => photo.id !== photoId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  }

  /**
   * Efface toutes les photos du cache.
   */
  clearPhotos(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}