import type { AnchorRef } from '../types/route'

interface Props {
  anchors: AnchorRef[]
}

export function AnchorRefsSection({ anchors }: Props) {
  if (!anchors.length) return null

  return (
    <section className="anchor-section" aria-labelledby="anchors-heading">
      <h2 id="anchors-heading" className="section-title">
        Anchor refs
      </h2>
      <p className="anchor-lead">
        Rough grid anchors to sanity-check against the map — not turn-by-turn instructions.
      </p>
      <div className="table-scroll">
        <table className="waypoint-table anchor-table">
          <thead>
            <tr>
              <th scope="col">What</th>
              <th scope="col">OS grid</th>
            </tr>
          </thead>
          <tbody>
            {anchors.map((a, i) => (
              <tr key={`${a.label}-${i}`}>
                <th scope="row">{a.label}</th>
                <td>
                  <code className="grid-code">{a.gridRef}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
