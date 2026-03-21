import { useCallback, useState } from 'react'
import type { AnchorRef } from '../../types/route'

interface Props {
  title?: string
  intro?: string
  anchors: AnchorRef[]
}

export function AnchorRefsPanel({ title, intro, anchors }: Props) {
  const [copied, setCopied] = useState(false)
  const text = anchors.map((a) => `${a.label}: ${a.gridRef}`).join('\n')

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

  if (!anchors.length) return null

  const heading = title ?? 'Useful anchor refs'
  const id = 'anchor-refs-heading'

  return (
    <section className="planning-anchor-panel" aria-labelledby={id}>
      <h2 id={id} className="planning-section-title">
        {heading}
      </h2>
      {intro ? <p className="planning-anchor-intro">{intro}</p> : null}
      <div className="planning-anchor-layout">
        <ul className="planning-anchor-list">
          {anchors.map((a, i) => (
            <li key={i} className="planning-anchor-row">
              <span className="planning-anchor-label">{a.label}</span>
              <code className="planning-anchor-grid">{a.gridRef}</code>
            </li>
          ))}
        </ul>
        <div className="planning-anchor-actions">
          <pre className="planning-anchor-pre" tabIndex={0}>
            {text}
          </pre>
          <button type="button" className="btn btn-primary" onClick={copy}>
            {copied ? 'Copied' : 'Copy anchors'}
          </button>
        </div>
      </div>
    </section>
  )
}
