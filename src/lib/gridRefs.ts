import type { RouteJson, WaypointJson } from '../types/route'

export interface GridRefLine {
  label: string
  ref: string
}

export function collectGridRefs(
  route: RouteJson,
  waypoints: WaypointJson[],
): GridRefLine[] {
  const lines: GridRefLine[] = []
  if (route.startGridRef?.trim()) {
    lines.push({ label: 'Start', ref: route.startGridRef.trim() })
  }
  if (route.finishGridRef?.trim()) {
    lines.push({ label: 'Finish', ref: route.finishGridRef.trim() })
  }

  for (const a of route.anchorRefs ?? []) {
    const ref = a.gridRef?.trim()
    if (ref) lines.push({ label: a.label, ref })
  }

  const sorted = [...waypoints].sort((a, b) => {
    const ao = a.order ?? Number.MAX_SAFE_INTEGER
    const bo = b.order ?? Number.MAX_SAFE_INTEGER
    if (ao !== bo) return ao - bo
    return a.name.localeCompare(b.name)
  })

  for (const w of sorted) {
    const ref = w.gridRef?.trim()
    if (ref) lines.push({ label: w.name, ref })
  }
  return lines
}

export function gridRefsPlainText(lines: GridRefLine[]): string {
  return lines.map((l) => `${l.label}: ${l.ref}`).join('\n')
}

export function waypointsToCopyText(waypoints: WaypointJson[]): string {
  const rows = [...waypoints].sort((a, b) => {
    const ao = a.order ?? Number.MAX_SAFE_INTEGER
    const bo = b.order ?? Number.MAX_SAFE_INTEGER
    if (ao !== bo) return ao - bo
    return a.name.localeCompare(b.name)
  })
  return rows
    .map((w) => (w.gridRef?.trim() ? `${w.name}: ${w.gridRef.trim()}` : w.name))
    .join('\n')
}
