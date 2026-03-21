import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/**
 * Default `base` is `/` — correct for **Cloudflare Pages** and root GitHub Pages user sites.
 *
 * For a **GitHub project page** (`/repo-name/`), set at build time:
 *   GITHUB_PAGES_BASE=/repo-name/ npm run build
 */
const base = process.env.GITHUB_PAGES_BASE?.trim() || '/'

/** Absolute path to index.html for SPA recovery (404.html must not use relative ./index.html). */
function spaIndexHref(viteBase: string): string {
  const b = viteBase.endsWith('/') ? viteBase : `${viteBase}/`
  if (b === '/') return '/index.html'
  return `${b}index.html`
}

function injectSpa404Redirect(viteBase: string): Plugin {
  const placeholder = '__VITE_SPA_INDEX__'
  const indexHref = spaIndexHref(viteBase)
  return {
    name: 'inject-spa-404-redirect',
    closeBundle() {
      const out = path.resolve(process.cwd(), 'dist', '404.html')
      if (!fs.existsSync(out)) return
      const html = fs.readFileSync(out, 'utf8')
      if (!html.includes(placeholder)) return
      fs.writeFileSync(out, html.split(placeholder).join(indexHref))
    },
  }
}

export default defineConfig({
  plugins: [react(), injectSpa404Redirect(base)],
  base,
})
