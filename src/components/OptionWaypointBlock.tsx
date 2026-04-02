import { useCallback, useState } from 'react'
import type { WaypointJson } from '../types/route'
import { waypointsToCopyText } from '../lib/gridRefs'

interface Props {
  waypoints: WaypointJson[]
  waypointFile?: string
}

export function OptionWaypointBlock({ waypoints, waypointFile }: Props) {
  const [copied, setCopied] = useState(false)
  const text = waypointsToCopyText(waypoints)

  const copy = useCallback(async () => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }, [text])

  if (!waypointFile) return null

  if (waypoints.length === 0) {
    return (
      <p className="option-wp-missing">
        Waypoint file <code className="inline-code">{waypointFile}</code> missing or empty — add
        it when you hook up GPX.
      </p>
    )
  }

  return (
    <div className="option-wp-block">
      <h4 className="route-option-sub">Waypoints for GPX</h4>
      <p className="option-wp-hint">
        In order for this option — names and grids for the GPS app or GPX tool.
      </p>
      <div className="table-scroll">
        <table className="waypoint-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">OS grid</th>
            </tr>
          </thead>
          <tbody>
            {[...waypoints]
              .sort((a, b) => {
                const ao = a.order ?? Number.MAX_SAFE_INTEGER
                const bo = b.order ?? Number.MAX_SAFE_INTEGER
                if (ao !== bo) return ao - bo
                return a.name.localeCompare(b.name)
              })
              .map((w, idx) => (
                <tr key={w.id}>
                  <td>{w.order ?? idx + 1}</td>
                  <th scope="row">{w.name}</th>
                  <td>{w.gridRef ?? '—'}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="btn btn-secondary option-wp-copy" onClick={copy}>
        {copied ? 'Copied' : 'Copy waypoints'}
      </button>
    </div>
  )
}
