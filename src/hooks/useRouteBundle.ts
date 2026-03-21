import { useEffect, useState } from 'react'
import { loadRoute, loadWaypoints } from '../lib/loadRoutes'
import type { RouteJson, WaypointJson } from '../types/route'

export function useRouteBundle(slug: string | undefined) {
  const [route, setRoute] = useState<RouteJson | null | undefined>(undefined)
  const [waypoints, setWaypoints] = useState<WaypointJson[]>([])
  const [optionWaypoints, setOptionWaypoints] = useState<
    Record<string, WaypointJson[]>
  >({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    ;(async () => {
      try {
        const r = await loadRoute(slug)
        if (cancelled) return
        if (!r) {
          setRoute(null)
          setWaypoints([])
          setOptionWaypoints({})
          return
        }
        setRoute(r)
        const wpFile = r.waypointFile ?? 'waypoints.json'
        const wp = await loadWaypoints(slug, wpFile)
        if (cancelled) return
        setWaypoints(wp)

        const opts = r.routeOptions ?? []
        const entries = await Promise.all(
          opts.map(async (opt) => {
            if (!opt.waypointFile) return [opt.id, []] as const
            const w = await loadWaypoints(slug, opt.waypointFile)
            return [opt.id, w] as const
          }),
        )
        if (!cancelled) setOptionWaypoints(Object.fromEntries(entries))
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error loading route')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug])

  return { route, waypoints, optionWaypoints, error }
}
