import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      outDir: 'dist',
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      staticImport: true
    })
  ],
  build: {
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'FluentEmojiMSReact',
      fileName: 'fluent-emoji-ms-react',
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@igeekfan/fluent-emoji-ms-core'],
      output: {
        globals: {
          react: 'React'
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
