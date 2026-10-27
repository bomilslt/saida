import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    // Les archives (ex. zips WhatsApp) peuvent être verrouillées par une
    // autre application : on ne les watch pas, sinon le serveur plante.
    watch: {
      ignored: ['**/*.zip'],
    },
  },
})
