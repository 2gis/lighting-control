import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// eslint-disable-next-line import/no-default-export -- Config requires default export
export default defineConfig({
  build: {
    lib: {
      entry: [
        resolve(__dirname, "./src/index.ts")
      ],
      formats: ['es']
    },
    rollupOptions: {
      external: ["@2gis/mapgl"],
    },
  },
})