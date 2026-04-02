import { useEffect, useState } from 'react'
import {
  loadAreaDayRoute,
  loadAreaDayWaypoints,
  loadRoute,
  loadWaypoints,
} from '../lib/loadRoutes'
import type { RouteJson, WaypointJson } from '../types/route'

export type RouteBundleKey =
  | { kind: 'route'; slug: string }
  | { kind: 'areaDay'; areaSlug: string; dayId: string }

export function useRouteBundle(key: RouteBundleKey | null) {
  const [route, setRoute] = useState<RouteJson | null | undefined>(undefined)
  const [waypoints, setWaypoints] = useState<WaypointJson[]>([])
  const [optionWaypoints, setOptionWaypoints] = useState<
    Record<string, WaypointJson[]>
  >({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!key) return
    let cancelled = false
    ;(async () => {
      try {
        const r =
          key.kind === 'areaDay'
            ? await loadAreaDayRoute(key.areaSlug, key.dayId)
            : await loadRoute(key.slug)
        if (cancelled) return
        if (!r) {
          setRoute(null)
          setWaypoints([])
          setOptionWaypoints({})
          return
        }
        setRoute(r)
        const wpFile = r.waypointFile ?? 'waypoints.json'
        const wp =
          key.kind === 'areaDay'
            ? await loadAreaDayWaypoints(key.areaSlug, key.dayId, wpFile)
            : await loadWaypoints(key.slug, wpFile)
        if (cancelled) return
        setWaypoints(wp)

        const opts = r.routeOptions ?? []
        const entries = await Promise.all(
          opts.map(async (opt) => {
            if (!opt.waypointFile) return [opt.id, []] as const
            const w =
              key.kind === 'areaDay'
                ? await loadAreaDayWaypoints(
                    key.areaSlug,
                    key.dayId,
                    opt.waypointFile,
                  )
                : await loadWaypoints(key.slug, opt.waypointFile)
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
  }, [key])

  return { route, waypoints, optionWaypoints, error }
}
