import { useCallback, useState } from 'react'
import { collectGridRefs, gridRefsPlainText } from '../lib/gridRefs'
import type { RouteJson, WaypointJson } from '../types/route'

interface Props {
  route: RouteJson
  waypoints: WaypointJson[]
  title?: string
  hint?: string
}

export function GridRefsBlock({ route, waypoints, title, hint }: Props) {
  const lines = collectGridRefs(route, waypoints)
  const text = gridRefsPlainText(lines)
  const [copied, setCopied] = useState(false)

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

  if (lines.length === 0) return null

  return (
    <section className="gridrefs-section planning-gridrefs" aria-labelledby="gridrefs-heading">
      <h2 id="gridrefs-heading" className="section-title">
        {title ?? 'Grid references'}
      </h2>
      <p className="gridrefs-hint">
        {hint ??
          'Paste into phone or paper. Lines are start, finish, anchors, and any waypoint with a grid.'}
      </p>
      <div className="gridrefs-block">
        <pre className="gridrefs-pre" tabIndex={0}>
          {text}
        </pre>
        <button type="button" className="btn btn-primary gridrefs-copy" onClick={copy}>
          {copied ? 'Copied' : 'Copy all'}
        </button>
      </div>
    </section>
  )
}
