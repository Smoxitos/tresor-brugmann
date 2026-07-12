import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, isPreview }) => ({
  // GitHub Pages héberge ce projet dans /tresor-brugmann/ tandis que le
  // serveur de développement local reste disponible directement à la racine.
  base: command === 'build' || isPreview ? '/tresor-brugmann/' : '/',
  plugins: [react()],
}));
