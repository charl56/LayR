// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
// Importe tes pages/composants principaux
import HomeView from '@/components/views/HomeView.vue';
import ScannerView from '@/components/views/ScannerView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/scanner',
    name: 'scanner',
    component: ScannerView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth', // Défilement fluide natif
      }
    }
    return savedPosition || { top: 0 }
  }
});

export default router;