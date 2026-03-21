import type { Landmark } from '../types/route'

interface Props {
  title: string
  items: Landmark[]
  id: string
}

export function LandmarkList({ title, items, id }: Props) {
  if (!items?.length) return null

  return (
    <section className="landmark-section" aria-labelledby={id}>
      <h2 id={id} className="section-title">
        {title}
      </h2>
      <ul className="landmark-list">
        {items.map((item, index) => (
          <li key={`${item.title}-${index}`} className="landmark-item">
            <h3 className="landmark-title">{item.title}</h3>
            <p className="landmark-desc">{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
