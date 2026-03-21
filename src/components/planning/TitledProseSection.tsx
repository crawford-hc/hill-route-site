interface Props {
  id: string
  title: string
  body: string
  supporting?: string
  className?: string
}

export function TitledProseSection({
  id,
  title,
  body,
  supporting,
  className = '',
}: Props) {
  return (
    <section className={`planning-section ${className}`.trim()} aria-labelledby={id}>
      <h2 id={id} className="planning-section-title">
        {title}
      </h2>
      <p className="planning-prose">{body}</p>
      {supporting ? <p className="planning-prose-support">{supporting}</p> : null}
    </section>
  )
}
