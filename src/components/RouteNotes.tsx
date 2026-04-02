interface Props {
  notes: string[]
}

export function RouteNotes({ notes }: Props) {
  if (!notes?.length) return null

  return (
    <section className="notes-section" aria-labelledby="notes-heading">
      <h2 id="notes-heading" className="section-title">
        Notes
      </h2>
      <ul className="notes-list">
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </section>
  )
}
