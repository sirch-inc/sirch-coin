import { defineConfig } from 'vite'
import ConditionalCompile from "vite-plugin-conditional-compiler";
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ConditionalCompile(), react()],
})