import type { AttributedImage, RouteJson } from '../../types/route'
import { routeMediaUrl } from '../../lib/publicUrl'

interface Props {
  route: RouteJson
  title?: string
  intro?: string
  items: AttributedImage[]
}

function hasCreditBlock(item: AttributedImage): boolean {
  return Boolean(
    item.attributionText?.trim() ||
      item.licenseName?.trim() ||
      item.sourceName?.trim(),
  )
}

export function LookoutGallery({ route, title, intro, items }: Props) {
  if (!items.length) return null

  const h = 'lookout-gallery-heading'
  return (
    <section className="planning-lookout" aria-labelledby={h}>
      <h2 id={h} className="planning-section-title">
        {title ?? 'What to look out for'}
      </h2>
      {intro ? <p className="planning-prose planning-lookout-intro">{intro}</p> : null}
      <div className="planning-lookout-grid">
        {items.map((item) => {
          const imgAlt = item.imageAlt?.trim() || item.title
          const structured = item.description != null
          const d = item.description?.trim()
          const why = item.whyToday?.trim()
          const bit = item.interestingBit?.trim()
          const legacyCaption = item.caption?.trim() ?? ''
          return (
            <figure key={item.id} className="planning-figure">
              <div className="planning-figure-frame">
                {item.imageUrl ? (
                  <img
                    src={routeMediaUrl(route, item.imageUrl)}
                    alt={imgAlt}
                    className="planning-figure-img"
                    loading="lazy"
                  />
                ) : (
                  <div className="planning-figure-placeholder">
                    <span>No image yet</span>
                    <small>Drop an open-licensed file in the route folder and point imageUrl at it</small>
                  </div>
                )}
              </div>
              <figcaption className="planning-figure-cap">
                <span className="planning-figure-title">{item.title}</span>
                {structured ? (
                  <>
                    {d ? <p className="planning-figure-caption">{d}</p> : null}
                    {why ? <p className="planning-figure-caption">{why}</p> : null}
                    {bit ? <p className="planning-figure-caption">{bit}</p> : null}
                  </>
                ) : legacyCaption ? (
                  <p className="planning-figure-caption">{legacyCaption}</p>
                ) : null}
                {hasCreditBlock(item) ? (
                  <div className="planning-figure-credit">
                    {item.attributionText?.trim() ? (
                      <p className="planning-figure-attrib">{item.attributionText}</p>
                    ) : null}
                    <p className="planning-figure-license">
                      {item.licenseUrl ? (
                        <a href={item.licenseUrl} target="_blank" rel="noreferrer">
                          {item.licenseName}
                        </a>
                      ) : (
                        item.licenseName
                      )}
                      {item.sourceUrl ? (
                        <>
                          {' · '}
                          <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                            {item.sourceName}
                          </a>
                        </>
                      ) : item.sourceName?.trim() ? (
                        <> · {item.sourceName}</>
                      ) : null}
                    </p>
                  </div>
                ) : null}
              </figcaption>
            </figure>
          )
        })}
      </div>
    </section>
  )
}
