import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VuePrintFormat',
      formats: ['es', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'vue-print-format.js'
        if (format === 'umd') return 'vue-print-format.umd.cjs'
        return `vue-print-format.${format}.js`
      }
    },
    rollupOptions: {
      // Externalize peer dependencies
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        globals: {
          vue: 'Vue'
        },
        // Preserve CSS
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'vue-print-format.css'
          return assetInfo.name || 'asset'
        }
      }
    },
    // Generate source maps
    sourcemap: true,
    // Clear output directory before build
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
