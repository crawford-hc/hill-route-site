interface Props {
  /** Screen-reader / visible heading */
  title?: string
  text: string
}

export function RouteDisclaimer({ title = 'Suggested line only', text }: Props) {
  if (!text.trim()) return null

  return (
    <aside className="route-disclaimer" role="note">
      <h2 className="route-disclaimer-title">{title}</h2>
      <p className="route-disclaimer-text">{text}</p>
    </aside>
  )
}
