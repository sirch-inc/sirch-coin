import { defineConfig } from 'vite'
import ConditionalCompile from "vite-plugin-conditional-compiler";
import react from '@vitejs/plugin-react'
import path from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ConditionalCompile(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
})