import path from 'path'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [svelte()],
  build: {
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'FluentEmojiMSSvelte',
      fileName: 'fluent-emoji-ms-svelte',
      formats: ['es']
    },
    rollupOptions: {
      external: ['svelte', '@fluent-emoji-ms/core'],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'style.css'
          }

          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})
