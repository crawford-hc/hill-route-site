import { gpx } from '@tmcw/togeojson'
import L from 'leaflet'
import { useEffect, useRef, useState } from 'react'
import type { FeatureCollection } from 'geojson'
import type { AnchorRef, LatLng, RouteJson, RouteOption, WaypointJson } from '../types/route'
import { routeGpxUrl } from '../lib/loadRoutes'
import { RouteMap27700 } from './RouteMap27700'

import 'leaflet/dist/leaflet.css'

const NO_LINE: LatLng[] = []

interface Props {
  route: RouteJson
  waypoints: WaypointJson[]
  /** Which option’s `suggestedPolyline` to draw; `null` = none */
  selectedOptionId: string | null
}

const WP_COLORS: Record<string, string> = {
  parking: '#1d4ed8',
  summit: '#b45309',
  junction: '#7c3aed',
  landmark: '#0f766e',
  gate: '#4b5563',
  'river-crossing': '#0369a1',
  anchor: '#0f172a',
  other: '#15803d',
}

function wpColor(type: string): string {
  return WP_COLORS[type] ?? WP_COLORS.other
}

function boundsFromLatLngs(pts: L.LatLngExpression[]): L.LatLngBounds | null {
  if (pts.length === 0) return null
  return L.latLngBounds(pts)
}

function boundsFromWaypoints(pts: WaypointJson[]): L.LatLngBounds | null {
  if (pts.length === 0) return null
  return L.latLngBounds(pts.map((w) => L.latLng(w.lat, w.lng)))
}

function boundsFromRoute(route: RouteJson): L.LatLngBounds | null {
  const b = route.bounds
  if (!b) return null
  return L.latLngBounds(L.latLng(b.south, b.west), L.latLng(b.north, b.east))
}

function anchorMarkers(anchors: AnchorRef[] | undefined): L.LatLngExpression[] {
  const out: L.LatLngExpression[] = []
  for (const a of anchors ?? []) {
    if (a.lat != null && a.lng != null) out.push(L.latLng(a.lat, a.lng))
  }
  return out
}

function selectedOption(
  options: RouteOption[] | undefined,
  id: string | null,
): RouteOption | null {
  if (!id || !options?.length) return null
  return options.find((o) => o.id === id) ?? null
}

export function RouteMap(props: Props) {
  if (!props.route.mapCenter) {
    return (
      <div className="planning-map planning-map--empty" role="status">
        No map for this page (missing centre).
      </div>
    )
  }
  const osKey = import.meta.env.VITE_OS_MAPS_API_KEY
  if (osKey) {
    return <RouteMap27700 {...props} />
  }
  return <RouteMapOpenStreetMap {...props} />
}

function RouteMapOpenStreetMap({ route, waypoints, selectedOptionId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [gpxOverlay, setGpxOverlay] = useState(false)
  const [gpxNote, setGpxNote] = useState<string | null>(null)
  const gpxUrl = routeGpxUrl(route)

  const opt = selectedOption(route.routeOptions, selectedOptionId)
  const polyline: LatLng[] = opt?.suggestedPolyline ?? NO_LINE

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const mc = route.mapCenter
    if (!mc) return

    const map = L.map(el, {
      scrollWheelZoom: true,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    const layers = L.layerGroup().addTo(map)
    const zoom = route.mapZoom ?? 12
    map.setView([mc.lat, mc.lng], zoom)

    let cancelled = false

    const fitAll = (extra: L.LatLngExpression[] = []) => {
      const pts: L.LatLngExpression[] = [...extra]
      for (const p of polyline) pts.push(L.latLng(p.lat, p.lng))
      pts.push(...anchorMarkers(route.anchorRefs))
      for (const w of waypoints) pts.push(L.latLng(w.lat, w.lng))

      const bb = boundsFromLatLngs(pts)
      if (bb?.isValid()) {
        map.fitBounds(bb.pad(0.1))
        return
      }
      const wb = boundsFromWaypoints(waypoints)
      if (wb?.isValid()) map.fitBounds(wb.pad(0.12))
      else {
        const rb = boundsFromRoute(route)
        if (rb?.isValid()) map.fitBounds(rb.pad(0.05))
      }
    }

    if (polyline.length >= 2) {
      const latlngs = polyline.map((p) => L.latLng(p.lat, p.lng))
      L.polyline(latlngs, {
        color: '#1a4d2e',
        weight: 5,
        opacity: 0.92,
        lineJoin: 'round',
      }).addTo(layers)
    }

    for (const a of route.anchorRefs ?? []) {
      if (a.lat == null || a.lng == null) continue
      const c = L.circleMarker([a.lat, a.lng], {
        radius: 10,
        color: '#0f172a',
        weight: 2,
        fillColor: '#fbbf24',
        fillOpacity: 0.95,
      })
      const bits = [`<strong>${escapeHtml(a.label)}</strong>`, `<p>Grid: ${escapeHtml(a.gridRef)}</p>`]
      c.bindPopup(bits.join(''))
      c.addTo(layers)
    }

    for (const w of waypoints) {
      const circle = L.circleMarker([w.lat, w.lng], {
        radius: 8,
        color: '#0f172a',
        weight: 2,
        fillColor: wpColor(String(w.type)),
        fillOpacity: 0.9,
      })
      const bits: string[] = [`<strong>${escapeHtml(w.name)}</strong>`]
      if (w.type) bits.push(`<span class="popup-type">${escapeHtml(String(w.type))}</span>`)
      if (w.description) bits.push(`<p>${escapeHtml(w.description)}</p>`)
      if (w.gridRef) bits.push(`<p>Grid: ${escapeHtml(w.gridRef)}</p>`)
      if (w.elevationM != null) bits.push(`<p>${w.elevationM} m</p>`)
      circle.bindPopup(bits.join(''))
      circle.addTo(layers)
    }

    fitAll()

    const loadGpx = () => {
      if (!gpxUrl || !gpxOverlay) return

      fetch(gpxUrl)
        .then((r) => {
          if (!r.ok) throw new Error('missing')
          return r.text()
        })
        .then((text) => {
          if (cancelled) return
          setGpxNote(null)
          const doc = new DOMParser().parseFromString(text, 'text/xml')
          if (doc.querySelector('parsererror')) throw new Error('parse')
          const fc = gpx(doc) as FeatureCollection
          if (!fc.features.length) {
            setGpxNote('GPX had no track geometry.')
            return
          }
          const gj = L.geoJSON(fc, {
            style: {
              color: '#6d28d9',
              weight: 3,
              opacity: 0.85,
              dashArray: '8 12',
              lineCap: 'round',
            },
          })
          gj.addTo(layers)
        })
        .catch(() => {
          if (!cancelled) setGpxNote('Could not load GPX overlay.')
        })
    }

    loadGpx()

    return () => {
      cancelled = true
      map.remove()
    }
  }, [
    route,
    waypoints,
    polyline,
    gpxUrl,
    gpxOverlay,
    selectedOptionId,
  ])

  const hasPolyline = polyline.length >= 2
  const hasOptions = (route.routeOptions?.length ?? 0) > 0

  return (
    <section className="route-map-section planning-map-section" aria-labelledby="map-heading">
      <h2 id="map-heading" className="section-title">
        Map
      </h2>

      <div className="map-legend-stack">
        {hasPolyline ? (
          <p className="map-legend map-legend-primary">
            <span className="map-swatch map-swatch-line" aria-hidden />
            Solid green line = suggested hand-drawn route (not a surveyed track).
          </p>
        ) : hasOptions ? (
          <p className="map-note map-note-soft">
            Suggested line not in the data yet — anchors and waypoints still show if we’ve got them.
          </p>
        ) : (
          <p className="map-note map-note-soft">
            No drawn line in the data — you’re looking at anchors, any waypoints, and where the map’s centred.
          </p>
        )}

        {gpxUrl ? (
          <label className="map-gpx-toggle">
            <input
              type="checkbox"
              checked={gpxOverlay}
              onChange={(e) => {
                const on = e.target.checked
                setGpxOverlay(on)
                if (!on) setGpxNote(null)
              }}
            />
            <span>Show recorded GPX overlay (comparison only)</span>
          </label>
        ) : null}

        {gpxOverlay && gpxNote ? <p className="map-note">{gpxNote}</p> : null}
        {gpxOverlay && gpxUrl && !gpxNote ? (
          <p className="map-legend map-legend-gpx">
            <span className="map-swatch map-swatch-gpx" aria-hidden />
            Purple dashed = optional GPX recording, if it loads.
          </p>
        ) : null}
      </div>

      <div ref={containerRef} className="route-map" role="presentation" />
    </section>
  )
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
