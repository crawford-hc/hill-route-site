import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Default `base` is `/` — correct for **Cloudflare Pages** and root GitHub Pages user sites.
 *
 * For a **GitHub project page** (`/repo-name/`), set at build time:
 *   GITHUB_PAGES_BASE=/repo-name/ npm run build
 */
const base = process.env.GITHUB_PAGES_BASE?.trim() || '/'

export default defineConfig({
  plugins: [react()],
  base,
})
