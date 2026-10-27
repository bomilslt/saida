import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    // Les médias (photos, vidéos, audios, archives WhatsApp) sont souvent
    // verrouillés pendant leur copie : on ne les watch pas, sinon le
    // serveur plante (EBUSY). Ils sont servis tels quels, sans HMR utile.
    watch: {
      ignored: ['**/public/media/**'],
    },
  },
})
