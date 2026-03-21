import type { WaypointJson } from '../types/route'

interface Props {
  waypoints: WaypointJson[]
}

export function WaypointTable({ waypoints }: Props) {
  if (waypoints.length === 0) return null

  const rows = [...waypoints].sort((a, b) => {
    const ao = a.order ?? Number.MAX_SAFE_INTEGER
    const bo = b.order ?? Number.MAX_SAFE_INTEGER
    if (ao !== bo) return ao - bo
    return a.name.localeCompare(b.name)
  })

  return (
    <section className="waypoint-section" aria-labelledby="waypoints-heading">
      <h2 id="waypoints-heading" className="section-title">
        Waypoints
      </h2>
      <div className="table-scroll">
        <table className="waypoint-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col">Description</th>
              <th scope="col">OS grid</th>
              <th scope="col">Elev. (m)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((w) => (
              <tr key={w.id}>
                <th scope="row">{w.name}</th>
                <td>{w.type}</td>
                <td>{w.description ?? '—'}</td>
                <td>{w.gridRef ?? '—'}</td>
                <td>{w.elevationM != null ? w.elevationM : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
