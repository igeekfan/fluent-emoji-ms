import path from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      outDir: 'dist',
      include: ['src/**/*.ts', 'src/**/*.vue', 'src/**/*.d.ts'],
      staticImport: true
    })
  ],
  build: {
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'FluentEmojiMSVue',
      fileName: 'fluent-emoji-ms-vue',
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue', '@fluent-emoji-ms/core'],
      output: {
        globals: {
          vue: 'Vue'
        },
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
