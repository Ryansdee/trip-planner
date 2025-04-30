import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {VitePWA} from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Permet à votre app de mettre à jour automatiquement
      devOptions: {
        enabled: true // Active la PWA en mode développement
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\/.*\.(?:js|css|html|json)/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // Cache pendant 30 jours
              }
            }
          }
        ]
      }
    })
  ]
});
