import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // ⚡ 1. Import the Tailwind plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ⚡ 2. Inject the Tailwind compiler engine here
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // ⚡ 3. Restores your path aliases
    },
  },
});
