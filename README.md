# Hill routes

A static **Vite + React + TypeScript** site for sharing hill days with friends: home cards, full route pages, **hand-drawn suggested route lines** on a Leaflet map, anchor markers, optional waypoint tables, grid-ref copy blocks, optional photos, and a **print-friendly** card.

- **No backend** — content lives under `public/routes/`.
- **Default deploy:** [Cloudflare Pages](#deploy-on-cloudflare-pages-recommended) (`base: /`).
- **Optional:** [GitHub Pages](#github-pages-optional) with `GITHUB_PAGES_BASE=/repo/`.

## Route content model (primary: drawn line)

Each route is a **suggested idea**, not a surveyed track.

1. **`route.json`** — metadata, disclaimer, optional `routeOptions[]`, each with:
   - `suggestedLine[]` — human-readable steps
   - **`suggestedPolyline[]`** — ordered `{ "lat", "lng" }` points for the map (primary line)
   - optional `waypointFile` — JSON list for “GPX-ready” copy per option
2. **`anchorRefs[]`** — label + `gridRef`; add **`lat` / `lng`** to show gold anchor markers on the map.
3. **`waypoints.json`** (optional) — extra markers + table rows (summits, the parker, etc.).
4. **GPX** — **opt-in only.** Set `"gpxFile": "something.gpx"` when you have a file. There is **no** default `route.gpx`. On the map, GPX is a **dashed purple overlay** (checkbox) for comparison, not the main line.

## Folder layout

```text
public/routes/index.json          # { "routes": ["slug-a", "slug-b"] }
public/routes/<slug>/
  route.json
  waypoints.json                  # optional map/table waypoints
  waypoints-option-a.json         # optional per-option copy lists
  photos/                         # optional
  *.gpx                           # optional; reference from route.json only
```

Types: `src/types/route.ts`.

### Rich planning page (optional)

Routes can use extra fields for a **planning-style** layout (see Corryhabbie): `listingBlurb`, `suggestedRouteBadge`, `weatherNote`, `disclaimerSection`, `whyThisRoute`, `recommendationBlock`, `goodStopsDetail`, `whatDayFeelsLike`, `terrainDetail`, `wildlifeIntro`, `wildlifeCards`, `lookoutGallery` (with attribution per item), `anchorRefsTitle` / `anchorRefsIntro`, `planningFooterNote`, and richer `routeOptions` (`tag`, `lineDescription`, `whyPick`, `tradeoff`). Image entries use `AttributedImage`: `title`, optional `imageUrl`, `caption`, `sourceName`, `sourceUrl`, `attributionText`, `licenseName`, optional `licenseUrl`. Use **only** open-licensed or local images; fill attribution when you add files.

## Add a route

1. Copy `public/routes/corryhabbie-hills-circuit/` to `public/routes/your-slug/`.
2. Edit `route.json` (`slug`, `title`, polylines, options, etc.).
3. Add `"your-slug"` to `public/routes/index.json`.

## Add a hand-drawn line

In `route.json`, under the relevant `routeOptions[]` entry, set `suggestedPolyline` to an ordered array of WGS84 points (rough sketch is fine):

```json
"suggestedPolyline": [
  { "lat": 57.41, "lng": -3.31 },
  { "lat": 57.42, "lng": -3.30 }
]
```

Pick the line on the route page with the **Line on map** control.

## Optional GPX (comparison)

1. Add `my-track.gpx` to the route folder.
2. In `route.json`: `"gpxFile": "my-track.gpx"`.
3. On the map, enable **Show recorded GPX overlay (comparison only)**.

Omit `gpxFile` (or use `null` / `""`) if you have no file.

## Local development

```bash
npm install
npm run dev
```

```bash
npm run build    # typecheck + Vite build → dist/
npm run preview  # serve dist
```

## Deploy on Cloudflare Pages (recommended)

1. Push this project to a GitHub (or GitLab) repository.
2. In [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → connect the repo.
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** repository root (or the folder containing this `package.json` if the repo is monorepo-style).
4. **Environment variables (optional):** only if you ever need a subpath, set `GITHUB_PAGES_BASE` in the Cloudflare build environment — for a normal Pages hostname, leave unset so `base` stays `/`.

**Manual step if you have not connected Cloudflare to GitHub before:** complete the Cloudflare browser OAuth / repo picker once; after that, pushes rebuild automatically.

## GitHub Pages (optional)

Project site URL: `https://<user>.github.io/<repo>/` → you need `base: '/<repo>/'`.

```bash
# Windows PowerShell
$env:GITHUB_PAGES_BASE="/<repo-name>/"; npm run build

# macOS / Linux
GITHUB_PAGES_BASE=/<repo-name>/ npm run build
```

Deploy the `dist` output, or use `.github/workflows/deploy-pages.yml` (sets `GITHUB_PAGES_BASE` from the repository name).

Deep links on GitHub project Pages: `public/404.html` + `index.html` sessionStorage snippet.

## Pages

| Path            | Description                   |
| --------------- | ----------------------------- |
| `/`             | Route cards                   |
| `/routes/:slug` | Full route                    |
| `/print/:slug`  | Printable card                |

## Licence

Your GPX, photos, and text stay yours. Use the site code for personal sharing.
