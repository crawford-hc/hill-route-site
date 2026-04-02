import type { FeatureCollection, Geometry } from 'geojson'

function countInGeometry(g: Geometry | null | undefined): number {
  if (!g) return 0
  switch (g.type) {
    case 'LineString':
      return g.coordinates.length
    case 'MultiLineString':
      return g.coordinates.reduce((acc, ring) => acc + ring.length, 0)
    case 'GeometryCollection':
      return g.geometries.reduce((acc, gg) => acc + countInGeometry(gg), 0)
    default:
      return 0
  }
}

/** Total LineString / MultiLineString vertices in all features (GPX tracks → lines). */
export function countLineVerticesInFeatureCollection(fc: FeatureCollection): number {
  let n = 0
  for (const f of fc.features) {
    n += countInGeometry(f.geometry)
  }
  return n
}

/** Below this, a single polyline is usually misleading as a “walked” guide on the map. */
export const GPX_MIN_VERTICES_FOR_LINE = 8

export const GPX_TOO_SPARSE_FOR_MAP_LINE =
  'This GPX has too few track points to show a realistic path on the map. You can still download the file below for your own tools.'
