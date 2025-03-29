import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import dts from 'vite-plugin-dts'

// 根据环境变量决定是作为库构建还是作为网站构建
export default defineConfig(({ mode }) => {
  // 获取构建模式
  const isLibraryMode = mode === 'lib'
  
  // 基础配置
  const baseConfig = {
    plugins: [
      vue(),
      // 只在库模式下生成类型声明文件
      isLibraryMode && dts({
        outDir: 'dist', // 修改为根 dist 目录，与库文件放在一起
        include: ['src/**/*.ts', 'src/**/*.vue', 'src/**/*.d.ts'],
        exclude: [
          'src/examples/**/*', 
          'src/App.vue', 
          'src/main.ts',
          'src/useEmojiSelector.d.ts'
        ],
        staticImport: true
      })
    ].filter(Boolean),
    base: '/fluent-emoji-ms/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  }

  // 如果是库模式，使用库配置
  if (isLibraryMode) {
    return {
      ...baseConfig,
      build: {
        outDir: 'dist', // 修改为根 dist 目录
        lib: {
          entry: path.resolve(__dirname, 'src/index.ts'),
          name: 'FluentEmojiMS',
          fileName: (format) => `fluent-emoji-ms.${format}.js`
        },
        // 确保CSS被提取并包含在发布包中
        cssCodeSplit: true,
        rollupOptions: {
          // 确保只有Vue是外部依赖
          external: ['vue'],
          output: {
            globals: {
              vue: 'Vue'
            },
            // 提取CSS到单独文件
            assetFileNames: (assetInfo) => {
              if (assetInfo.name.endsWith('.css')) {
                return 'style.css';
              }
              return 'assets/[name]-[hash][extname]';
            },
            // 确保导出方式支持命名导出和默认导出
            exports: 'named'
          }
        }
      }
    }
  }
  
  // 否则使用网站配置
  return {
    ...baseConfig,
    build: {
      outDir: 'dist/web',
      assetsDir: 'assets',
      emptyOutDir: true
    }
  }
})
