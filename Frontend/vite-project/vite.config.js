import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { fileURLToPath } from "url"

// Fix __dirname in Vite
const __filename = fileURLToPath(import.meta.url)
const __dirname1 = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname1, "./src"),
    },
  },
})
